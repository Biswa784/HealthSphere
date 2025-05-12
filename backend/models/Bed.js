const mongoose = require('mongoose');

const BedSchema = new mongoose.Schema({
    number: { type: Number, required: true, unique: true },
    status: { type: String, enum: ['available', 'occupied'], default: 'available' },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    lastOccupied: { type: Date, default: null },
    currentBooking: { type: mongoose.Schema.Types.ObjectId, ref: 'OPDBook', default: null }
  });
  

module.exports = mongoose.model('Bed', BedSchema);