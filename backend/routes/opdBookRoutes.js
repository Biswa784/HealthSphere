const express = require('express');
const multer = require('multer');
const router = express.Router();
const OPDBook = require('../models/OPDBook');
const Bed = require('../models/Bed');

// Configure file storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST /api/opdbooks - Create new OPD booking
router.post('/', upload.fields([
  { name: 'document', maxCount: 1 },
  { name: 'image', maxCount: 1 }
]), async (req, res) => {
  try {
    // Parse the patient data
    const patient = JSON.parse(req.body.patient);
    
    // Create new booking
    const booking = new OPDBook({
      patient: {
        firstName: patient.firstName,
        lastName: patient.lastName,
        phoneNumber: patient.phoneNumber,
        gender: patient.gender
      },
      symptoms: req.body.symptoms,
      department: req.body.department,
      doctor: req.body.doctor,
      appointmentDate: req.body.appointmentDate,
      bedNumber: req.body.bedNumber,
      patientId: req.body.patientId,
      document: req.files['document'] ? {
        data: req.files['document'][0].buffer,
        contentType: req.files['document'][0].mimetype
      } : null,
      userPhoto: req.files['image'] ? {
        data: req.files['image'][0].buffer,
        contentType: req.files['image'][0].mimetype
      } : null
    });

    await booking.save();
    
    await Bed.findOneAndUpdate(
      { number: req.body.bedNumber },
      { status: 'occupied' }
    );

    res.status(201).json({
      success: true,
      opdbook: booking
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create booking'
    });
  }
});

module.exports = router;