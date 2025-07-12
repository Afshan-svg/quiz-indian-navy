// controllers/quizScoreController.js
const QuizScore = require('../models/QuizScore');
const User = require('../models/User');
const Location = require('../models/Location');

exports.saveQuizScore = async (req, res) => {
  try {
    const { score, totalQuestions, correctAnswers, month, year, locationId, timeTaken, questionsAttempted } = req.body;
    const userId = req.user.id; // From auth middleware

    // Check if score already exists for this month
    const existingScore = await QuizScore.findOne({
      user: userId,
      location: locationId,
      month,
      year
    });

    if (existingScore) {
      // Update existing score if new score is better
      if (score > existingScore.score) {
        existingScore.score = score;
        existingScore.totalQuestions = totalQuestions;
        existingScore.correctAnswers = correctAnswers;
        existingScore.timeTaken = timeTaken;
        existingScore.completedAt = new Date();
        existingScore.questionsAttempted = questionsAttempted;
        await existingScore.save();
        
        return res.json({ 
          message: 'Score updated (new high score!)', 
          score: existingScore,
          isNewHighScore: true 
        });
      } else {
        return res.json({ 
          message: 'Score recorded (previous score was higher)', 
          score: existingScore,
          isNewHighScore: false 
        });
      }
    }

    // Create new score
    const newScore = new QuizScore({
      user: userId,
      location: locationId,
      score,
      totalQuestions,
      correctAnswers,
      month,
      year,
      timeTaken,
      questionsAttempted
    });

    await newScore.save();
    res.status(201).json({ 
      message: 'Score saved successfully', 
      score: newScore,
      isNewHighScore: true 
    });
  } catch (error) {
    console.error('Error saving score:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getUserScores = async (req, res) => {
  try {
    const userId = req.user.id;
    const { year } = req.query;

    const scores = await QuizScore.find({ 
      user: userId,
      ...(year && { year: parseInt(year) })
    })
    .populate('location', 'location')
    .sort({ completedAt: -1 });

    res.json(scores);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getMonthlyLeaderboard = async (req, res) => {
  try {
    const { locationId, month, year } = req.query;

    const leaderboard = await QuizScore.find({
      location: locationId,
      month,
      year: parseInt(year)
    })
    .populate('user', 'email')
    .sort({ score: -1, timeTaken: 1 }) // Sort by score desc, then by time asc
    .limit(10);

    res.json(leaderboard);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const stats = await QuizScore.aggregate([
      { $match: { user: mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalQuizzes: { $sum: 1 },
          averageScore: { $avg: '$score' },
          highestScore: { $max: '$score' },
          totalCorrectAnswers: { $sum: '$correctAnswers' },
          totalQuestions: { $sum: '$totalQuestions' }
        }
      }
    ]);

    res.json(stats[0] || {
      totalQuizzes: 0,
      averageScore: 0,
      highestScore: 0,
      totalCorrectAnswers: 0,
      totalQuestions: 0
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};