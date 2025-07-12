const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Book title is required'],
    trim: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required'],
  },
  fileUrl: {
    type: String,
    required: [true, 'File URL is required'],
  },
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);