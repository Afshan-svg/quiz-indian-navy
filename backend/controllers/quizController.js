const User = require('../models/User');
const Score = require('../models/Score');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');


exports.saveScore = async (req, res) => {
  try {
    console.log('--- saveScore called ---');
    console.log('Headers:', req.headers);
    console.log('Request body:', req.body);

    const { score, month, year, location } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ message: 'No token provided' });
    }

    // Validate location
    if (!location) {
      console.log('Location is missing');
      return res.status(400).json({ message: 'Location is required' });
    }

    console.log('Token received:', token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);

    const userId = new mongoose.Types.ObjectId(decoded.userId);
    console.log('UserId:', userId);

    const user = await User.findById(userId);
    console.log('User lookup result:', user);

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    // Convert location to ObjectId if it's a string
    const locationId = new mongoose.Types.ObjectId(location);
    console.log('LocationId:', locationId);

    console.log('Checking for existing score...');
    const existingScore = await Score.findOne({
      userId: userId,
      month,
      year,
      location: locationId,
    });
    console.log('Existing score:', existingScore);

    if (existingScore) {
      console.log('Existing score found, updating...');
      existingScore.score = score;
      await existingScore.save();
      console.log('Score updated successfully');
      res.status(200).json({
        message: 'Score updated successfully',
        isNewHighScore: false
      });
    } else {
      console.log('No existing score, creating new...');
      await Score.create({
        userId: userId,
        month,
        year,
        score,
        location: locationId,
      });
      console.log('Score created successfully');
      res.status(200).json({
        message: 'Score saved successfully',
        isNewHighScore: true
      });
    }
  } catch (error) {
    console.error('Error saving score:', error);
    res.status(500).json({ message: 'Error saving score', error: error.message });
  }
};


exports.getScores = async (req, res) => {
  try {
    console.log('--- getScores called ---');
    console.log('Headers:', req.headers);
    console.log('Query params:', req.query);

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ message: 'No token provided' });
    }

    console.log('Token received:', token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);

    // Get query parameters for filtering
    const { year, month } = req.query;

    // Build query
    const query = { userId: decoded.userId };
    if (year) {
      query.year = parseInt(year);
      console.log(`Filtering by year: ${query.year}`);
    }
    const monthMap = [
      null,
      "January", "February", "March",
      "April", "May", "June",
      "July", "August", "September",
      "October", "November", "December"
    ];

    if (month) {
      query.month = monthMap[parseInt(month)];
      console.log(`Filtering by month name: ${query.month}`);
    }


    console.log('Query object:', query);

    const scores = await Score.find(query)
      .populate('location', 'location')
      .sort({ year: -1, month: -1, createdAt: -1 });

    console.log(`Scores found (${scores.length}):`, scores);

    res.status(200).json(scores);
  } catch (error) {
    console.error('Error fetching scores:', error);
    if (error.name === 'JsonWebTokenError') {
      console.log('Invalid token error');
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(500).json({ message: 'Error fetching scores', error: error.message });
  }
};

exports.getAllScores = async (req, res) => {
  try {
    console.log('--- getAllScores called ---');
    console.log('Headers:', req.headers);
    console.log('Query params:', req.query);

    // Get query parameters for filtering
    const { year, month } = req.query;

    // Build query
    const query = {};
    if (year) {
      query.year = parseInt(year);
      console.log(`Filtering by year: ${query.year}`);
    }
    const monthMap = [
      null,
      'January', 'February', 'March',
      'April', 'May', 'June',
      'July', 'August', 'September',
      'October', 'November', 'December'
    ];

    if (month) {
      query.month = monthMap[parseInt(month)];
      console.log(`Filtering by month name: ${query.month}`);
    }

    console.log('Query object:', query);

    const scores = await Score.find(query)
      .populate('userId', 'email')
      .sort({ year: -1, month: -1, createdAt: -1 });

    console.log(`Scores found (${scores.length}):`, scores);

    // Format scores to match frontend expectations
    const formattedScores = scores.map(score => {
      const scoreValue = score.score;
      let status;
      if (scoreValue >= 90) {
        status = 'excellent';
      } else if (scoreValue >= 80) {
        status = 'good';
      } else if (scoreValue >= 70) {
        status = 'average';
      } else {
        status = 'needs-improvement';
      }

      return {
        id: score._id.toString(),
        email: score.userId ? score.userId.email : 'Unknown User',
        quiz: `${score.month} ${score.year}`,
        score: scoreValue,
        date: new Date(score.createdAt).toISOString().split('T')[0], // Format as YYYY-MM-DD
        status,
        location: score.location || 'Unknown Location',
      };
    });

    console.log('Formatted scores:', formattedScores);

    res.status(200).json(formattedScores);
  } catch (error) {
    console.error('Error fetching all scores:', error);
    res.status(500).json({ message: 'Error fetching scores', error: error.message });
  }
};