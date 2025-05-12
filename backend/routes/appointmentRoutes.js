const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const Appointment = require("../models/Appointment");
const { protect } = require("../middleware/authMiddleware");

// Route to book an appointment (protected route)
router.post("/book", protect, async (req, res) => {
  try {
    const { patientId, doctorId, date, time, symptoms, age, department } = req.body;
    
    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(patientId) || !mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const newAppointment = new Appointment({
      patientId,
      doctorId,
      date,
      time,
      symptoms,
      age,
      department,
      status: "pending",
    });
    
    await newAppointment.save();
    res.status(201).json(newAppointment);
  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).json({ message: "Failed to book appointment" });
  }
});

// Fetch all appointments
router.get("/", async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("patientId", "firstName lastName")
      .populate("doctorId", "firstName lastName");
    res.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
});

// Fetch appointments for the logged-in patient (protected route)
router.get("/patient", protect, async (req, res) => {
  try {
    const patientId = req.user._id;
    const appointments = await Appointment.find({ patientId })
      .populate("patientId", "firstName lastName")
      .populate("doctorId", "firstName lastName");
    res.json(appointments);
  } catch (error) {
    console.error("Error fetching patient appointments:", error);
    res.status(500).json({ message: "Failed to fetch patient appointments" });
  }
});

// Fetch approved appointments for the logged-in doctor (protected route)
router.get("/doctor", protect, async (req, res) => {
  try {
    const doctorId = req.user._id;
    const appointments = await Appointment.find({ doctorId, status: "approved" })
      .populate("patientId", "firstName lastName")
      .populate("doctorId", "firstName lastName");
    res.json(appointments);
  } catch (error) {
    console.error("Error fetching doctor appointments:", error);
    res.status(500).json({ message: "Failed to fetch doctor appointments" });
  }
});

// Update appointment status (protected route)
router.put("/update-status/:id", protect, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid appointment ID" });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
      .populate("patientId", "firstName lastName")
      .populate("doctorId", "firstName lastName");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json(appointment);
  } catch (error) {
    console.error("Error updating appointment status:", error);
    res.status(500).json({ message: "Failed to update appointment status" });
  }
});

// Fetch approved appointments for doctor (unprotected route)
router.get("/doctor-appointments", async (req, res) => {
  try {
    const appointments = await Appointment.find({ status: "approved" })
      .populate("patientId", "firstName lastName")
      .populate("doctorId", "firstName lastName");
    res.json(appointments);
  } catch (error) {
    console.error("Error fetching doctor appointments:", error);
    res.status(500).json({ message: "Failed to fetch doctor appointments" });
  }
});

// Fetch appointments for a specific patient (unprotected route)
router.get("/patient-appointments/:patientId", async (req, res) => {
  const { patientId } = req.params;

  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      return res.status(400).json({ message: "Invalid patient ID format" });
    }

    const appointments = await Appointment.find({ patientId })
      .populate("patientId", "firstName lastName")
      .populate("doctorId", "firstName lastName department specialization");

    if (!appointments || appointments.length === 0) {
      return res.status(404).json({ message: "No appointments found for this patient" });
    }

    res.json(appointments);
  } catch (error) {
    console.error("Error fetching patient appointments:", error);
    res.status(500).json({ message: "Failed to fetch patient appointments" });
  }
});

// Fetch doctors by department and availability
router.get("/doctors", async (req, res) => {
  const { department, availability } = req.query;

  try {
    const doctors = await Doctor.find({ department, availability })
      .populate("user", "firstName lastName");
    res.json({ success: true, data: doctors });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ message: "Failed to fetch doctors" });
  }
});

// Authorized status update (protected route)
router.put("/authorized-update/:id", protect, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid appointment ID" });
    }

    // Check authorization
    if (req.user.role !== "superadmin" && req.user.role !== "doctor") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
      .populate("patientId", "firstName lastName")
      .populate("doctorId", "firstName lastName");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json(appointment);
  } catch (error) {
    console.error("Error updating appointment status:", error);
    res.status(500).json({ message: "Failed to update appointment status" });
  }
});

module.exports = router;