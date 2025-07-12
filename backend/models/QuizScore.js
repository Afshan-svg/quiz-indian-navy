// models/QuizScore.js
const mongoose = require('mongoose');

const quizScoreSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  correctAnswers: {
    type: Number,
    required: true
  },
  month: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  completedAt: {
    type: Date,
    default: Date.now
  },
  timeTaken: {
    type: Number, // in seconds
    default: 0
  },
  // Optional: Store question IDs and user answers for detailed analysis
  questionsAttempted: [{
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question'
    },
    userAnswer: Number,
    isCorrect: Boolean
  }]
});

// Compound index to ensure one score per user per location per month
quizScoreSchema.index({ user: 1, location: 1, month: 1, year: 1 }, { unique: true });

// Add methods to calculate statistics
quizScoreSchema.statics.getUserMonthlyScores = async function(userId, year) {
  return this.find({ user: userId, year })
    .populate('location', 'location')
    .sort({ completedAt: -1 });
};

quizScoreSchema.statics.getLocationLeaderboard = async function(locationId, month, year) {
  return this.find({ location: locationId, month, year })
    .populate('user', 'email')
    .sort({ score: -1 })
    .limit(10);
};

module.exports = mongoose.model('QuizScore', quizScoreSchema);