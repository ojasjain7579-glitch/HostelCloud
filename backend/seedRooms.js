const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Room = require("./src/models/Room");

dotenv.config();

const sampleRooms = [
  { roomNumber: "101", floor: 1, type: "single", capacity: 1, rent: 8000, facilities: ["WiFi", "AC", "Attached Bathroom"] },
  { roomNumber: "102", floor: 1, type: "double", capacity: 2, rent: 6000, facilities: ["WiFi", "Fan", "Study Table"] },
  { roomNumber: "103", floor: 1, type: "triple", capacity: 3, rent: 5000, facilities: ["WiFi", "Fan", "Wardrobe"] },
  { roomNumber: "104", floor: 1, type: "four", capacity: 4, rent: 4000, facilities: ["WiFi", "Fan"] },
  { roomNumber: "201", floor: 2, type: "single", capacity: 1, rent: 8500, facilities: ["WiFi", "AC", "Balcony"] },
  { roomNumber: "202", floor: 2, type: "double", capacity: 2, rent: 6200, facilities: ["WiFi", "AC", "Study Table"] },
  { roomNumber: "203", floor: 2, type: "triple", capacity: 3, rent: 5200, facilities: ["WiFi", "Fan", "Wardrobe"] },
  { roomNumber: "204", floor: 2, type: "double", capacity: 2, rent: 6000, facilities: ["WiFi", "Fan", "Attached Bathroom"] },
  { roomNumber: "301", floor: 3, type: "single", capacity: 1, rent: 9000, facilities: ["WiFi", "AC", "Balcony", "Attached Bathroom"] },
  { roomNumber: "302", floor: 3, type: "four", capacity: 4, rent: 4200, facilities: ["WiFi", "Fan"] },
];

const seedRooms = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding...");

    await Room.deleteMany();
    console.log("Old rooms cleared");

    await Room.insertMany(sampleRooms);
    console.log(`${sampleRooms.length} sample rooms added successfully!`);

    process.exit();
  } catch (error) {
    console.error("Error seeding rooms:", error.message);
    process.exit(1);
  }
};

seedRooms();
