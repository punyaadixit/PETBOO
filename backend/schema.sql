-- ============================================
-- PetSphere Database Schema
-- Run this in your Supabase SQL Editor or psql
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";

-- =========================
-- User Table
-- =========================

CREATE TABLE IF NOT EXISTS "User" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL UNIQUE,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- =========================
-- Pet Table
-- =========================

CREATE TABLE IF NOT EXISTS "Pet" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "breed" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT "Pet_userId_fkey"
    FOREIGN KEY ("userId")
    REFERENCES "User"("id")
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- =========================
-- ChatHistory Table
-- =========================

CREATE TABLE IF NOT EXISTS "ChatHistory" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "sessionId" TEXT NOT NULL DEFAULT gen_random_uuid()::TEXT,
    "userId" UUID NOT NULL,
    "role" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT "ChatHistory_userId_fkey"
    FOREIGN KEY ("userId")
    REFERENCES "User"("id")
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- =========================
-- Product Table
-- =========================

CREATE TABLE IF NOT EXISTS "Product" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "category" TEXT NOT NULL,
    "imageUrl" TEXT,
    "inStock" BOOLEAN NOT NULL DEFAULT TRUE,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- =========================
-- KnowledgeDocument Table (for RAG)
-- =========================

CREATE TABLE IF NOT EXISTS "KnowledgeDocument" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "text" TEXT NOT NULL,
    "embedding" vector(384),
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- =========================
-- Groomer Table
-- =========================

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
);

-- =========================
-- GroomingService Table
-- =========================

CREATE TABLE IF NOT EXISTS "GroomingService" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "groomerId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "durationMins" INTEGER NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT "GroomingService_groomerId_fkey"
    FOREIGN KEY ("groomerId")
    REFERENCES "Groomer"("id")
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- =========================
-- GroomingBooking Table
-- =========================

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

    CONSTRAINT "GroomingBooking_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
    CONSTRAINT "GroomingBooking_groomerId_fkey"
    FOREIGN KEY ("groomerId") REFERENCES "Groomer"("id") ON DELETE CASCADE,
    CONSTRAINT "GroomingBooking_serviceId_fkey"
    FOREIGN KEY ("serviceId") REFERENCES "GroomingService"("id") ON DELETE CASCADE,
    CONSTRAINT "GroomingBooking_petId_fkey"
    FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE SET NULL
);

-- =========================
-- GroomerReview Table
-- =========================

CREATE TABLE IF NOT EXISTS "GroomerReview" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "groomerId" UUID NOT NULL,
    "rating" INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    "comment" TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT "GroomerReview_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
    CONSTRAINT "GroomerReview_groomerId_fkey"
    FOREIGN KEY ("groomerId") REFERENCES "Groomer"("id") ON DELETE CASCADE
);

-- =========================
-- Veterinarian Table
-- =========================

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
);

-- =========================
-- Appointment Table
-- =========================

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
);

-- =========================
-- Review Table
-- =========================

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
);

-- =========================
-- Consultation Table
-- =========================

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
);

-- =========================
-- Indexes
-- =========================

CREATE INDEX IF NOT EXISTS "Pet_userId_idx" ON "Pet"("userId");
CREATE INDEX IF NOT EXISTS "ChatHistory_userId_idx" ON "ChatHistory"("userId");
CREATE INDEX IF NOT EXISTS "ChatHistory_sessionId_idx" ON "ChatHistory"("sessionId");
CREATE INDEX IF NOT EXISTS "Product_category_idx" ON "Product"("category");
CREATE INDEX IF NOT EXISTS "GroomingService_groomerId_idx" ON "GroomingService"("groomerId");
CREATE INDEX IF NOT EXISTS "GroomingBooking_userId_idx" ON "GroomingBooking"("userId");
CREATE INDEX IF NOT EXISTS "GroomingBooking_groomerId_idx" ON "GroomingBooking"("groomerId");
CREATE INDEX IF NOT EXISTS "GroomerReview_groomerId_idx" ON "GroomerReview"("groomerId");
CREATE INDEX IF NOT EXISTS "Appointment_userId_idx" ON "Appointment"("userId");
CREATE INDEX IF NOT EXISTS "Appointment_vetId_idx" ON "Appointment"("vetId");
CREATE INDEX IF NOT EXISTS "Review_vetId_idx" ON "Review"("vetId");
CREATE INDEX IF NOT EXISTS "Consultation_appointmentId_idx" ON "Consultation"("appointmentId");

-- =========================
-- Seed: Sample Products
-- =========================

INSERT INTO "Product" ("name", "description", "price", "category", "imageUrl", "inStock") VALUES
  -- Packaged Food
  ('Premium Chicken Kibble', 'High-protein dry dog food made with real chicken. Grain-free formula for all breeds.', 1299, 'Packaged Food', NULL, TRUE),
  ('Salmon & Rice Dog Food', 'Omega-rich salmon recipe with brown rice for healthy skin and coat.', 1499, 'Packaged Food', NULL, TRUE),
  ('Tuna Delight Cat Food', 'Gourmet wet cat food with real tuna chunks in gravy.', 199, 'Packaged Food', NULL, TRUE),
  ('Puppy Growth Formula', 'Specially formulated for puppies with DHA for brain development.', 999, 'Packaged Food', NULL, TRUE),
  -- Toys
  ('Rope Tug Toy', 'Durable cotton rope toy perfect for fetch and tug-of-war.', 349, 'Toys', NULL, TRUE),
  ('Squeaky Ball Set (3 pack)', 'Colorful bouncy balls that squeak. Great for indoor and outdoor play.', 499, 'Toys', NULL, TRUE),
  ('Interactive Puzzle Feeder', 'Mental stimulation toy that dispenses treats as your pet solves the puzzle.', 799, 'Toys', NULL, TRUE),
  ('Catnip Mouse Toy', 'Soft plush mouse filled with premium catnip. Irresistible for cats!', 249, 'Toys', NULL, TRUE),
  -- Accessories
  ('Adjustable Dog Harness', 'Breathable mesh harness with reflective strips for night walks.', 899, 'Accessories', NULL, TRUE),
  ('Stainless Steel Pet Bowl', 'Non-slip, rust-resistant bowl. Dishwasher safe. 500ml capacity.', 399, 'Accessories', NULL, TRUE),
  ('Pet Grooming Kit', 'Complete grooming set with brush, nail clipper, and comb.', 1199, 'Accessories', NULL, TRUE),
  ('Cozy Pet Bed (Medium)', 'Ultra-soft orthopedic pet bed with removable, washable cover.', 2499, 'Accessories', NULL, TRUE),
  -- Fresh Food
  ('Fresh Chicken & Veggie Bowl', 'Freshly prepared chicken breast with sweet potato and green beans.', 349, 'Fresh Food', NULL, TRUE),
  ('Beef & Brown Rice Meal', 'Lean ground beef with brown rice and carrots. Vet-approved recipe.', 399, 'Fresh Food', NULL, TRUE),
  ('Fish & Quinoa Dinner', 'Wild-caught fish with quinoa and spinach. Rich in Omega-3.', 449, 'Fresh Food', NULL, TRUE),
  ('Turkey & Pumpkin Stew', 'Slow-cooked turkey with pumpkin puree. Easy on sensitive tummies.', 379, 'Fresh Food', NULL, TRUE);

-- =========================
-- Seed: Sample Veterinarians
-- =========================

INSERT INTO "Veterinarian" ("id", "name", "email", "phone", "specialization", "experience", "clinic", "address", "city", "lat", "lng", "consultationFee", "rating", "reviewCount", "imageUrl", "availableDays", "availableTimeStart", "availableTimeEnd", "isAvailable") VALUES
  ('9a7b0001-c852-4467-929a-5d79d52379a1', 'Dr. Priya Sharma', 'priya.sharma@petvet.com', '+91-9876543210', 'General Veterinary', 12, 'PawCare Animal Hospital', '45, MG Road, Koramangala', 'Bangalore', 12.9352, 77.6245, 800, 4.8, 124, NULL, '{"Mon", "Tue", "Wed", "Thu", "Fri"}', '09:00', '18:00', TRUE),
  ('9a7b0002-c852-4467-929a-5d79d52379a2', 'Dr. Arjun Patel', 'arjun.patel@petvet.com', '+91-9876543211', 'Orthopedic Surgery', 15, 'VetLife Specialty Clinic', '12, Indiranagar 100ft Road', 'Bangalore', 12.9784, 77.6408, 1500, 4.9, 89, NULL, '{"Mon", "Wed", "Fri"}', '10:00', '16:00', TRUE),
  ('9a7b0003-c852-4467-929a-5d79d52379a3', 'Dr. Sneha Reddy', 'sneha.reddy@petvet.com', '+91-9876543212', 'Dermatology', 8, 'SkinPaw Dermatology Center', '78, Whitefield Main Road', 'Bangalore', 12.9698, 77.7500, 1000, 4.6, 67, NULL, '{"Tue", "Thu", "Sat"}', '09:00', '17:00', TRUE),
  ('9a7b0004-c852-4467-929a-5d79d52379a4', 'Dr. Rahul Mehta', 'rahul.mehta@petvet.com', '+91-9876543213', 'Cardiology', 20, 'HeartPet Cardiac Care', '23, Bandra West', 'Mumbai', 19.0596, 72.8295, 2000, 4.9, 203, NULL, '{"Mon", "Tue", "Wed", "Thu", "Fri", "Sat"}', '08:00', '20:00', TRUE);
