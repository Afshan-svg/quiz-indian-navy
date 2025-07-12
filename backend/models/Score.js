const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  month: { type: String, required: true },
  year: { type: Number, required: true },
  score: { type: Number, required: true },
  location: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Score', scoreSchema);