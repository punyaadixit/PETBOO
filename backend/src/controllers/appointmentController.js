const { mockDB } = require("../utils/mockData");

const db = require('../utils/db');

/**
 * GET /api/v1/appointments
 * Returns all appointments for the authenticated user
 */
async function getUserAppointments(req, res) {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized." });

    let appointments;
    if (process.env.DATABASE_URL) {
      try {
        const result = await db.query(`
          SELECT a.*,
            json_build_object('id', v."id", 'name', v."name", 'specialization', v."specialization", 'clinic', v."clinic", 'consultationFee', v."consultationFee", 'rating', v."rating", 'imageUrl', v."imageUrl") as vet,
            json_build_object('id', p."id", 'name', p."name", 'breed', p."breed") as pet
          FROM "Appointment" a
          LEFT JOIN "Veterinarian" v ON a."vetId" = v."id"
          LEFT JOIN "Pet" p ON a."petId" = p."id"
          WHERE a."userId" = $1
          ORDER BY a."date" DESC, a."time" DESC
        `, [userId]);
        appointments = result.rows;
      } catch {
        appointments = mockDB.getAppointmentsByUser(userId);
      }
    } else {
      appointments = mockDB.getAppointmentsByUser(userId);
    }

    return res.status(200).json({ appointments });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch appointments.", details: error.message });
  }
}

/**
 * GET /api/v1/appointments/vet/:vetId
 * Returns all appointments for a vet (doctor panel)
 */
async function getVetAppointments(req, res) {
  try {
    const { vetId } = req.params;

    let appointments;
    if (process.env.DATABASE_URL) {
      try {
        const result = await db.query(`
          SELECT a.*,
            json_build_object('id', p."id", 'name', p."name", 'breed', p."breed", 'age', p."age", 'weight', p."weight") as pet,
            json_build_object('id', u."id", 'name', u."name", 'email', u."email") as "user"
          FROM "Appointment" a
          LEFT JOIN "Pet" p ON a."petId" = p."id"
          LEFT JOIN "User" u ON a."userId" = u."id"
          WHERE a."vetId" = $1
          ORDER BY a."date" ASC, a."time" ASC
        `, [vetId]);
        appointments = result.rows;
      } catch {
        appointments = mockDB.getAppointmentsByVet(vetId);
      }
    } else {
      appointments = mockDB.getAppointmentsByVet(vetId);
    }

    return res.status(200).json({ appointments });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch vet appointments.", details: error.message });
  }
}

/**
 * POST /api/v1/appointments
 * Body: { petId, vetId, date, time, type, notes }
 */
async function bookAppointment(req, res) {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized." });

    const { petId, vetId, date, time, type, notes } = req.body;

    if (!petId || !vetId || !date || !time) {
      return res.status(400).json({ error: "petId, vetId, date, and time are required." });
    }

    let appointment;
    if (process.env.DATABASE_URL) {
      try {
        const result = await db.query(
          'INSERT INTO "Appointment" ("id", "userId", "petId", "vetId", "date", "time", "type", "status", "notes", "createdAt") VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, \'upcoming\', $7, NOW()) RETURNING *',
          [userId, petId, vetId, date, time, type || 'in-person', notes || null]
        );
        appointment = result.rows[0];
      } catch {
        appointment = mockDB.bookAppointment({ userId, petId, vetId, date, time, type, notes });
      }
    } else {
      appointment = mockDB.bookAppointment({ userId, petId, vetId, date, time, type, notes });
    }

    // Send confirmation email in background
    sendAppointmentEmail(userId, petId, vetId, date, time, type, notes).catch(err => {
      console.error('[appointmentController] sendAppointmentEmail background error:', err);
    });

    return res.status(201).json({ appointment });
  } catch (error) {
    return res.status(500).json({ error: "Failed to book appointment.", details: error.message });
  }
}

/**
 * PUT /api/v1/appointments/:id
 * Body: { date, time }
 */
async function updateAppointment(req, res) {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { date, time } = req.body;

    if (!userId) return res.status(401).json({ error: "Unauthorized." });

    let updated;
    if (process.env.DATABASE_URL) {
      try {
        const result = await db.query(
          'UPDATE "Appointment" SET "date" = COALESCE($1, "date"), "time" = COALESCE($2, "time") WHERE "id" = $3 AND "userId" = $4 AND "status" = \'upcoming\' RETURNING *',
          [date || null, time || null, id, userId]
        );
        updated = result.rows[0] || null;
      } catch {
        const data = {};
        if (date) data.date = date;
        if (time) data.time = time;
        updated = mockDB.updateAppointment(id, userId, data);
      }
    } else {
      const data = {};
      if (date) data.date = date;
      if (time) data.time = time;
      updated = mockDB.updateAppointment(id, userId, data);
    }

    if (!updated) {
      return res.status(404).json({ error: "Appointment not found or cannot be rescheduled." });
    }

    return res.status(200).json({ appointment: updated });
  } catch (error) {
    return res.status(500).json({ error: "Failed to update appointment.", details: error.message });
  }
}

/**
 * PATCH /api/v1/appointments/:id/cancel
 */
async function cancelAppointment(req, res) {
  try {
    const userId = req.userId;
    const { id } = req.params;

    if (!userId) return res.status(401).json({ error: "Unauthorized." });

    let cancelled;
    if (process.env.DATABASE_URL) {
      try {
        const result = await db.query(
          'UPDATE "Appointment" SET "status" = \'cancelled\' WHERE "id" = $1 AND "userId" = $2 AND "status" = \'upcoming\' RETURNING *',
          [id, userId]
        );
        cancelled = result.rows[0] || null;
      } catch {
        cancelled = mockDB.cancelAppointment(id, userId);
      }
    } else {
      cancelled = mockDB.cancelAppointment(id, userId);
    }

    if (!cancelled) {
      return res.status(404).json({ error: "Appointment not found or already processed." });
    }

    return res.status(200).json({ appointment: cancelled, message: "Appointment cancelled." });
  } catch (error) {
    return res.status(500).json({ error: "Failed to cancel appointment.", details: error.message });
  }
}

/**
 * PATCH /api/v1/appointments/:id/prescription
 * Body: { prescription }
 */
async function addPrescription(req, res) {
  try {
    const { id } = req.params;
    const { prescription } = req.body;

    if (!prescription) {
      return res.status(400).json({ error: "Prescription text is required." });
    }

    let updated;
    if (process.env.DATABASE_URL) {
      try {
        const result = await db.query(
          'UPDATE "Appointment" SET "prescription" = $1, "status" = \'completed\' WHERE "id" = $2 RETURNING *',
          [prescription, id]
        );
        updated = result.rows[0] || null;
      } catch {
        updated = mockDB.addPrescription(id, prescription);
      }
    } else {
      updated = mockDB.addPrescription(id, prescription);
    }

    if (!updated) {
      return res.status(404).json({ error: "Appointment not found." });
    }

    return res.status(200).json({ appointment: updated });
  } catch (error) {
    return res.status(500).json({ error: "Failed to add prescription.", details: error.message });
  }
}

/**
 * POST /api/v1/appointments/:id/consultation
 * Body: { type }
 */
async function startConsultation(req, res) {
  try {
    const { id } = req.params;
    const { type } = req.body;

    let consultation;
    if (process.env.DATABASE_URL) {
      try {
        const result = await db.query(
          'INSERT INTO "Consultation" ("id", "appointmentId", "type", "startTime", "createdAt") VALUES (gen_random_uuid(), $1, $2, NOW(), NOW()) RETURNING *',
          [id, type || 'chat']
        );
        consultation = result.rows[0];
      } catch {
        consultation = mockDB.startConsultation({ appointmentId: id, type: type || 'chat' });
      }
    } else {
      consultation = mockDB.startConsultation({ appointmentId: id, type: type || 'chat' });
    }

    return res.status(201).json({ consultation });
  } catch (error) {
    return res.status(500).json({ error: "Failed to start consultation.", details: error.message });
  }
}

/**
 * PATCH /api/v1/appointments/:id/consultation
 */
async function endConsultation(req, res) {
  try {
    const { id } = req.params;

    let consultation;
    if (process.env.DATABASE_URL) {
      try {
        // Find active consultation for this appointment
        const existingResult = await db.query(
          'SELECT * FROM "Consultation" WHERE "appointmentId" = $1 AND "endTime" IS NULL LIMIT 1',
          [id]
        );
        if (existingResult.rows.length > 0) {
          const result = await db.query(
            'UPDATE "Consultation" SET "endTime" = NOW(), "duration" = EXTRACT(EPOCH FROM (NOW() - "startTime")) / 60 WHERE "id" = $1 RETURNING *',
            [existingResult.rows[0].id]
          );
          consultation = result.rows[0];
        }
      } catch {
        const mock = mockDB.getConsultationByAppointment(id);
        if (mock) consultation = mockDB.endConsultation(mock.id);
      }
    } else {
      const mock = mockDB.getConsultationByAppointment(id);
      if (mock) consultation = mockDB.endConsultation(mock.id);
    }

    if (!consultation) {
      return res.status(404).json({ error: "No active consultation found." });
    }

    return res.status(200).json({ consultation });
  } catch (error) {
    return res.status(500).json({ error: "Failed to end consultation.", details: error.message });
  }
}

/**
 * GET /api/v1/appointments/count
 * Returns count of upcoming appointments for the user
 */
async function getAppointmentCount(req, res) {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized." });

    let count;
    if (process.env.DATABASE_URL) {
      try {
        const result = await db.query(
          'SELECT COUNT(*)::int as count FROM "Appointment" WHERE "userId" = $1 AND "status" = \'upcoming\'',
          [userId]
        );
        count = result.rows[0]?.count || 0;
      } catch {
        count = mockDB.getUserAppointmentCount(userId);
      }
    } else {
      count = mockDB.getUserAppointmentCount(userId);
    }

    return res.status(200).json({ count });
  } catch (error) {
    return res.status(500).json({ error: "Failed to get count.", details: error.message });
  }
}

async function sendAppointmentEmail(userId, petId, vetId, date, time, type, notes) {
  try {
    let userName = 'Pet Owner';
    let userEmail = '';
    let vetName = 'Specialist';
    let petName = 'Your Pet';

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (process.env.DATABASE_URL) {
      // 1. Fetch User
      if (uuidRegex.test(userId)) {
        try {
          const userRes = await db.query('SELECT name, email FROM "User" WHERE id = $1 LIMIT 1', [userId]);
          if (userRes.rows[0]) {
            userName = userRes.rows[0].name;
            userEmail = userRes.rows[0].email;
          }
        } catch (dbErr) {
          console.error('[appointmentController] DB error fetching user details:', dbErr.message);
        }
      }
      if (!userEmail) {
        const user = mockDB.findUser(userId);
        if (user) {
          userName = user.name;
          userEmail = user.email;
        }
      }

      // 2. Fetch Vet
      if (uuidRegex.test(vetId)) {
        try {
          const vetRes = await db.query('SELECT name FROM "Veterinarian" WHERE id = $1 LIMIT 1', [vetId]);
          if (vetRes.rows[0]) {
            vetName = vetRes.rows[0].name;
          }
        } catch (dbErr) {
          console.error('[appointmentController] DB error fetching vet details:', dbErr.message);
        }
      }
      if (vetName === 'Specialist') {
        const vet = mockDB.getVetById(vetId);
        if (vet) {
          vetName = vet.name;
        }
      }

      // 3. Fetch Pet
      if (uuidRegex.test(petId)) {
        try {
          const petRes = await db.query('SELECT name FROM "Pet" WHERE id = $1 LIMIT 1', [petId]);
          if (petRes.rows[0]) {
            petName = petRes.rows[0].name;
          }
        } catch (dbErr) {
          console.error('[appointmentController] DB error fetching pet details:', dbErr.message);
        }
      }
      if (petName === 'Your Pet') {
        const petObj = mockDB.getPetsByUser(userId).find(p => p.id === petId);
        if (petObj) {
          petName = petObj.name;
        }
      }
    } else {
      // Mock mode
      const user = mockDB.findUser(userId);
      if (user) {
        userName = user.name;
        userEmail = user.email;
      }
      const vet = mockDB.getVetById(vetId);
      if (vet) {
        vetName = vet.name;
      }
      const petObj = mockDB.getPetsByUser(userId).find(p => p.id === petId);
      if (petObj) {
        petName = petObj.name;
      }
    }

    if (userEmail) {
      const { sendAppointmentConfirmationEmail } = require('../utils/mailer');
      await sendAppointmentConfirmationEmail({
        userEmail,
        userName,
        petName,
        vetName,
        date,
        time,
        type,
        notes
      });
    } else {
      console.warn('[appointmentController] sendAppointmentEmail skipped: User email could not be resolved.');
    }
  } catch (err) {
    console.error('[appointmentController] sendAppointmentEmail error:', err.message);
  }
}

module.exports = {
  getUserAppointments,
  getVetAppointments,
  bookAppointment,
  updateAppointment,
  cancelAppointment,
  addPrescription,
  startConsultation,
  endConsultation,
  getAppointmentCount,
};
