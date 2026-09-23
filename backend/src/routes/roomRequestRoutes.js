const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  createRoomRequest,
  getRoomRequests,
  getMyRoomRequests,
  updateRoomRequest,
} = require("../controllers/roomController");

router.post("/", protect, authorize("student"), createRoomRequest);
router.get("/", protect, authorize("warden", "admin"), getRoomRequests);
router.get("/my", protect, authorize("student"), getMyRoomRequests);
router.put("/:id", protect, authorize("warden", "admin"), updateRoomRequest);

module.exports = router;
