const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  category: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    unique: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);