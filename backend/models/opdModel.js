const mongoose = require("mongoose");

const opdBookingSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  department: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  bedNumber: { type: Number },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  gender: { type: String, required: true },
  symptoms: { type: String, required: true },
  document: { type: String }, // Path to uploaded document
  image: { type: String }, // Path to uploaded image
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  doctorNotes: { type: String }, // Notes added by the doctor
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("OPDBooking", opdBookingSchema);