const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Enabling pgvector extension...');
    await prisma.$executeRawUnsafe(`CREATE EXTENSION IF NOT EXISTS vector;`);
    console.log('pgvector enabled.');

    console.log('Creating HNSW index on KnowledgeDocument.embedding...');
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS knowledge_document_embedding_idx 
      ON "KnowledgeDocument" 
      USING hnsw (embedding vector_cosine_ops);
    `);
    console.log('HNSW index created.');
  } catch (error) {
    console.error('Error initializing vector features:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
