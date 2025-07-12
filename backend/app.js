const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRouter = require('./routers/authRouter');
const quizRouter = require('./routers/quizRouter');
const userRouter = require ('./routers/userRoutes.js');
const locationRoutes = require('./routers/locationRoutes.js');
const questionRoutes = require('./routers/questionRoutes.js');
const quizScoreRouter = require('./routers/quizScoreRoutes.js');
const categoryRoutes = require('./routers/categoryRoutes.js')
const bookRoutes = require ('./routers/bookRoutes.js')
const path = require ('path')
require('dotenv').config();

const app = express();

app.use(cors({ origin: 'http://localhost:8080' }));
app.use(express.json());
app.use('/uploads', (req, res, next) => {
  console.log(`Requested file: ${req.originalUrl}`);
  next();
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Add logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use('/api/auth', authRouter);
app.use('/api/quiz', quizRouter);
app.use('/api/user', userRouter);
app.use('/api/locations', locationRoutes);
app.use('/api/questions', questionRoutes); 
app.use ('/api/quiz-scores', quizRouter)
app.use('/api/categories', categoryRoutes);
app.use('/api/books', bookRoutes);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
}).catch(err => console.error('MongoDB connection error:', err));