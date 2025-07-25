const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');

// Remove '/questions' from the paths since you're mounting at '/api/questions'
router.post('/', questionController.createQuestion);
router.get('/', questionController.getQuestions);
router.get('/:id', questionController.getQuestionById);
router.put('/:id', questionController.updateQuestion);
router.delete('/:id', questionController.deleteQuestion);

module.exports = router;