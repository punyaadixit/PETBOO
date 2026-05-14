const { mockDB } = require("../utils/mockData");

const db = require('../utils/db');

/**
 * GET /api/v1/products
 * Returns all products. Accepts an optional `category` query param to filter.
 * Pass `category=Fresh Food` for the fresh food catalog,
 * or `category=Toys` / `category=Accessories` / `category=Packaged Food` for the pet store.
 * Omitting the param returns every product (used by checkout summary, etc.)
 */
async function getProducts(req, res) {
  try {
    const { category, excludeCategory } = req.query;

    let products;
    if (process.env.DATABASE_URL) {
      try {
        let sql = 'SELECT * FROM "Product" WHERE "inStock" = TRUE';
        const params = [];
        let i = 1;

        if (category) {
          sql += ` AND "category" = $${i++}`;
          params.push(category);
        } else if (excludeCategory) {
          sql += ` AND "category" != $${i++}`;
          params.push(excludeCategory);
        }

        sql += ' ORDER BY "createdAt" DESC';
        const result = await db.query(sql, params);
        products = result.rows;
      } catch {
        products = mockDB.getProducts({ category, excludeCategory });
      }
    } else {
      products = mockDB.getProducts({ category, excludeCategory });
    }

    return res.status(200).json({ products });
  } catch (error) {
    console.error("[productController] getProducts error:", error);
    return res.status(500).json({
      error: "Failed to fetch products.",
      details: error.message,
    });
  }
}

/**
 * GET /api/v1/products/:id — fetch single product by UUID
 */
async function getProductById(req, res) {
  try {
    const { id } = req.params;

    let product;
    if (process.env.DATABASE_URL) {
      try {
        const result = await db.query(
          'SELECT * FROM "Product" WHERE "id" = $1 LIMIT 1',
          [id]
        );
        product = result.rows[0] || null;
      } catch {
        product = mockDB.getProductById(id);
      }
    } else {
      product = mockDB.getProductById(id);
    }

    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    return res.status(200).json({ product });
  } catch (error) {
    console.error("[productController] getProductById error:", error);
    return res.status(500).json({
      error: "Failed to fetch product.",
      details: error.message,
    });
  }
}

module.exports = { getProducts, getProductById };
