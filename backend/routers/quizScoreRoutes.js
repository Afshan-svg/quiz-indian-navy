// routes/quizScoreRoutes.js
const express = require('express');
const router = express.Router();
const quizScoreController = require('../controllers/quizScoreController');

router.post('/save',  quizScoreController.saveQuizScore);
router.get('/user-scores', quizScoreController.getUserScores);
router.get('/leaderboard', quizScoreController.getMonthlyLeaderboard);
router.get('/user-stats', quizScoreController.getUserStats);


module.exports = router;