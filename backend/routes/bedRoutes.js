const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Bed = require('../models/Bed');

/**
 * @route GET /api/beds
 * @desc Get all beds
 * @access Private
 */
router.get('/', protect, async (req, res) => {
  try {
    const beds = await Bed.find({}).sort('number');
    res.status(200).json(beds);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route GET /api/beds/availability
 * @desc Get availability status of all beds
 * @access Private
 */
router.get('/availability', protect, async (req, res) => {
  try {
    const beds = await Bed.find({});
    const availability = {};
    
    // Initialize all 20 beds
    for (let i = 1; i <= 20; i++) {
      availability[i] = true; // Default to available
    }

    // Update with actual database status
    beds.forEach(bed => {
      availability[bed.number] = bed.available;
    });

    res.status(200).json(availability);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route GET /api/beds/check/:bedNumber
 * @desc Check availability of a specific bed
 * @access Private
 */
router.get('/check/:bedNumber', protect, async (req, res) => {
  try {
    const bedNumber = parseInt(req.params.bedNumber);
    
    // Validate bed number
    if (isNaN(bedNumber) || bedNumber < 1 || bedNumber > 20) {
      return res.status(400).json({ 
        available: false,
        message: 'Invalid bed number (must be 1-20)' 
      });
    }

    let bed = await Bed.findOne({ number: bedNumber });
    
    // If bed doesn't exist, create it as available
    if (!bed) {
      bed = await Bed.create({ 
        number: bedNumber,
        available: true 
      });
    }

    res.status(200).json({ 
      available: bed.available,
      message: bed.available ? 'Bed is available' : 'Bed is occupied'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route POST /api/beds/initialize
 * @desc Initialize all 20 beds (admin only)
 * @access Private/Admin
 */
router.post('/initialize', protect, async (req, res) => {
  try {
    const count = await Bed.countDocuments();
    if (count === 0) {
      const beds = Array.from({ length: 20 }, (_, i) => ({ number: i + 1 }));
      await Bed.insertMany(beds);
      return res.status(201).json({ message: '20 beds initialized' });
    }
    res.status(200).json({ message: 'Beds already exist' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route PUT /api/beds/:id/status
 * @desc Update bed availability status
 * @access Private/Admin
 */
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { available } = req.body;
    
    const bed = await Bed.findByIdAndUpdate(
      req.params.id,
      { available },
      { new: true }
    );

    if (!bed) {
      return res.status(404).json({ message: 'Bed not found' });
    }

    res.status(200).json(bed);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route GET /api/beds/status
 * @desc Get summary of bed status (total, available, occupied)
 * @access Private
 */
router.get('/status', protect, async (req, res) => {
  try {
    const totalBeds = 20; // Fixed number of beds
    const availableBeds = await Bed.countDocuments({ available: true });
    const occupiedBeds = totalBeds - availableBeds;

    res.status(200).json({
      total: totalBeds,
      available: availableBeds,
      occupied: occupiedBeds
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;