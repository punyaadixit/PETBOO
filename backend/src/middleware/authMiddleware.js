const { createClient } = require("@supabase/supabase-js");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "petsphere-secret-key-change-in-production";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing or invalid authorization header." });
    }

    const token = authHeader.slice("Bearer ".length).trim();
    if (!token) {
      return res.status(401).json({ error: "Missing bearer token." });
    }

    /* ── Demo-mode bypass ── */
    if (token === "demo-token") {
      req.userId = "demo-user-001";
      return next();
    }

    /* ── Try JWT verification (local auth) ── */
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (decoded && decoded.userId) {
        req.userId = decoded.userId;
        return next();
      }
    } catch {
      // Not a valid JWT — try Supabase next
    }

    /* ── Try Supabase auth ── */
    if (supabase) {
      const { data, error } = await supabase.auth.getUser(token);
      if (!error && data?.user?.id) {
        req.userId = data.user.id;
        return next();
      }
    }

    return res.status(401).json({ error: "Invalid or expired token." });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to authenticate request.",
      details: error.message,
    });
  }
}

module.exports = authMiddleware;
