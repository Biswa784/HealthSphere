const express = require('express');
const router = express.Router();
const opdController = require('../controllers/opdController');
const { protect } = require('../middleware/auth');
const { upload } = require('../config/multer');

// Common route handler middleware
const routeHandler = [
  protect,
  upload.fields([
    { name: 'document', maxCount: 1 },
    { name: 'image', maxCount: 1 }
  ]),
  opdController.createOPDBooking
];

// GET endpoints
router.get('/', protect, opdController.getAllOpdBookings);
router.get('/departments', protect, opdController.getDepartments);
router.get('/available-doctors', protect, opdController.getAvailableDoctors);
router.get('/booked-beds', protect, opdController.getBookedBeds);
router.put('/update-status/:id', protect, opdController.updateOpdBookingStatus);

// POST endpoints
router.post('/', routeHandler);
router.post('/create', routeHandler); // optional alias

module.exports = router;