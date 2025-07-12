const Question = require('../models/Question');
const Location = require('../models/Location');

exports.createQuestion = async (req, res) => {
  try {
    const { question, options, correctAnswer, location, month, year } = req.body;
    console.log("Looking for location with ID:", location);

    const locationDoc = await Location.findById(location);
    console.log("Location query result:", locationDoc);

    if (!locationDoc) {
      return res.status(404).json({ error: 'Location not found' });
    }

    const newQuestion = new Question({
      question,
      options,
      correctAnswer,
      location: locationDoc._id, 
      month,
      year
    });

    await newQuestion.save();
    res.status(201).json({ message: 'Question created successfully', question: newQuestion });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// KEEP ONLY ONE getQuestions function
exports.getQuestions = async (req, res) => {
  try {
    const { location, month, year } = req.query;
    
    const query = {};
    if (location) query.location = location;
    if (month) query.month = month;
    if (year) query.year = parseInt(year);
    
    console.log('Query parameters:', query); // Debug log
    
    const questions = await Question.find(query)
      .populate('location', 'location') 
      .sort({ createdAt: -1 });
    
    console.log(`Found ${questions.length} questions`); // Debug log
    
    res.status(200).json(questions);
  } catch (error) {
    console.error('Error in getQuestions:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id).populate('location');
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    res.json(question);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const { question, options, correctAnswer, location, month, year } = req.body;
    
    const locationExists = await Location.findById(location);
    if (!locationExists) {
      return res.status(404).json({ error: 'Location not found' });
    }

    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.id,
      { question, options, correctAnswer, location, month, year },
      { new: true, runValidators: true }
    ).populate('location');

    if (!updatedQuestion) {
      return res.status(404).json({ error: 'Question not found' });
    }

    res.json({ message: 'Question updated successfully', question: updatedQuestion });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};