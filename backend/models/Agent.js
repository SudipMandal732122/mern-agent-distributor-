const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AgentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true }, 
  passwordHash: { type: String, required: true }
}, { timestamps: true });

AgentSchema.methods.matchPassword = async function(password) {
  return bcrypt.compare(password, this.passwordHash);
};

module.exports = mongoose.model('Agent', AgentSchema);
