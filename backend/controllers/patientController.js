const asyncHandler = require('express-async-handler');
const Patient = require('../models/Patient');

// @desc    Get all patients
// @route   GET /api/patients
// @access  Private/Admin
const getPatients = asyncHandler(async (req, res) => {
  const patients = await Patient.find({});
  res.json(patients);
});

// @desc    Get patient by ID
// @route   GET /api/patients/:id
// @access  Private
const getPatientById = asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.params.id);

  if (patient) {
    res.json(patient);
  } else {
    res.status(404);
    throw new Error('Patient not found');
  }
});

// @desc    Create a patient
// @route   POST /api/patients
// @access  Private
const createPatient = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, sex, bloodGroup, termsAgreed } = req.body;

  const patient = new Patient({
    user: req.user._id,
    firstName,
    lastName,
    email,
    sex,
    bloodGroup,
    termsAgreed,
  });

  const createdPatient = await patient.save();
  res.status(201).json(createdPatient);
});

// @desc    Update a patient
// @route   PUT /api/patients/:id
// @access  Private
const updatePatient = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, sex, bloodGroup, termsAgreed } = req.body;

  const patient = await Patient.findById(req.params.id);

  if (patient) {
    patient.firstName = firstName || patient.firstName;
    patient.lastName = lastName || patient.lastName;
    patient.email = email || patient.email;
    patient.sex = sex || patient.sex;
    patient.bloodGroup = bloodGroup || patient.bloodGroup;
    patient.termsAgreed = termsAgreed || patient.termsAgreed;

    const updatedPatient = await patient.save();
    res.json(updatedPatient);
  } else {
    res.status(404);
    throw new Error('Patient not found');
  }
});

// @desc    Delete a patient
// @route   DELETE /api/patients/:id
// @access  Private/Admin
const deletePatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.params.id);

  if (patient) {
    await patient.remove();
    res.json({ message: 'Patient removed' });
  } else {
    res.status(404);
    throw new Error('Patient not found');
  }
});

module.exports = {
  getPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
};