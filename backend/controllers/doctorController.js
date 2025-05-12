const Doctor = require('../models/Doctor');
const User = require('../models/User');

// Fetch doctors by category and availability
const getDoctorsByCategory = async (req, res) => {
  const { department } = req.query;

  try {
    // Fetch only doctors who are available and have the role "doctor"
    const doctors = await Doctor.find({
      department: department,
      availability: true,
    }).populate('user', 'firstName lastName'); // Populate doctor details from the user collection

    res.json({ success: true, message: doctors });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ message: 'Failed to fetch doctors' });
  }
};

// Update doctor's availability
const updateAvailability = async (req, res) => {
  const { availability, department } = req.body;
  const userId = req.user.id; // Assuming the user ID is available in the request

  try {
    // Find the doctor by user ID and update availability
    const doctor = await Doctor.findOneAndUpdate(
      { user: userId },
      { availability, department },
      { new: true }
    ).populate('user', 'firstName lastName');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json({
      success: true,
      message: `Availability updated successfully for Dr. ${doctor.user.firstName} ${doctor.user.lastName}`,
      doctor,
    });
  } catch (error) {
    console.error('Error updating availability:', error);
    res.status(500).json({ message: 'Failed to update availability' });
  }
};

module.exports = { updateAvailability, getDoctorsByCategory };