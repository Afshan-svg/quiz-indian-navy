const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Validate input
    if (!email || !password || !role) {
      return res.status(400).json({ error: 'Email, password, and role are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Create new user
    const user = new User({
      email,
      password,
      role: role.toLowerCase() === 'admin' ? 'admin' : 'user', // Ensure valid role
    });

    // Save user to database
    await user.save();

    // Return success response
    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Server error while creating user' });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('email role selectedLocation createdAt');
    const formattedUsers = users.map(user => ({
      id: user._id,
      email: user.email,
      role: user.role,
      status: user.selectedLocation ? 'active' : 'inactive', // Assuming active if location is set
      joinDate: user.createdAt ? user.createdAt.toISOString().split('T')[0] : 'Unknown',
    }));
    res.status(200).json(formattedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Server error while fetching users' });
  }
};

// Edit a user
exports.editUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, role, password } = req.body;

    // Validate input
    if (!email || !role) {
      return res.status(400).json({ error: 'Email and role are required' });
    }

    // Find user
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update fields
    user.email = email;
    user.role = role.toLowerCase() === 'admin' ? 'admin' : 'user';
    if (password) {
      user.password = password; // Password will be hashed by pre-save middleware
    }

    // Save updated user
    await user.save();

    res.status(200).json({
      message: 'User updated successfully',
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        status: user.selectedLocation ? 'active' : 'inactive',
        joinDate: user.createdAt ? user.createdAt.toISOString().split('T')[0] : 'Unknown',
      },
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Server error while updating user' });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete user
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Server error while deleting user' });
  }
};