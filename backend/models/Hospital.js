const mongoose = require('mongoose');

const HospitalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  address: { type: String, required: true },
  licenseNumber: { type: String, required: true },
});

module.exports = mongoose.model('Hospital', HospitalSchema);