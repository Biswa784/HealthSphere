const express = require('express');
const { updateAvailability, getDoctorsByCategory } = require('../controllers/doctorController'); // Import getDoctorsByCategory
const { protect } = require('../middleware/authMiddleware');
const Doctor = require('../models/Doctor');
const router = express.Router();

// Update doctor's availability
router.put('/update-availability', protect, updateAvailability);

// Fetch doctors by category and availability
router.get('/', protect, getDoctorsByCategory);



module.exports = router;