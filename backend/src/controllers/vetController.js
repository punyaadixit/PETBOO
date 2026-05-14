const { mockDB } = require("../utils/mockData");

const db = require('../utils/db');

/**
 * GET /api/v1/vets
 * Query: ?city=&specialization=&available=true
 */
async function getVeterinarians(req, res) {
  try {
    const { city, specialization, available } = req.query;

    let vets;
    if (process.env.DATABASE_URL) {
      try {
        let sql = 'SELECT * FROM "Veterinarian" WHERE 1=1';
        const params = [];
        let i = 1;

        if (city) {
          sql += ` AND LOWER("city") = $${i++}`;
          params.push(city.toLowerCase());
        }
        if (specialization) {
          sql += ` AND LOWER("specialization") LIKE $${i++}`;
          params.push(`%${specialization.toLowerCase()}%`);
        }
        if (available === "true") {
          sql += ' AND "isAvailable" = TRUE';
        }

        sql += ' ORDER BY "rating" DESC';
        const result = await db.query(sql, params);
        vets = result.rows;
      } catch (err) {
        console.error('[vetController] DB Error:', err);
        vets = mockDB.getVeterinarians({ city, specialization, available });
      }
    } else {
      vets = mockDB.getVeterinarians({ city, specialization, available });
    }

    return res.status(200).json({ vets });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch veterinarians.", details: error.message });
  }
}

/**
 * GET /api/v1/vets/:id
 */
async function getVetById(req, res) {
  try {
    const { id } = req.params;

    let vet;
    if (process.env.DATABASE_URL) {
      try {
        const result = await db.query(
          'SELECT * FROM "Veterinarian" WHERE "id" = $1 LIMIT 1',
          [id]
        );
        vet = result.rows[0] || null;
      } catch {
        vet = mockDB.getVetById(id);
      }
    } else {
      vet = mockDB.getVetById(id);
    }

    if (!vet) {
      return res.status(404).json({ error: "Veterinarian not found." });
    }

    return res.status(200).json({ vet });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch veterinarian.", details: error.message });
  }
}

/**
 * GET /api/v1/vets/:id/reviews
 */
async function getVetReviews(req, res) {
  try {
    const { id } = req.params;

    let reviews;
    if (process.env.DATABASE_URL) {
      try {
        const result = await db.query(
          `SELECT r.*, u."name" as "userName"
           FROM "Review" r
           LEFT JOIN "User" u ON r."userId" = u."id"
           WHERE r."vetId" = $1
           ORDER BY r."createdAt" DESC`,
          [id]
        );
        reviews = result.rows;
      } catch {
        reviews = mockDB.getVetReviews(id);
      }
    } else {
      reviews = mockDB.getVetReviews(id);
    }

    return res.status(200).json({ reviews });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch reviews.", details: error.message });
  }
}

/**
 * POST /api/v1/vets/:id/reviews
 * Body: { rating, comment, appointmentId? }
 */
async function addReview(req, res) {
  try {
    const userId = req.userId;
    const vetId = req.params.id;
    const { rating, comment, appointmentId } = req.body;

    if (!userId) return res.status(401).json({ error: "Unauthorized." });
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5." });
    }

    let review;
    if (process.env.DATABASE_URL) {
      try {
        const insertResult = await db.query(
          'INSERT INTO "Review" ("id", "userId", "vetId", "appointmentId", "rating", "comment", "createdAt") VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW()) RETURNING *',
          [userId, vetId, appointmentId || null, rating, comment || null]
        );
        review = insertResult.rows[0];

        // Update vet aggregate rating
        await db.query(
          `UPDATE "Veterinarian" SET
            "rating" = (SELECT AVG("rating")::numeric(2,1) FROM "Review" WHERE "vetId" = $1),
            "reviewCount" = (SELECT COUNT(*) FROM "Review" WHERE "vetId" = $1)
          WHERE "id" = $1`,
          [vetId]
        );
      } catch {
        review = mockDB.addReview({ userId, vetId, appointmentId, rating, comment });
      }
    } else {
      review = mockDB.addReview({ userId, vetId, appointmentId, rating, comment });
    }

    return res.status(201).json({ review });
  } catch (error) {
    return res.status(500).json({ error: "Failed to add review.", details: error.message });
  }
}

module.exports = { getVeterinarians, getVetById, getVetReviews, addReview };
