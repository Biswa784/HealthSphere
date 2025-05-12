const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const { getUsers } = require('../controllers/adminController'); // Ensure this line is correct
const router = express.Router();

// Protected admin route to get all users
router.get('/users', protect, admin, getUsers);

module.exports = router;