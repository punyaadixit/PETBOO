const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const aiRoutes = require('./src/routes/aiRoutes');
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const petRoutes = require('./src/routes/petRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const productRoutes = require('./src/routes/productRoutes');
const vetRoutes = require('./src/routes/vetRoutes');
const appointmentRoutes = require('./src/routes/appointmentRoutes');
const groomingRoutes = require('./src/routes/groomingRoutes');

const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '.env'), override: true });

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/pets', petRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/vets', vetRoutes);
app.use('/api/v1/appointments', appointmentRoutes);
app.use('/api/v1/groomers', groomingRoutes);

app.get('/', (_req, res) => {
  res.send('PetSphere Backend API is running perfectly!');
});

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(PORT, () => {
  const dbConfigured = !!process.env.DATABASE_URL;
  const authConfigured = !!(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY);
  const aiConfigured = !!process.env.GROQ_API_KEY;

  console.log(`\n🐾 PetSphere backend running on http://localhost:${PORT}`);
  console.log(`   Database:  ${dbConfigured ? '✅ PostgreSQL' : '⚡ In-memory mock data'}`);
  console.log(`   Auth:      ${authConfigured ? '✅ Supabase' : '⚡ Demo mode only'}`);
  console.log(`   AI Chat:   ${aiConfigured ? '✅ Groq API' : '⚡ Mock responses'}\n`);
});
