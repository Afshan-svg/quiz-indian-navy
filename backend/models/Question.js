const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: function(arr) {
        return arr.length === 4;
      },
      message: 'Exactly 4 options are required'
    }
  },
  correctAnswer: {
    type: Number,
    required: true,
    min: 0,
    max: 3
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    required: true
  },
  month: {
    type: String,
    required: true,
    enum: ['January', 'February', 'March', 'April', 'May', 'June', 
           'July', 'August', 'September', 'October', 'November', 'December']
  },
  year: {
    type: Number,
    required: true,
    default: new Date().getFullYear()
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Question', questionSchema);