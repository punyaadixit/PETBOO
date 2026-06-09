const { pipeline } = require('@xenova/transformers');

// We will store the extractor locally
let extractor = null;

const initializeExtractor = async () => {
    if (!extractor) {
        // Load model once on server start or lazily
        extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    }
    return extractor;
};

// Start initialization in background so it's ready quicker
initializeExtractor().catch(console.error);

const generateEmbedding = async (text) => {
    const fn = await initializeExtractor();
    const output = await fn(text, { pooling: 'mean', normalize: true });
    return Array.from(output.data); // Returns a 384-dimensional vector
};

module.exports = {
    generateEmbedding,
    initializeExtractor
};
