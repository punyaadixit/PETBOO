/**
 * Database setup script
 * Creates the petsphere database and runs the schema
 * Usage: node setup-db.js
 */

const { Client } = require('pg');

const PG_PASSWORD = 'admin@123';
const DB_NAME = 'petsphere';

async function run() {
  // Step 1: Connect to default 'postgres' database to create our DB
  console.log('🔌 Connecting to PostgreSQL...');
  const adminClient = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: PG_PASSWORD,
    database: 'postgres',
  });

  try {
    await adminClient.connect();
    console.log('✅ Connected to PostgreSQL!');
  } catch (err) {
    console.error('❌ Cannot connect to PostgreSQL. Is it running?');
    console.error('   Error:', err.message);
    process.exit(1);
  }

  // Step 2: Create the database if it doesn't exist
  try {
    const check = await adminClient.query(
      `SELECT 1 FROM pg_database WHERE datname = '${DB_NAME}'`
    );
    if (check.rows.length === 0) {
      await adminClient.query(`CREATE DATABASE "${DB_NAME}"`);
      console.log(`✅ Database "${DB_NAME}" created!`);
    } else {
      console.log(`✅ Database "${DB_NAME}" already exists.`);
    }
  } catch (err) {
    console.error('❌ Failed to create database:', err.message);
    process.exit(1);
  }
  await adminClient.end();

  // Step 3: Connect to the new database and run schema
  console.log(`🔌 Connecting to "${DB_NAME}" database...`);
  const dbClient = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: PG_PASSWORD,
    database: DB_NAME,
  });

  await dbClient.connect();

  // Step 4: Run the schema
  console.log('📦 Creating tables...');

  // Drop old Grooming tables to force schema refresh and seeding
  await dbClient.query(`DROP TABLE IF EXISTS "GroomerReview" CASCADE`);
  await dbClient.query(`DROP TABLE IF EXISTS "GroomingBooking" CASCADE`);
  await dbClient.query(`DROP TABLE IF EXISTS "GroomingService" CASCADE`);
  await dbClient.query(`DROP TABLE IF EXISTS "Groomer" CASCADE`);

  await dbClient.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);
  
  // Try to enable vector extension (may not be available locally)
  try {
    await dbClient.query(`CREATE EXTENSION IF NOT EXISTS "vector"`);
    console.log('   ✅ pgvector extension enabled');
  } catch {
    console.log('   ⚠️ pgvector extension not available (RAG will use mock mode)');
  }

  // User table
  await dbClient.query(`
    CREATE TABLE IF NOT EXISTS "User" (
      "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      "email" TEXT NOT NULL UNIQUE,
      "name" TEXT NOT NULL,
      "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `);
  console.log('   ✅ User table');

  // Pet table
  await dbClient.query(`
    CREATE TABLE IF NOT EXISTS "Pet" (
      "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      "name" TEXT NOT NULL,
      "breed" TEXT NOT NULL,
      "age" INTEGER NOT NULL,
      "weight" DOUBLE PRECISION NOT NULL,
      "userId" UUID NOT NULL,
      "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
      CONSTRAINT "Pet_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "User"("id")
        ON DELETE CASCADE ON UPDATE CASCADE
    )
  `);
  console.log('   ✅ Pet table');

  // Veterinarian table
  await dbClient.query(`
    CREATE TABLE IF NOT EXISTS "Veterinarian" (
      "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      "name" TEXT NOT NULL,
      "email" TEXT,
      "phone" TEXT,
      "specialization" TEXT NOT NULL,
      "experience" INTEGER NOT NULL DEFAULT 0,
      "clinic" TEXT NOT NULL,
      "address" TEXT,
      "city" TEXT NOT NULL,
      "lat" DOUBLE PRECISION,
      "lng" DOUBLE PRECISION,
      "consultationFee" DOUBLE PRECISION NOT NULL,
      "rating" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
      "reviewCount" INTEGER NOT NULL DEFAULT 0,
      "imageUrl" TEXT,
      "availableDays" TEXT[] DEFAULT '{}',
      "availableTimeStart" TEXT,
      "availableTimeEnd" TEXT,
      "isAvailable" BOOLEAN NOT NULL DEFAULT TRUE,
      "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `);
  console.log('   ✅ Veterinarian table');

  // Appointment table
  await dbClient.query(`
    CREATE TABLE IF NOT EXISTS "Appointment" (
      "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      "userId" UUID NOT NULL,
      "petId" UUID NOT NULL,
      "vetId" UUID NOT NULL,
      "date" TEXT NOT NULL,
      "time" TEXT NOT NULL,
      "type" TEXT NOT NULL DEFAULT 'in-person',
      "status" TEXT NOT NULL DEFAULT 'upcoming',
      "notes" TEXT,
      "prescription" TEXT,
      "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
      CONSTRAINT "Appointment_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
      CONSTRAINT "Appointment_petId_fkey"
        FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE CASCADE,
      CONSTRAINT "Appointment_vetId_fkey"
        FOREIGN KEY ("vetId") REFERENCES "Veterinarian"("id") ON DELETE CASCADE
    )
  `);
  console.log('   ✅ Appointment table');

  // Review table
  await dbClient.query(`
    CREATE TABLE IF NOT EXISTS "Review" (
      "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      "userId" UUID NOT NULL,
      "vetId" UUID NOT NULL,
      "appointmentId" UUID,
      "rating" INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
      "comment" TEXT,
      "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
      CONSTRAINT "Review_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
      CONSTRAINT "Review_vetId_fkey"
        FOREIGN KEY ("vetId") REFERENCES "Veterinarian"("id") ON DELETE CASCADE
    )
  `);
  console.log('   ✅ Review table');

  // Consultation table
  await dbClient.query(`
    CREATE TABLE IF NOT EXISTS "Consultation" (
      "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      "appointmentId" UUID NOT NULL,
      "type" TEXT NOT NULL,
      "startTime" TIMESTAMP NOT NULL DEFAULT NOW(),
      "endTime" TIMESTAMP,
      "duration" DOUBLE PRECISION,
      "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
      CONSTRAINT "Consultation_appointmentId_fkey"
        FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE CASCADE
    )
  `);
  console.log('   ✅ Consultation table');

  // ChatHistory table
  await dbClient.query(`
    CREATE TABLE IF NOT EXISTS "ChatHistory" (
      "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      "sessionId" TEXT NOT NULL DEFAULT gen_random_uuid()::TEXT,
      "userId" UUID NOT NULL,
      "role" TEXT NOT NULL,
      "message" TEXT NOT NULL,
      "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
      CONSTRAINT "ChatHistory_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "User"("id")
        ON DELETE CASCADE ON UPDATE CASCADE
    )
  `);
  console.log('   ✅ ChatHistory table');

  // Product table
  await dbClient.query(`
    CREATE TABLE IF NOT EXISTS "Product" (
      "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      "name" TEXT NOT NULL,
      "description" TEXT,
      "price" DOUBLE PRECISION NOT NULL,
      "category" TEXT NOT NULL,
      "imageUrl" TEXT,
      "inStock" BOOLEAN NOT NULL DEFAULT TRUE,
      "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `);
  console.log('   ✅ Product table');

  // KnowledgeDocument table
  try {
    await dbClient.query(`
      CREATE TABLE IF NOT EXISTS "KnowledgeDocument" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "text" TEXT NOT NULL,
        "embedding" vector(384),
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    console.log('   ✅ KnowledgeDocument table (with vector)');
  } catch {
    await dbClient.query(`
      CREATE TABLE IF NOT EXISTS "KnowledgeDocument" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "text" TEXT NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    console.log('   ✅ KnowledgeDocument table (without vector)');
  }

  // Grooming tables
  await dbClient.query(`
    CREATE TABLE IF NOT EXISTS "Groomer" (
      "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      "name" TEXT NOT NULL,
      "email" TEXT,
      "phone" TEXT,
      "bio" TEXT,
      "profileImage" TEXT,
      "experienceYears" INTEGER NOT NULL DEFAULT 0,
      "address" TEXT,
      "city" TEXT NOT NULL DEFAULT 'Bhilai',
      "location" TEXT,
      "lat" DOUBLE PRECISION,
      "lng" DOUBLE PRECISION,
      "rating" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
      "reviewCount" INTEGER NOT NULL DEFAULT 0,
      "availableDays" TEXT[] DEFAULT '{}',
      "availableTimeStart" TEXT DEFAULT '09:00',
      "availableTimeEnd" TEXT DEFAULT '18:00',
      "isAvailable" BOOLEAN NOT NULL DEFAULT TRUE,
      "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `);
  console.log('   ✅ Groomer table');

  await dbClient.query(`
    CREATE TABLE IF NOT EXISTS "GroomingService" (
      "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      "groomerId" UUID NOT NULL,
      "title" TEXT NOT NULL,
      "description" TEXT,
      "price" DOUBLE PRECISION NOT NULL,
      "durationMins" INTEGER NOT NULL,
      "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
      CONSTRAINT "GroomingService_groomerId_fkey"
        FOREIGN KEY ("groomerId") REFERENCES "Groomer"("id") ON DELETE CASCADE ON UPDATE CASCADE
    )
  `);
  console.log('   ✅ GroomingService table');

  await dbClient.query(`
    CREATE TABLE IF NOT EXISTS "GroomingBooking" (
      "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      "userId" UUID NOT NULL,
      "groomerId" UUID NOT NULL,
      "petId" UUID,
      "serviceId" UUID NOT NULL,
      "appointmentDate" TIMESTAMP NOT NULL,
      "status" TEXT NOT NULL DEFAULT 'pending',
      "notes" TEXT,
      "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
      CONSTRAINT "GroomingBooking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
      CONSTRAINT "GroomingBooking_groomerId_fkey" FOREIGN KEY ("groomerId") REFERENCES "Groomer"("id") ON DELETE CASCADE,
      CONSTRAINT "GroomingBooking_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "GroomingService"("id") ON DELETE CASCADE,
      CONSTRAINT "GroomingBooking_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE SET NULL
    )
  `);
  console.log('   ✅ GroomingBooking table');

  await dbClient.query(`
    CREATE TABLE IF NOT EXISTS "GroomerReview" (
      "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      "userId" UUID NOT NULL,
      "groomerId" UUID NOT NULL,
      "rating" INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
      "comment" TEXT,
      "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
      CONSTRAINT "GroomerReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
      CONSTRAINT "GroomerReview_groomerId_fkey" FOREIGN KEY ("groomerId") REFERENCES "Groomer"("id") ON DELETE CASCADE
    )
  `);
  console.log('   ✅ GroomerReview table');

  // Indexes
  await dbClient.query(`CREATE INDEX IF NOT EXISTS "Pet_userId_idx" ON "Pet"("userId")`);
  await dbClient.query(`CREATE INDEX IF NOT EXISTS "ChatHistory_userId_idx" ON "ChatHistory"("userId")`);
  await dbClient.query(`CREATE INDEX IF NOT EXISTS "ChatHistory_sessionId_idx" ON "ChatHistory"("sessionId")`);
  await dbClient.query(`CREATE INDEX IF NOT EXISTS "Product_category_idx" ON "Product"("category")`);
  await dbClient.query(`CREATE INDEX IF NOT EXISTS "GroomingService_groomerId_idx" ON "GroomingService"("groomerId")`);
  await dbClient.query(`CREATE INDEX IF NOT EXISTS "GroomingBooking_userId_idx" ON "GroomingBooking"("userId")`);
  await dbClient.query(`CREATE INDEX IF NOT EXISTS "GroomingBooking_groomerId_idx" ON "GroomingBooking"("groomerId")`);
  await dbClient.query(`CREATE INDEX IF NOT EXISTS "GroomerReview_groomerId_idx" ON "GroomerReview"("groomerId")`);
  await dbClient.query(`CREATE INDEX IF NOT EXISTS "Appointment_userId_idx" ON "Appointment"("userId")`);
  await dbClient.query(`CREATE INDEX IF NOT EXISTS "Appointment_vetId_idx" ON "Appointment"("vetId")`);
  await dbClient.query(`CREATE INDEX IF NOT EXISTS "Review_vetId_idx" ON "Review"("vetId")`);
  await dbClient.query(`CREATE INDEX IF NOT EXISTS "Consultation_appointmentId_idx" ON "Consultation"("appointmentId")`);
  console.log('   ✅ Indexes created');

  // Step 5: Seed products if table is empty
  const productCount = await dbClient.query(`SELECT COUNT(*) FROM "Product"`);
  if (parseInt(productCount.rows[0].count) === 0) {
    console.log('🌱 Seeding products...');
    await dbClient.query(`
      INSERT INTO "Product" ("name", "description", "price", "category", "imageUrl", "inStock") VALUES
        ('Premium Chicken Kibble', 'High-protein dry dog food made with real chicken. Grain-free formula.', 1299, 'Packaged Food', NULL, TRUE),
        ('Salmon & Rice Dog Food', 'Omega-rich salmon recipe with brown rice for healthy skin and coat.', 1499, 'Packaged Food', NULL, TRUE),
        ('Tuna Delight Cat Food', 'Gourmet wet cat food with real tuna chunks in gravy.', 199, 'Packaged Food', NULL, TRUE),
        ('Puppy Growth Formula', 'Specially formulated for puppies with DHA for brain development.', 999, 'Packaged Food', NULL, TRUE),
        ('Rope Tug Toy', 'Durable cotton rope toy perfect for fetch and tug-of-war.', 349, 'Toys', NULL, TRUE),
        ('Squeaky Ball Set (3 pack)', 'Colorful bouncy balls that squeak. Great for indoor and outdoor play.', 499, 'Toys', NULL, TRUE),
        ('Interactive Puzzle Feeder', 'Mental stimulation toy that dispenses treats as your pet solves the puzzle.', 799, 'Toys', NULL, TRUE),
        ('Catnip Mouse Toy', 'Soft plush mouse filled with premium catnip. Irresistible for cats!', 249, 'Toys', NULL, TRUE),
        ('Adjustable Dog Harness', 'Breathable mesh harness with reflective strips for night walks.', 899, 'Accessories', NULL, TRUE),
        ('Stainless Steel Pet Bowl', 'Non-slip, rust-resistant bowl. Dishwasher safe. 500ml capacity.', 399, 'Accessories', NULL, TRUE),
        ('Pet Grooming Kit', 'Complete grooming set with brush, nail clipper, and comb.', 1199, 'Accessories', NULL, TRUE),
        ('Cozy Pet Bed (Medium)', 'Ultra-soft orthopedic pet bed with removable, washable cover.', 2499, 'Accessories', NULL, TRUE),
        ('Fresh Chicken & Veggie Bowl', 'Freshly prepared chicken breast with sweet potato and green beans.', 349, 'Fresh Food', NULL, TRUE),
        ('Beef & Brown Rice Meal', 'Lean ground beef with brown rice and carrots. Vet-approved recipe.', 399, 'Fresh Food', NULL, TRUE),
        ('Fish & Quinoa Dinner', 'Wild-caught fish with quinoa and spinach. Rich in Omega-3.', 449, 'Fresh Food', NULL, TRUE),
        ('Turkey & Pumpkin Stew', 'Slow-cooked turkey with pumpkin puree. Easy on sensitive tummies.', 379, 'Fresh Food', NULL, TRUE)
    `);
    console.log('   ✅ 16 products seeded!');
  } else {
    console.log(`🌱 Products already seeded (${productCount.rows[0].count} found).`);
  }

  // Step 5.1: Seed groomers if table is empty
  const groomerCount = await dbClient.query(`SELECT COUNT(*) FROM "Groomer"`);
  if (parseInt(groomerCount.rows[0].count) === 0) {
    console.log('🌱 Seeding groomers...');
    const groomerRes = await dbClient.query(`
      INSERT INTO "Groomer" ("name", "email", "phone", "bio", "profileImage", "experienceYears", "address", "city", "location", "rating", "reviewCount", "availableDays", "isAvailable") VALUES
        ('Priya Sharma', 'priya.s@groomers.com', '+91-9998887771', 'Certified pet stylist specializing in anxious dogs and cats.', 'https://images.unsplash.com/photo-1595085610896-1d16a695c0dc?w=400', 8, 'Sector 6, Near Central Park', 'Bhilai', 'Sector 6, Bhilai', 4.9, 15, '{"Mon", "Tue", "Wed", "Thu", "Fri"}', TRUE),
        ('Aarav Patel', 'aarav.p@groomers.com', '+91-9998887772', 'Expert in large breeds and double-coated dogs.', 'https://images.unsplash.com/photo-1537151625747-768b6fc40db5?w=400', 5, 'Supela Market Area', 'Bhilai', 'Supela, Bhilai', 4.7, 8, '{"Mon", "Wed", "Fri", "Sat"}', TRUE),
        ('Ananya Iyer', 'ananya.i@groomers.com', '+91-9998887773', 'Cat grooming specialist. Fear-free certified.', 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400', 12, 'Nehru Nagar West', 'Bhilai', 'Nehru Nagar, Bhilai', 5.0, 24, '{"Tue", "Thu", "Sat"}', TRUE),
        ('Vikram Singh', 'vikram.s@groomers.com', '+91-9998887774', 'All-breed grooming expert with a passion for creative cuts.', 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400', 6, '45 Green Glen Layout', 'Bangalore', 'Koramangala, Bangalore', 4.8, 12, '{"Mon", "Tue", "Wed", "Thu"}', TRUE),
        ('Rohan Das', 'rohan.d@groomers.com', '+91-9998887775', 'Professional groomer focusing on dog safety and clean styling.', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400', 10, 'Shankar Nagar, VIP Road', 'Raipur', 'VIP Road, Raipur', 4.6, 9, '{"Wed", "Thu", "Fri", "Sat", "Sun"}', TRUE)
      RETURNING id;
    `);
    
    const priyaId = groomerRes.rows[0].id;
    const aaravId = groomerRes.rows[1].id;
    const ananyaId = groomerRes.rows[2].id;
    const vikramId = groomerRes.rows[3].id;
    const rohanId = groomerRes.rows[4].id;
 
    await dbClient.query(`
      INSERT INTO "GroomingService" ("groomerId", "title", "description", "price", "durationMins") VALUES
        ('${priyaId}', 'Bath & Dry', 'Premium shampoo, blow dry, and thorough brushing.', 45.00, 60),
        ('${priyaId}', 'Full Groom Package', 'Bath, haircut, nail trim, and ear cleaning.', 85.00, 120),
        ('${aaravId}', 'Deshedding Treatment', 'Specialized treatment to reduce shedding up to 90%.', 65.00, 90),
        ('${aaravId}', 'Nail Clipping & Filing', 'Gentle nail trimming and smoothing.', 15.00, 20),
        ('${ananyaId}', 'Feline Spa Day', 'Waterless bath, gentle brushing, and nail trim for cats.', 55.00, 60),
        ('${ananyaId}', 'Flea & Tick Treatment', 'Safe and effective parasite removal bath.', 75.00, 60),
        ('${vikramId}', 'Puppy Grooming', 'Introduces puppies to grooming with a gentle bath and blow dry.', 40.00, 45),
        ('${vikramId}', 'Full Groom Package', 'Standard bath, customized haircut, and hygiene clipping.', 80.00, 100),
        ('${rohanId}', 'Deodorizing Bath', 'Removes tough odors with deep-cleaning organic shampoo.', 50.00, 50),
        ('${rohanId}', 'Ear & Eye Cleaning', 'Safe cleaning of tear stains and ear canals.', 20.00, 30)
    `);
    console.log('   ✅ Groomers and services seeded!');
  } else {
    console.log(`🌱 Groomers already seeded (${groomerCount.rows[0].count} found).`);
  }

  // Step 5.2: Seed veterinarians if table is empty
  const vetCount = await dbClient.query(`SELECT COUNT(*) FROM "Veterinarian"`);
  if (parseInt(vetCount.rows[0].count) === 0) {
    console.log('🌱 Seeding veterinarians...');
    await dbClient.query(`
      INSERT INTO "Veterinarian" ("id", "name", "email", "phone", "specialization", "experience", "clinic", "address", "city", "lat", "lng", "consultationFee", "rating", "reviewCount", "imageUrl", "availableDays", "availableTimeStart", "availableTimeEnd", "isAvailable") VALUES
        ('9a7b0001-c852-4467-929a-5d79d52379a1', 'Dr. Priya Sharma', 'priya.sharma@petvet.com', '+91-9876543210', 'General Veterinary', 12, 'PawCare Animal Hospital', '45, MG Road, Koramangala', 'Bangalore', 12.9352, 77.6245, 800, 4.8, 124, NULL, '{"Mon", "Tue", "Wed", "Thu", "Fri"}', '09:00', '18:00', TRUE),
        ('9a7b0002-c852-4467-929a-5d79d52379a2', 'Dr. Arjun Patel', 'arjun.patel@petvet.com', '+91-9876543211', 'Orthopedic Surgery', 15, 'VetLife Specialty Clinic', '12, Indiranagar 100ft Road', 'Bangalore', 12.9784, 77.6408, 1500, 4.9, 89, NULL, '{"Mon", "Wed", "Fri"}', '10:00', '16:00', TRUE),
        ('9a7b0003-c852-4467-929a-5d79d52379a3', 'Dr. Sneha Reddy', 'sneha.reddy@petvet.com', '+91-9876543212', 'Dermatology', 8, 'SkinPaw Dermatology Center', '78, Whitefield Main Road', 'Bangalore', 12.9698, 77.7500, 1000, 4.6, 67, NULL, '{"Tue", "Thu", "Sat"}', '09:00', '17:00', TRUE),
        ('9a7b0004-c852-4467-929a-5d79d52379a4', 'Dr. Rahul Mehta', 'rahul.mehta@petvet.com', '+91-9876543213', 'Cardiology', 20, 'HeartPet Cardiac Care', '23, Bandra West', 'Mumbai', 19.0596, 72.8295, 2000, 4.9, 203, NULL, '{"Mon", "Tue", "Wed", "Thu", "Fri", "Sat"}', '08:00', '20:00', TRUE)
    `);
    console.log('   ✅ 4 veterinarians seeded!');
  } else {
    console.log(`🌱 Veterinarians already seeded (${vetCount.rows[0].count} found).`);
  }

  await dbClient.end();

  // Step 6: Print the DATABASE_URL
  const dbUrl = `postgresql://postgres:${encodeURIComponent(PG_PASSWORD)}@localhost:5432/${DB_NAME}`;
  console.log('\n🎉 Database setup complete!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Your DATABASE_URL:');
  console.log(`  ${dbUrl}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

run().catch((err) => {
  console.error('❌ Setup failed:', err.message);
  process.exit(1);
});
