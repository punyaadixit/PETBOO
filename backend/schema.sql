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
-- Indexes
-- =========================

CREATE INDEX IF NOT EXISTS "Pet_userId_idx" ON "Pet"("userId");
CREATE INDEX IF NOT EXISTS "ChatHistory_userId_idx" ON "ChatHistory"("userId");
CREATE INDEX IF NOT EXISTS "ChatHistory_sessionId_idx" ON "ChatHistory"("sessionId");
CREATE INDEX IF NOT EXISTS "Product_category_idx" ON "Product"("category");

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
