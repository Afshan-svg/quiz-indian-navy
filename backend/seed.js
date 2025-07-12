const mongoose = require('mongoose');
const User = require('./models/User');
const Score = require('./models/Score');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  await User.deleteMany({});
  await Score.deleteMany({});

  const users = await User.create([
    { email: 'admin@quiz.com', password: 'admin123', role: 'admin', selectedLocation: null },
    { email: 'user@quiz.com', password: 'user123', role: 'user', selectedLocation: null },
  ]);

  await Score.create([
    { userId: users[1]._id, month: 'November', year: 2024, score: 85, location: 'maharashtra' },
    { userId: users[1]._id, month: 'October', year: 2024, score: 92, location: 'maharashtra' },
  ]);

  console.log('Demo users and scores created');
  mongoose.connection.close();
}).catch(err => {
  console.error('Error seeding database:', err);
  mongoose.connection.close();
});