const Room = require("../models/Room");
const RoomRequest = require("../models/RoomRequest");
const User = require("../models/User");

// @desc Get all rooms
// @route GET /api/rooms
const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find().sort({ roomNumber: 1 });
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get single room
// @route GET /api/rooms/:id
const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate("students", "name email");
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create a room (warden/admin)
// @route POST /api/rooms
const createRoom = async (req, res) => {
  try {
    const { roomNumber, floor, type, capacity, rent, facilities } = req.body;

    const exists = await Room.findOne({ roomNumber });
    if (exists) return res.status(400).json({ message: "Room number already exists" });

    const room = await Room.create({ roomNumber, floor, type, capacity, rent, facilities });
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Student creates a room booking request
// @route POST /api/room-requests
const createRoomRequest = async (req, res) => {
  try {
    const { roomId, message } = req.body;
    const studentId = req.user._id;

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: "Room not found" });
    if (room.occupied >= room.capacity) {
      return res.status(400).json({ message: "Room is already full" });
    }

    const existingRequest = await RoomRequest.findOne({
      student: studentId,
      status: "pending",
    });
    if (existingRequest) {
      return res.status(400).json({ message: "You already have a pending request" });
    }

    const request = await RoomRequest.create({
      student: studentId,
      room: roomId,
      message: message || "",
    });

    const populated = await request.populate("room student", "roomNumber type rent name email");
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all room requests (warden)
// @route GET /api/room-requests
const getRoomRequests = async (req, res) => {
  try {
    const requests = await RoomRequest.find()
      .populate("student", "name email phone")
      .populate("room", "roomNumber type rent floor")
      .sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get logged-in student's own requests
// @route GET /api/room-requests/my
const getMyRoomRequests = async (req, res) => {
  try {
    const requests = await RoomRequest.find({ student: req.user._id })
      .populate("room", "roomNumber type rent floor")
      .sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Warden approves/rejects a request
// @route PUT /api/room-requests/:id
const updateRoomRequest = async (req, res) => {
  try {
    const { status, wardenNote } = req.body;
    const request = await RoomRequest.findById(req.params.id).populate("room");

    if (!request) return res.status(404).json({ message: "Request not found" });
    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request already processed" });
    }

    if (status === "approved") {
      const room = await Room.findById(request.room._id);
      if (room.occupied >= room.capacity) {
        return res.status(400).json({ message: "Room is already full" });
      }

      room.occupied += 1;
      room.students.push(request.student);
      await room.save();

      await User.findByIdAndUpdate(request.student, { roomNumber: room.roomNumber });
    }

    request.status = status;
    request.wardenNote = wardenNote || "";
    await request.save();

    const populated = await request.populate("student", "name email phone");
    res.status(200).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getRooms,
  getRoomById,
  createRoom,
  createRoomRequest,
  getRoomRequests,
  getMyRoomRequests,
  updateRoomRequest,
};
