const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const User = require("../models/User");

// Book an appointment
exports.bookAppointment = async (req, res) => {
  try {
    console.log("Request body:", req.body); // Log the request body
    console.log("User:", req.user); // Log the authenticated user

    const { doctorId, date, time, symptoms, age, department } = req.body;

    // Fetch the user's role
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let patientId, doctorIdToUse;

    if (user.role === "patient") {
      // If the user is a patient, use their ID as the patientId
      patientId = user._id;
      doctorIdToUse = doctorId; // Use the doctorId from the request body
    } else if (user.role === "doctor") {
      // If the user is a doctor, use their ID as the doctorId
      doctorIdToUse = user._id;
      patientId = req.body.patientId; // Use the patientId from the request body
    } else {
      return res.status(403).json({ message: "Unauthorized role" });
    }

    // Check if the doctor exists
    const doctorExists = await Doctor.findById(doctorIdToUse);
    if (!doctorExists) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Create a new appointment
    const appointment = new Appointment({
      patientId,
      doctorId: doctorIdToUse,
      date,
      time,
      symptoms,
      age,
      department,
      status: "pending", // Default status
    });

    await appointment.save();
    res.status(201).json({ message: "Appointment booked successfully", appointment });
  } catch (error) {
    console.error("Error booking appointment:", error); // Log the full error
    res.status(500).json({ message: "Failed to book appointment" });
  }
};

// Get all appointments
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("patientId", "firstName lastName")
      .populate("doctorId", "firstName lastName");
    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
};
// Update the patient-appointments route
router.get("/patient-appointments/:patientId", async (req, res) => {
  const { patientId } = req.params;
  console.log(req.body);
  console.log(req.params);

  try {
    // First validate if patientId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      return res.status(400).json({ message: "Invalid patient ID format" });
    }

    const appointments = await Appointment.find({ patientId })
      .populate("patientId", "firstName lastName")
      .populate("doctorId", "firstName lastName");

    res.json(appointments);
  } catch (error) {
    console.error("Error fetching patient appointments:", error);
    res.status(500).json({ message: "Failed to fetch patient appointments" });
  }
});

// Fetch appointments for the logged-in doctor
exports.getAppointmentsForDoctor = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.user.id }).populate('patient');
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching doctor appointments:', error);
    res.status(500).json({ message: 'Error fetching appointments', error: error.message });
  }
};

// Update appointment status
exports.updateAppointmentStatus = async (req, res) => {
  const { appointmentId, status } = req.body;

  try {
    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json(appointment);
  } catch (error) {
    console.error('Error updating appointment status:', error);
    res.status(500).json({ message: 'Error updating appointment status', error: error.message });
  }
};

