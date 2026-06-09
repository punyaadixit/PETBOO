const express = require("express");
const {
  getUserAppointments,
  getVetAppointments,
  bookAppointment,
  updateAppointment,
  cancelAppointment,
  addPrescription,
  startConsultation,
  endConsultation,
  getAppointmentCount,
} = require("../controllers/appointmentController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * GET    /api/v1/appointments              — user's appointments
 * GET    /api/v1/appointments/count        — upcoming appointment count
 * GET    /api/v1/appointments/vet/:vetId   — vet's appointments (doctor panel)
 * POST   /api/v1/appointments              — book appointment
 * PUT    /api/v1/appointments/:id          — reschedule
 * PATCH  /api/v1/appointments/:id/cancel   — cancel
 * PATCH  /api/v1/appointments/:id/prescription — add prescription
 * POST   /api/v1/appointments/:id/consultation — start consultation
 * PATCH  /api/v1/appointments/:id/consultation — end consultation
 */
router.get("/", getUserAppointments);
router.get("/count", getAppointmentCount);
router.get("/vet/:vetId", getVetAppointments);
router.post("/", bookAppointment);
router.put("/:id", updateAppointment);
router.patch("/:id/cancel", cancelAppointment);
router.patch("/:id/prescription", addPrescription);
router.post("/:id/consultation", startConsultation);
router.patch("/:id/consultation", endConsultation);

module.exports = router;
