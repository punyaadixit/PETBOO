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

  // Indexes
  await dbClient.query(`CREATE INDEX IF NOT EXISTS "Pet_userId_idx" ON "Pet"("userId")`);
  await dbClient.query(`CREATE INDEX IF NOT EXISTS "ChatHistory_userId_idx" ON "ChatHistory"("userId")`);
  await dbClient.query(`CREATE INDEX IF NOT EXISTS "ChatHistory_sessionId_idx" ON "ChatHistory"("sessionId")`);
  await dbClient.query(`CREATE INDEX IF NOT EXISTS "Product_category_idx" ON "Product"("category")`);
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
