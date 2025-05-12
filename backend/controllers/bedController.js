const Bed = require('../models/Bed');

/**
 * @desc Initialize beds (create 20 beds if none exist)
 * @route POST /api/beds/initialize
 * @access Private/Admin
 */
exports.initializeBeds = async (req, res) => {
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
};

/**
 * @desc Get all beds
 * @route GET /api/beds
 * @access Private
 */
exports.getAllBeds = async (req, res) => {
  try {
    const beds = await Bed.find().sort('number');
    res.status(200).json(beds);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc Check availability of a specific bed
 * @route GET /api/beds/check/:bedNumber
 * @access Private
 */
// In your bedController.js
// In your bedController.js
exports.checkBedAvailability = async (req, res) => {
  try {
    const bed = await Bed.findOne({ number: req.params.bedNumber });
    
    if (!bed) {
      return res.status(404).json({
        success: false,
        message: 'Bed not found',
        available: false
      });
    }

    res.status(200).json({
      success: true,
      available: bed.status === 'available',
      bedNumber: bed.number,
      status: bed.status,
      message: bed.status === 'available' ? 'Bed is available' : 'Bed is occupied'
    });
    
  } catch (error) {
    console.error('Bed check error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during bed check',
      available: false
    });
  }
};

/**
 * @desc Get availability status of all beds
 * @route GET /api/beds/availability
 * @access Private
 */
exports.getBedAvailability = async (req, res) => {
  try {
    const beds = await Bed.find().sort('number');
    const availability = {};

    // Initialize all possible beds (1-20)
    for (let i = 1; i <= 20; i++) {
      availability[i] = true; // default to available
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
};

/**
 * @desc Get bed status summary
 * @route GET /api/beds/status
 * @access Private
 */
exports.getBedStatus = async (req, res) => {
  try {
    const totalBeds = 20; // Fixed number of beds
    const availableBeds = await Bed.countDocuments({ available: true });
    const occupiedBeds = totalBeds - availableBeds;

    res.status(200).json({
      total: totalBeds,
      available: availableBeds,
      occupied: occupiedBeds,
      availability: await exports.getBedAvailabilityMap() // private method
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc Update bed status
 * @route PUT /api/beds/:id/status
 * @access Private/Admin
 */
exports.updateBedStatus = async (req, res) => {
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
};

/**
 * @desc Create a new bed (admin only)
 * @route POST /api/beds
 * @access Private/Admin
 */
exports.createBed = async (req, res) => {
  try {
    const { number } = req.body;

    // Validate bed number
    if (number < 1 || number > 20) {
      return res.status(400).json({ message: 'Bed number must be between 1-20' });
    }

    const existingBed = await Bed.findOne({ number });
    if (existingBed) {
      return res.status(400).json({ message: 'Bed already exists' });
    }

    const newBed = await Bed.create({ number });
    res.status(201).json(newBed);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Helper method - not exposed as route
exports.getBedAvailabilityMap = async () => {
  const beds = await Bed.find();
  const availability = {};
  beds.forEach(bed => {
    availability[bed.number] = bed.available;
  });
  return availability;
};

// Helper method for server initialization
exports.ensureBedsExist = async () => {
  try {
    const count = await Bed.countDocuments();
    if (count === 0) {
      const beds = Array.from({ length: 20 }, (_, i) => ({ number: i + 1 }));
      await Bed.insertMany(beds);
      console.log('Initialized 20 beds');
    }
  } catch (error) {
    console.error('Failed to initialize beds:', error);
  }
};
