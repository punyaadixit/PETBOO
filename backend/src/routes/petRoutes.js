const express = require("express");
const {
  getPetsByUser,
  addPet,
  updatePet,
  deletePet,
} = require("../controllers/petController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/", getPetsByUser);
router.post("/", addPet);
router.put("/:petId", updatePet);
router.delete("/:id", deletePet);

module.exports = router;
