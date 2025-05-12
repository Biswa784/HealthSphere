const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  email: { type: String, required: true, unique: true }, // Already correct
  category: { type: String, required: true },
  availability: { type: Boolean, default: true },
  department: { type: String, required: true },
});

module.exports = mongoose.model('Doctor', DoctorSchema);