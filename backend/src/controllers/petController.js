const { mockDB } = require("../utils/mockData");

const db = require('../utils/db');

async function getPetsByUser(req, res) {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized request." });
    }

    let pets;
    if (process.env.DATABASE_URL) {
      try {
        const result = await db.query(
          'SELECT * FROM "Pet" WHERE "userId" = $1 ORDER BY "createdAt" DESC',
          [userId]
        );
        pets = result.rows;
      } catch {
        pets = mockDB.getPetsByUser(userId);
      }
    } else {
      pets = mockDB.getPetsByUser(userId);
    }

    return res.status(200).json({ pets });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch pets.",
      details: error.message,
    });
  }
}

async function addPet(req, res) {
  try {
    const userId = req.userId;
    const { name, breed, age, weight } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized request." });
    }

    if (!name || !breed || age === undefined || weight === undefined) {
      return res.status(400).json({ error: "name, breed, age, and weight are required." });
    }

    let pet;
    if (process.env.DATABASE_URL) {
      try {
        const result = await db.query(
          'INSERT INTO "Pet" ("name", "breed", "age", "weight", "userId", "createdAt") VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *',
          [String(name).trim(), String(breed).trim(), Number(age), Number(weight), userId]
        );
        pet = result.rows[0];
      } catch {
        pet = mockDB.addPet({
          name: String(name).trim(),
          breed: String(breed).trim(),
          age: Number(age),
          weight: Number(weight),
          userId,
        });
      }
    } else {
      pet = mockDB.addPet({
        name: String(name).trim(),
        breed: String(breed).trim(),
        age: Number(age),
        weight: Number(weight),
        userId,
      });
    }

    return res.status(201).json({ pet });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to add pet.",
      details: error.message,
    });
  }
}

async function updatePet(req, res) {
  try {
    const userId = req.userId;
    const { petId } = req.params;
    const { name, breed, age, weight } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized request." });
    }

    let updatedPet;
    if (process.env.DATABASE_URL) {
      try {
        const existingResult = await db.query(
          'SELECT * FROM "Pet" WHERE "id" = $1 LIMIT 1',
          [petId]
        );
        const existingPet = existingResult.rows[0];

        if (!existingPet || existingPet.userId !== userId) {
          return res.status(404).json({ error: "Pet not found." });
        }

        const updates = [];
        const values = [];
        let i = 1;
        if (name !== undefined) { updates.push(`"name" = $${i++}`); values.push(String(name).trim()); }
        if (breed !== undefined) { updates.push(`"breed" = $${i++}`); values.push(String(breed).trim()); }
        if (age !== undefined) { updates.push(`"age" = $${i++}`); values.push(Number(age)); }
        if (weight !== undefined) { updates.push(`"weight" = $${i++}`); values.push(Number(weight)); }
        
        values.push(petId);
        const updateQuery = `UPDATE "Pet" SET ${updates.join(', ')} WHERE "id" = $${i} RETURNING *`;
        const result = await db.query(updateQuery, values);
        updatedPet = result.rows[0];
      } catch {
        const data = {};
        if (name !== undefined) data.name = String(name).trim();
        if (breed !== undefined) data.breed = String(breed).trim();
        if (age !== undefined) data.age = Number(age);
        if (weight !== undefined) data.weight = Number(weight);
        updatedPet = mockDB.updatePet(petId, userId, data);
      }
    } else {
      const data = {};
      if (name !== undefined) data.name = String(name).trim();
      if (breed !== undefined) data.breed = String(breed).trim();
      if (age !== undefined) data.age = Number(age);
      if (weight !== undefined) data.weight = Number(weight);
      updatedPet = mockDB.updatePet(petId, userId, data);
    }

    if (!updatedPet) {
      return res.status(404).json({ error: "Pet not found." });
    }

    return res.status(200).json({ pet: updatedPet });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to update pet.",
      details: error.message,
    });
  }
}

async function deletePet(req, res) {
  try {
    const userId = req.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized request." });
    }

    let deleted;
    if (process.env.DATABASE_URL) {
      try {
        const result = await db.query(
          'DELETE FROM "Pet" WHERE "id" = $1 AND "userId" = $2',
          [id, userId]
        );
        deleted = result.rowCount > 0;
      } catch {
        deleted = mockDB.deletePet(id, userId);
      }
    } else {
      deleted = mockDB.deletePet(id, userId);
    }

    if (!deleted) {
      return res.status(404).json({ error: "Pet not found or unauthorized." });
    }

    return res.status(200).json({ message: "Pet deleted successfully." });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to delete pet.",
      details: error.message,
    });
  }
}

module.exports = {
  getPetsByUser,
  addPet,
  updatePet,
  deletePet,
};
