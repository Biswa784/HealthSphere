const express = require('express');
const { protect, admin } = require('../middleware/auth'); // Ensure this import is correct
const {
  getPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
} = require('../controllers/patientController');

const router = express.Router();

router.route('/').get(protect, admin, getPatients).post(protect, createPatient);
router
  .route('/:id')
  .get(protect, getPatientById)
  .put(protect, updatePatient)
  .delete(protect, admin, deletePatient);

module.exports = router;