const User = require('../models/User');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  const { email, password, selectedLocation } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Update user's selectedLocation
    user.selectedLocation = selectedLocation || user.selectedLocation;
    await user.save();

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '28d',
    });

    res.json({ token, user: { id: user._id, email: user.email, selectedLocation: user.selectedLocation, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { login };