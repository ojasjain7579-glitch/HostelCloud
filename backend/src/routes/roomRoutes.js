const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  getRooms,
  getRoomById,
  createRoom,
} = require("../controllers/roomController");

router.get("/", getRooms);
router.get("/:id", getRoomById);
router.post("/", protect, authorize("warden", "admin"), createRoom);

module.exports = router;
