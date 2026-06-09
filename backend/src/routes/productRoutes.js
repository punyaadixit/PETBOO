const express = require('express');
const { getProducts, getProductById } = require('../controllers/productController');

const router = express.Router();

/**
 * GET  /api/v1/products         — list all products (supports ?category= and ?excludeCategory=)
 * GET  /api/v1/products/:id     — single product by UUID
 */
router.get('/', getProducts);
router.get('/:id', getProductById);

module.exports = router;
