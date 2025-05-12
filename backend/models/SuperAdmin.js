const mongoose = require('mongoose');

const SuperAdminSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  permissions: { type: [String], default: [] },
});

module.exports = mongoose.model('SuperAdmin', SuperAdminSchema);