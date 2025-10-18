const mongoose = require('mongoose');

const ListItemSchema = new mongoose.Schema({
  firstName: String,
  phone: String,
  notes: String
});

const AssignedListSchema = new mongoose.Schema({
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true },
  items: [ListItemSchema],
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AssignedList', AssignedListSchema);
