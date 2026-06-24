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
  await dbClient.query(`DROP TABLE IF EXISTS "ActivityLog" CASCADE`);

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
  `);
  console.log('   ✅ GroomerReview table');

  // ActivityLog table
  await dbClient.query(`
    CREATE TABLE IF NOT EXISTS "ActivityLog" (
      "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      "petId" UUID NOT NULL,
      "type" TEXT NOT NULL,
      "value" DOUBLE PRECISION NOT NULL,
      "date" DATE NOT NULL,
      "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
      CONSTRAINT "ActivityLog_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE CASCADE ON UPDATE CASCADE
    )
  `);
  console.log('   ✅ ActivityLog table');

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
  await dbClient.query(`CREATE INDEX IF NOT EXISTS "ActivityLog_petId_idx" ON "ActivityLog"("petId")`);
  await dbClient.query(`CREATE INDEX IF NOT EXISTS "ActivityLog_date_idx" ON "ActivityLog"("date" DESC)`);
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
        ('Turkey & Pumpkin Stew', 'Slow-cooked turkey with pumpkin puree. Easy on sensitive tummies.', 379, 'Fresh Food', NULL, TRUE),
        ('Grain-Free Salmon Kibble', 'Grain-free dry food with salmon, sweet potato, and superfoods.', 1599, 'Packaged Food', NULL, TRUE),
        ('Plush Squeaker Bone', 'Soft toy with hidden squeaker designed for gentle play.', 299, 'Toys', NULL, TRUE),
        ('LED Safety Collar', 'Rechargeable LED collar for night walks and visibility.', 499, 'Accessories', NULL, TRUE),
        ('Travel Water Bottle', 'Leak-proof water bottle with attached dish for walks and travel.', 699, 'Accessories', NULL, TRUE),
        ('Veggie Chicken Mash', 'Fresh chicken mash with pumpkin and peas for picky eaters.', 329, 'Fresh Food', NULL, TRUE),
        ('Mutton & Brown Rice Bowl', 'Fresh mutton with brown rice and vegetables. High protein.', 409, 'Fresh Food', NULL, TRUE)
    `);
    console.log('   ✅ 22 products seeded!');
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
        ('Rohan Das', 'rohan.d@groomers.com', '+91-9998887775', 'Professional groomer focusing on dog safety and clean styling.', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400', 10, 'Shankar Nagar, VIP Road', 'Raipur', 'VIP Road, Raipur', 4.6, 9, '{"Wed", "Thu", "Fri", "Sat", "Sun"}', TRUE),
        ('Maya Rao', 'maya.r@groomers.com', '+91-9998887776', 'Specializes in breed-specific styling with a calm, mobile grooming service.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400', 9, 'Sector 9 Market', 'Raipur', 'Sector 9, Raipur', 4.7, 10, '{"Mon", "Tue", "Thu", "Fri"}', TRUE),
        ('Sahil Khanna', 'sahil.k@groomers.com', '+91-9998887777', 'Skilled in precision trims and sensitive coat handling for small breeds.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400', 7, 'Indiranagar', 'Bangalore', 'Indiranagar, Bangalore', 4.8, 14, '{"Tue", "Wed", "Fri", "Sat"}', TRUE),
        ('Nisha Kapoor', 'nisha.k@groomers.com', '+91-9998887778', 'Delhi-based stylist for show-quality cuts and calming grooming experiences.', 'https://images.unsplash.com/photo-1556228724-4f6e81bb9d64?w=400', 11, 'South Delhi', 'Delhi', 'South Delhi, Delhi', 4.6, 18, '{"Mon", "Wed", "Thu", "Sat"}', TRUE),
        ('Ritika Mehra', 'ritika.m@groomers.com', '+91-9998887779', 'Mobile grooming specialist known for gentle baths and full-service styling.', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400', 8, 'Banjara Hills', 'Hyderabad', 'Banjara Hills, Hyderabad', 4.7, 13, '{"Tue", "Thu", "Sat", "Sun"}', TRUE)
      RETURNING id;
    `);
    
    const priyaId = groomerRes.rows[0].id;
    const aaravId = groomerRes.rows[1].id;
    const ananyaId = groomerRes.rows[2].id;
    const vikramId = groomerRes.rows[3].id;
    const rohanId = groomerRes.rows[4].id;
    const mayaId = groomerRes.rows[5].id;
    const sahilId = groomerRes.rows[6].id;
    const nishaId = groomerRes.rows[7].id;
    const ritikaId = groomerRes.rows[8].id;
 
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
        ('${rohanId}', 'Ear & Eye Cleaning', 'Safe cleaning of tear stains and ear canals.', 20.00, 30),
        ('${mayaId}', 'Mobile Spa & Groom', 'Comprehensive mobile grooming with calming techniques and home service.', 90.00, 100),
        ('${mayaId}', 'Precision Breed Trim', 'Breed-specific styling and coat finishing for show-ready looks.', 110.00, 140),
        ('${sahilId}', 'Small Breed Style', 'Trims and styling tailored for small dog breeds.', 70.00, 80),
        ('${sahilId}', 'Deluxe Paw Care', 'Paw pad trim, nail trim, and moisturizing balm application.', 35.00, 30),
        ('${nishaId}', 'Show Cut Groom', 'Specialized show-cut service for premium dog coats.', 130.00, 150),
        ('${nishaId}', 'Calming Bath', 'Gentle oat milk bath for stressed pets.', 55.00, 45),
        ('${ritikaId}', 'Home Comfort Groom', 'At-home grooming service with soothing handling.', 95.00, 110),
        ('${ritikaId}', 'Nail Trim & Paw Care', 'Safe nail trim and paw pad tidy up.', 25.00, 25)
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
        ('9a7b0001-c852-4467-929a-5d79d52379a1', 'Dr. Priya Sharma', 'priya.sharma@petvet.com', '+91-9876543210', 'General Veterinary', 12, 'PawCare Animal Hospital', '45, MG Road, Koramangala', 'Bangalore', 12.9352, 77.6245, 800, 4.8, 124, 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80', '{"Mon", "Tue", "Wed", "Thu", "Fri"}', '09:00', '18:00', TRUE),
        ('9a7b0002-c852-4467-929a-5d79d52379a2', 'Dr. Arjun Patel', 'arjun.patel@petvet.com', '+91-9876543211', 'Orthopedic Surgery', 15, 'VetLife Specialty Clinic', '12, Indiranagar 100ft Road', 'Bangalore', 12.9784, 77.6408, 1500, 4.9, 89, 'https://images.unsplash.com/photo-1551601651-5c8b0df1d7f2?w=800&q=80', '{"Mon", "Wed", "Fri"}', '10:00', '16:00', TRUE),
        ('9a7b0003-c852-4467-929a-5d79d52379a3', 'Dr. Sneha Reddy', 'sneha.reddy@petvet.com', '+91-9876543212', 'Dermatology', 8, 'SkinPaw Dermatology Center', '78, Whitefield Main Road', 'Bangalore', 12.9698, 77.7500, 1000, 4.6, 67, 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80', '{"Tue", "Thu", "Sat"}', '09:00', '17:00', TRUE),
        ('9a7b0004-c852-4467-929a-5d79d52379a4', 'Dr. Rahul Mehta', 'rahul.mehta@petvet.com', '+91-9876543213', 'Cardiology', 20, 'HeartPet Cardiac Care', '23, Bandra West', 'Mumbai', 19.0596, 72.8295, 2000, 4.9, 203, 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80', '{"Mon", "Tue", "Wed", "Thu", "Fri", "Sat"}', '08:00', '20:00', TRUE),
        ('9a7b0005-c852-4467-929a-5d79d52379a5', 'Dr. Rakesh Tiwari', 'rakesh.tiwari@petvet.com', '+91-9301234567', 'General Veterinary', 14, 'Durg Pet Care Hospital', 'Near Rajendra Chowk, Station Road', 'Durg', 21.1904, 81.2849, 500, 4.7, 98, 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80', '{"Mon", "Tue", "Wed", "Thu", "Fri", "Sat"}', '09:00', '19:00', TRUE),
        ('9a7b0006-c852-4467-929a-5d79d52379a6', 'Dr. Suman Verma', 'suman.verma@petvet.com', '+91-9302345678', 'Dermatology', 9, 'PawSkin Veterinary Clinic', 'Padmanabhpur, Main Road', 'Durg', 21.1950, 81.2800, 600, 4.5, 64, 'https://images.unsplash.com/photo-1545996124-1b06d5f1b2b1?w=800&q=80', '{"Mon", "Wed", "Fri", "Sat"}', '10:00', '18:00', TRUE),
        ('9a7b0007-c852-4467-929a-5d79d52379a7', 'Dr. Neha Sahu', 'neha.sahu@petvet.com', '+91-9303456789', 'Emergency & Critical Care', 11, 'Durg Animal Emergency Center', 'Nehru Nagar, Near Bus Stand', 'Durg', 21.1880, 81.2870, 800, 4.8, 112, 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80', '{"Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"}', '00:00', '23:59', TRUE),
        ('9a7b0008-c852-4467-929a-5d79d52379a8', 'Dr. Anil Jaiswal', 'anil.jaiswal@petvet.com', '+91-9304567890', 'Orthopedic Surgery', 16, 'Bhilai Veterinary Orthopedic Center', 'Sector 6, Near Nehru Park', 'Bhilai', 21.2094, 81.3297, 1000, 4.6, 73, 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80', '{"Mon", "Tue", "Thu", "Sat"}', '09:00', '17:00', TRUE),
        ('9a7b0009-c852-4467-929a-5d79d52379a9', 'Dr. Kavita Pandey', 'kavita.pandey@petvet.com', '+91-9305678901', 'Nutrition & Wellness', 7, 'Healthy Paws Nutrition Clinic', 'Supela Chowk, Main Road', 'Bhilai', 21.2150, 81.3350, 450, 4.4, 55, 'https://images.unsplash.com/photo-1545996124-1b06d5f1b2b1?w=800&q=80', '{"Tue", "Wed", "Thu", "Fri"}', '10:00', '16:00', TRUE),
        ('9a7b0010-c852-4467-929a-5d79d52379b0', 'Dr. Pradeep Sharma', 'pradeep.sharma@petvet.com', '+91-9306789012', 'Cardiology', 19, 'Raipur Pet Heart Care', 'Pandri, Near Bus Stand', 'Raipur', 21.2363, 81.6296, 1200, 4.9, 145, 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80', '{"Mon", "Tue", "Wed", "Thu", "Fri", "Sat"}', '08:00', '20:00', TRUE),
        ('9a7b0011-c852-4467-929a-5d79d52379b1', 'Dr. Anjali Dewangan', 'anjali.dewangan@petvet.com', '+91-9307890123', 'Dental Care', 8, 'SmilePet Dental Clinic', 'Tatibandh, Raipur', 'Raipur', 21.2500, 81.6100, 550, 4.5, 41, 'https://images.unsplash.com/photo-1545996124-1b06d5f1b2b1?w=800&q=80', '{"Mon", "Wed", "Fri", "Sat"}', '10:00', '18:00', TRUE),
        ('9a7b0012-c852-4467-929a-5d79d52379b2', 'Dr. Ravi Soni', 'ravi.soni@petvet.com', '+91-9308901234', 'General Veterinary', 10, 'Soni Veterinary Hospital', 'Power House Road, Durg', 'Durg', 21.1920, 81.2900, 400, 4.3, 87, 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80', '{"Mon", "Tue", "Wed", "Thu", "Fri", "Sat"}', '08:00', '20:00', TRUE)
    `);
    console.log('   ✅ 12 veterinarians seeded!');
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
