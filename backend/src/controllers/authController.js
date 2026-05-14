const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { mockDB } = require('../utils/mockData');

const JWT_SECRET = process.env.JWT_SECRET || 'petsphere-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

const db = require('../utils/db');

/**
 * POST /api/v1/auth/signup
 * Body: { email, password, name }
 */
async function signup(req, res) {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    const displayName = (name && name.trim()) || email.split('@')[0];
    const hashedPassword = await bcrypt.hash(password, 10);

    if (process.env.DATABASE_URL) {
      try {
        // Check if user already exists
        const existingResult = await db.query(
          'SELECT id FROM "User" WHERE email = $1 LIMIT 1',
          [email]
        );
        if (existingResult.rows.length > 0) {
          return res.status(409).json({ error: 'An account with this email already exists.' });
        }

        // Create user with password
        const result = await db.query(
          'INSERT INTO "User" (id, email, name, password, "createdAt") VALUES (gen_random_uuid(), $1, $2, $3, NOW()) RETURNING id, email, name, "createdAt"',
          [email, displayName, hashedPassword]
        );
        user = result.rows[0];
      } catch (dbErr) {
        if (dbErr.code === '23505') { // PostgreSQL unique violation code
          return res.status(409).json({ error: 'An account with this email already exists.' });
        }
        throw dbErr;
      }
    } else {
      // Mock fallback
      const existing = mockDB.findUser(email);
      if (existing) {
        return res.status(409).json({ error: 'An account with this email already exists.' });
      }
      user = mockDB.upsertUser({ id: crypto.randomUUID(), email, name: displayName });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    return res.status(201).json({
      user: { id: user.id, email: user.email, name: user.name },
      token,
    });
  } catch (error) {
    console.error('[authController] signup error:', error);
    return res.status(500).json({ error: 'Failed to create account.', details: error.message });
  }
}

/**
 * POST /api/v1/auth/login
 * Body: { email, password }
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    let user = null;
    let storedPassword = null;

    if (process.env.DATABASE_URL) {
      try {
        const result = await db.query(
          'SELECT id, email, name, password FROM "User" WHERE email = $1 LIMIT 1',
          [email]
        );
        if (result.rows.length > 0) {
          user = result.rows[0];
          storedPassword = user.password;
        }
      } catch (error) {
        console.error('[authController] DB error during login:', error);
      }
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    if (!storedPassword) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isValid = await bcrypt.compare(password, storedPassword);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    return res.status(200).json({
      user: { id: user.id, email: user.email, name: user.name },
      token,
    });
  } catch (error) {
    console.error('[authController] login error:', error);
    return res.status(500).json({ error: 'Failed to sign in.', details: error.message });
  }
}

/**
 * GET /api/v1/auth/me
 * Returns the authenticated user's profile (requires valid JWT in header)
 */
async function getMe(req, res) {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }

    let user = null;
    if (process.env.DATABASE_URL) {
      try {
        const result = await db.query(
          'SELECT id, email, name, "createdAt" FROM "User" WHERE id = $1 LIMIT 1',
          [userId]
        );
        if (result.rows.length > 0) user = result.rows[0];
      } catch (error) {
        console.error('[authController] DB error during getMe:', error);
      }
    }

    if (!user) {
      user = mockDB.findUser(userId);
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    return res.status(200).json({ user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to get profile.', details: error.message });
  }
}

module.exports = { signup, login, getMe, JWT_SECRET };
