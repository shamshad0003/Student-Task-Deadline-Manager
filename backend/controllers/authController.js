const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
require('dotenv').config();

const register = async (req, res) => {
  if (!req.body) {
    console.error("Register Error: req.body is undefined. Check Content-Type header.");
    return res.status(400).json({ message: 'Request body is missing' });
  }
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const userId = await User.create(username, email, passwordHash);

    // Create token
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '1h',
    });

    res.status(201).json({
      token,
      user: { id: userId, username, email }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  if (!req.body) {
    console.error("Login Error: req.body is undefined. Check Content-Type header.");
    return res.status(400).json({ message: 'Request body is missing' });
  }
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '1h',
    });

    res.json({
      token,
      user: { id: user.id, username: user.username, email: user.email }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { register, login };
