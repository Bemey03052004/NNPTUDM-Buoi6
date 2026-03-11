const mongoose = require('mongoose');
const { Schema } = mongoose;

const RoleSchema = new Schema({
  name: { type: String, unique: true, required: true },
  description: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Role', RoleSchema);