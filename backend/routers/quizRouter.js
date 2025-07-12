const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

router.post('/save', quizController.saveScore);
router.get('/scores', quizController.getScores);
router.get('/', quizController.getAllScores); 


module.exports = router;