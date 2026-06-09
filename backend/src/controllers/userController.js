const { mockDB } = require("../utils/mockData");

const db = require('../utils/db');

async function syncUser(req, res) {
  try {
    const { id, email, name } = req.body;

    if (!id || !email) {
      return res.status(400).json({ error: "id and email are required." });
    }

    const displayName =
      typeof name === "string" && name.trim().length > 0
        ? name.trim()
        : "PetSphere User";

    let user;
    if (process.env.DATABASE_URL) {
      try {
        const result = await db.query(
          'INSERT INTO "User" ("id", "email", "name", "createdAt") VALUES ($1, $2, $3, NOW()) ON CONFLICT ("id") DO UPDATE SET "email" = EXCLUDED."email", "name" = EXCLUDED."name" RETURNING *',
          [id, email, displayName]
        );
        user = result.rows[0];
      } catch {
        user = mockDB.upsertUser({ id, email, name: displayName });
      }
    } else {
      user = mockDB.upsertUser({ id, email, name: displayName });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to sync user.",
      details: error.message,
    });
  }
}

module.exports = {
  syncUser,
};
