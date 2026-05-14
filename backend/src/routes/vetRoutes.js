const express = require("express");
const { getVeterinarians, getVetById, getVetReviews, addReview } = require("../controllers/vetController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * GET  /api/v1/vets              — list all vets (public)
 * GET  /api/v1/vets/:id          — single vet profile (public)
 * GET  /api/v1/vets/:id/reviews  — vet reviews (public)
 * POST /api/v1/vets/:id/reviews  — add review (auth required)
 */
router.get("/", getVeterinarians);
router.get("/:id", getVetById);
router.get("/:id/reviews", getVetReviews);
router.post("/:id/reviews", authMiddleware, addReview);

module.exports = router;
