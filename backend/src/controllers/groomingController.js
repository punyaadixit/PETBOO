const { mockDB } = require("../utils/mockData");
const db = require('../utils/db');

/**
 * GET /api/v1/groomers
 * Query: ?city=&location=&rating=&available=true
 */
async function getGroomers(req, res) {
  try {
    const { city, location, rating, available } = req.query;

    let groomers;
    if (process.env.DATABASE_URL) {
      try {
        let sql = 'SELECT * FROM "Groomer" WHERE 1=1';
        const params = [];
        let i = 1;

        if (city) {
          sql += ` AND LOWER("city") = $${i++}`;
          params.push(city.toLowerCase());
        }
        if (location) {
          sql += ` AND "location" ILIKE $${i++}`;
          params.push(`%${location}%`);
        }
        if (rating) {
          sql += ` AND "rating" >= $${i++}`;
          params.push(parseFloat(rating));
        }
        if (available === "true") {
          sql += ' AND "isAvailable" = TRUE';
        }

        sql += ' ORDER BY "rating" DESC, "createdAt" DESC';
        const result = await db.query(sql, params);
        groomers = result.rows;

        // Fetch services for each groomer
        for (let g of groomers) {
          const srvResult = await db.query('SELECT * FROM "GroomingService" WHERE "groomerId" = $1', [g.id]);
          g.services = srvResult.rows;
        }
      } catch (err) {
        console.error('[groomingController] DB Error in getGroomers:', err);
        groomers = mockDB.getGroomers({ city, rating });
      }
    } else {
      groomers = mockDB.getGroomers({ city, rating });
    }

    return res.status(200).json({ groomers });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch groomers.", details: error.message });
  }
}

/**
 * GET /api/v1/groomers/:id
 */
async function getGroomerById(req, res) {
  try {
    const { id } = req.params;

    let groomer;
    if (process.env.DATABASE_URL) {
      try {
        const result = await db.query('SELECT * FROM "Groomer" WHERE "id" = $1 LIMIT 1', [id]);
        groomer = result.rows[0] || null;

        if (groomer) {
          const srvResult = await db.query('SELECT * FROM "GroomingService" WHERE "groomerId" = $1', [id]);
          groomer.services = srvResult.rows;

          const revResult = await db.query(
            'SELECT r.*, u.name as "userName" FROM "GroomerReview" r JOIN "User" u ON r."userId" = u.id WHERE "groomerId" = $1 ORDER BY r."createdAt" DESC',
            [id]
          );
          groomer.reviews = revResult.rows;
        }
      } catch (err) {
        console.error('[groomingController] DB Error in getGroomerById:', err);
        groomer = mockDB.getGroomerById(id);
      }
    } else {
      groomer = mockDB.getGroomerById(id);
    }

    if (!groomer) {
      return res.status(404).json({ error: "Groomer not found." });
    }

    return res.status(200).json({ groomer });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch groomer details.", details: error.message });
  }
}

/**
 * POST /api/v1/groomers/bookings
 */
async function createBooking(req, res) {
  try {
    const userId = req.user?.id || req.body.userId;
    const { groomerId, petId, serviceId, appointmentDate, notes } = req.body;

    if (!userId || !groomerId || !serviceId || !appointmentDate) {
      return res.status(400).json({ error: "Missing required fields for booking." });
    }

    let booking;
    if (process.env.DATABASE_URL) {
      try {
        const sql = `
          INSERT INTO "GroomingBooking" ("userId", "groomerId", "petId", "serviceId", "appointmentDate", "notes")
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING *
        `;
        const result = await db.query(sql, [userId, groomerId, petId || null, serviceId, new Date(appointmentDate), notes || '']);
        booking = result.rows[0];
      } catch (err) {
        console.error('[groomingController] DB Error in createBooking:', err);
        booking = mockDB.createGroomingBooking({ userId, groomerId, petId, serviceId, appointmentDate, notes });
      }
    } else {
      booking = mockDB.createGroomingBooking({ userId, groomerId, petId, serviceId, appointmentDate, notes });
    }

    // Trigger email notification in background
    sendGroomingEmail(userId, petId, groomerId, serviceId, appointmentDate, notes);

    return res.status(201).json({ booking });
  } catch (error) {
    console.error('[groomingController] createBooking error:', error);
    return res.status(500).json({ error: "Failed to create booking.", details: error.message });
  }
}

/**
 * GET /api/v1/groomers/bookings/my-bookings
 */
async function getUserBookings(req, res) {
  try {
    const userId = req.user?.id || req.query.userId;
    if (!userId) {
      return res.status(400).json({ error: "User ID required." });
    }

    let bookings;
    if (process.env.DATABASE_URL) {
      try {
        const sql = `
          SELECT b.*, g.name as "groomerName", s.title as "serviceTitle", p.name as "petName"
          FROM "GroomingBooking" b
          JOIN "Groomer" g ON b."groomerId" = g.id
          JOIN "GroomingService" s ON b."serviceId" = s.id
          LEFT JOIN "Pet" p ON b."petId" = p.id
          WHERE b."userId" = $1
          ORDER BY b."appointmentDate" DESC
        `;
        const result = await db.query(sql, [userId]);
        bookings = result.rows;
      } catch (err) {
        console.error('[groomingController] DB Error in getUserBookings:', err);
        bookings = mockDB.getGroomingBookingsByUser(userId);
      }
    } else {
      bookings = mockDB.getGroomingBookingsByUser(userId);
    }

    return res.status(200).json({ bookings });
  } catch (error) {
    console.error('[groomingController] getUserBookings error:', error);
    return res.status(500).json({ error: "Failed to fetch bookings.", details: error.message });
  }
}

/**
 * PATCH /api/v1/groomers/bookings/:id/cancel
 */
async function cancelBooking(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user?.id || req.body.userId || req.query.userId;

    if (!userId) {
      return res.status(400).json({ error: "User ID required." });
    }

    let booking;
    if (process.env.DATABASE_URL) {
      try {
        const result = await db.query(
          'UPDATE "GroomingBooking" SET "status" = \'cancelled\' WHERE "id" = $1 AND "userId" = $2 RETURNING *',
          [id, userId]
        );
        if (result.rows.length === 0) {
          booking = mockDB.cancelGroomingBooking(id, userId);
        } else {
          booking = result.rows[0];
        }
      } catch (err) {
        console.error('[groomingController] DB Error in cancelBooking:', err);
        booking = mockDB.cancelGroomingBooking(id, userId);
      }
    } else {
      booking = mockDB.cancelGroomingBooking(id, userId);
    }

    if (!booking) {
      return res.status(404).json({ error: "Booking not found or not authorized to cancel." });
    }

    return res.status(200).json({ booking });
  } catch (error) {
    console.error('[groomingController] cancelBooking error:', error);
    return res.status(500).json({ error: "Failed to cancel booking.", details: error.message });
  }
}

/**
 * Helper to send email confirmation for grooming appointment
 */
async function sendGroomingEmail(userId, petId, groomerId, serviceId, date, notes) {
  try {
    let userName = 'Pet Owner';
    let userEmail = '';
    let groomerName = 'Groomer';
    let serviceTitle = 'Grooming Service';
    let price = '0.00';
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
          console.error('[groomingController] DB error fetching user details:', dbErr.message);
        }
      }
      if (!userEmail) {
        const user = mockDB.findUser(userId);
        if (user) {
          userName = user.name;
          userEmail = user.email;
        }
      }

      // 2. Fetch Groomer
      if (uuidRegex.test(groomerId)) {
        try {
          const groomerRes = await db.query('SELECT name FROM "Groomer" WHERE id = $1 LIMIT 1', [groomerId]);
          if (groomerRes.rows[0]) {
            groomerName = groomerRes.rows[0].name;
          }
        } catch (dbErr) {
          console.error('[groomingController] DB error fetching groomer details:', dbErr.message);
        }
      }
      if (groomerName === 'Groomer') {
        const groomer = mockDB.getGroomerById(groomerId);
        if (groomer) {
          groomerName = groomer.name;
        }
      }

      // 3. Fetch Service
      if (uuidRegex.test(serviceId)) {
        try {
          const serviceRes = await db.query('SELECT title, price FROM "GroomingService" WHERE id = $1 LIMIT 1', [serviceId]);
          if (serviceRes.rows[0]) {
            serviceTitle = serviceRes.rows[0].title;
            price = serviceRes.rows[0].price;
          }
        } catch (dbErr) {
          console.error('[groomingController] DB error fetching service details:', dbErr.message);
        }
      }
      if (serviceTitle === 'Grooming Service') {
        const groomer = mockDB.getGroomerById(groomerId);
        if (groomer && groomer.services) {
          const srv = groomer.services.find(s => s.id === serviceId);
          if (srv) {
            serviceTitle = srv.title;
            price = srv.price;
          }
        }
      }

      // 4. Fetch Pet
      if (petId && uuidRegex.test(petId)) {
        try {
          const petRes = await db.query('SELECT name FROM "Pet" WHERE id = $1 LIMIT 1', [petId]);
          if (petRes.rows[0]) {
            petName = petRes.rows[0].name;
          }
        } catch (dbErr) {
          console.error('[groomingController] DB error fetching pet details:', dbErr.message);
        }
      }
      if (petName === 'Your Pet' && petId) {
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
      const groomer = mockDB.getGroomerById(groomerId);
      if (groomer) {
        groomerName = groomer.name;
        if (groomer.services) {
          const srv = groomer.services.find(s => s.id === serviceId);
          if (srv) {
            serviceTitle = srv.title;
            price = srv.price;
          }
        }
      }
      if (petId) {
        const petObj = mockDB.getPetsByUser(userId).find(p => p.id === petId);
        if (petObj) {
          petName = petObj.name;
        }
      }
    }

    if (userEmail) {
      const { sendGroomingConfirmationEmail } = require('../utils/mailer');
      await sendGroomingConfirmationEmail({
        userEmail,
        userName,
        petName,
        groomerName,
        serviceTitle,
        price,
        date,
        notes,
      });
    }
  } catch (err) {
    console.error('[groomingController] sendGroomingEmail error:', err);
  }
}

module.exports = {
  getGroomers,
  getGroomerById,
  createBooking,
  getUserBookings,
  cancelBooking,
};
