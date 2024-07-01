const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  hash: { type: String, required: true, unique: true },
  filePath: { type: String, },
  status: { type: String, required: true, default: 'pending' },
});

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;
