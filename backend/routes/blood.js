const express = require('express');
const router = express.Router();
const Blood = require('../models/Blood');
const auth = require('../middleware/auth');

// Get all blood data
router.get('/', auth, async (req, res) => {
  try {
    const bloodData = await Blood.find({ hospitalId: req.user.hospitalId });
    res.json(bloodData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;