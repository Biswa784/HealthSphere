const mongoose = require('mongoose');
const OPDBook = require('../models/OPDBook');
const Doctor = require('../models/Doctor');
const Bed = require('../models/Bed');

// Get all OPD bookings with populated data
exports.getAllOpdBookings = async (req, res) => {
  try {
    const bookings = await OPDBook.find()
      .populate('patientId', 'firstName lastName email phone')
      .populate('doctor', 'firstName lastName specialization')
      .populate('bed', 'bedNumber ward');
    
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch OPD bookings',
      error: error.message 
    });
  }
};

// Get all unique departments
exports.getDepartments = async (req, res) => {
  try {
    const departments = await Doctor.distinct('department');
    res.status(200).json({ 
      success: true,
      departments 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch departments',
      error: error.message 
    });
  }
};

// Get available doctors by department
exports.getAvailableDoctors = async (req, res) => {
  try {
    const { department } = req.query;
    const doctors = await Doctor.find({ 
      department,
      availability: true 
    }).select('firstName lastName specialization');
    
    res.status(200).json({ 
      success: true,
      doctors 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch doctors',
      error: error.message 
    });
  }
};

// Get booked beds
exports.getBookedBeds = async (req, res) => {
  try {
    const bookedBeds = await OPDBook.distinct('bedNumber');
    res.status(200).json({ 
      success: true,
      bookedBeds 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch booked beds',
      error: error.message 
    });
  }
};

// Update OPD booking status
exports.updateOpdBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updatedBooking = await OPDBook.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('patientId', 'firstName lastName');

    if (!updatedBooking) {
      return res.status(404).json({ 
        success: false,
        message: 'OPD booking not found' 
      });
    }

    res.status(200).json({ 
      success: true,
      data: updatedBooking 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to update status',
      error: error.message 
    });
  }
};


// Create new OPD booking
exports.createOPDBooking = async (req, res) => {
  try {
    console.log("Incoming bedNumber (raw):", req.body.bedNumber);
    const bedNumber = parseInt(req.body.bedNumber);
    console.log("Parsed bedNumber:", bedNumber, "Type:", typeof bedNumber);

    const patient = JSON.parse(req.body.patient);

    const bed = await Bed.findOne({ number: bedNumber });
    console.log("Found bed:", bed);

    if (!bed || bed.status !== 'available') {
      return res.status(400).json({
        success: false,
        message: 'Bed not available or does not exist'
      });
    }

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
      bedNumber: bedNumber,
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

    // Update bed status
    bed.status = 'occupied';
    bed.patient = req.body.patientId;
    bed.lastOccupied = new Date();

    await booking.save();
    await bed.save();

    // Emit real-time update (if socket.io is being used)
    if (req.io) {
      req.io.emit('bedStatusUpdate', {
        number: bedNumber,
        status: 'occupied'
      });
    }

    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
