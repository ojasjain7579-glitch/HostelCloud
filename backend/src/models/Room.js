const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: true,
      unique: true,
    },
    floor: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["single", "double", "triple", "four"],
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    occupied: {
      type: Number,
      default: 0,
    },
    rent: {
      type: Number,
      required: true,
    },
    facilities: {
      type: [String],
      default: [],
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

// Virtual field: automatically calculate status
roomSchema.virtual("status").get(function () {
  if (this.occupied === 0) return "empty";
  if (this.occupied >= this.capacity) return "full";
  return "partial";
});

roomSchema.set("toJSON", { virtuals: true });
roomSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Room", roomSchema);
