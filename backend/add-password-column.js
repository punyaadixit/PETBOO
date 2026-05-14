/**
 * Add password column to User table
 * Usage: node add-password-column.js
 */
const { Client } = require('pg');

async function run() {
  const client = new Client({
    connectionString: 'postgresql://postgres:admin%40123@localhost:5432/petsphere',
  });
  await client.connect();

  // Add password column (nullable so existing demo user still works)
  await client.query(`
    ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "password" TEXT
  `);
  console.log('✅ Password column added to User table');

  await client.end();
}

run().catch(console.error);
