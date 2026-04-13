const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { authSchemas } = require('../utils/validationSchemas');

const register = async (req, res, next) => {
  try {
    const { error, value } = authSchemas.register.validate(req.body);
    if (error) {
      const err = new Error(error.details[0].message);
      err.status = 400;
      throw err;
    }

    const { username, email, password } = value;

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      const err = new Error('User already exists');
      err.status = 400;
      throw err;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const userId = await User.create(username, email, passwordHash);

    // Create token
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(201).json({
      token,
      user: { id: userId, username, email }
    });

  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { error, value } = authSchemas.login.validate(req.body);
    if (error) {
      const err = new Error(error.details[0].message);
      err.status = 400;
      throw err;
    }

    const { email, password } = value;

    const user = await User.findByEmail(email);
    if (!user) {
      const err = new Error('Invalid credentials');
      err.status = 400;
      throw err;
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      const err = new Error('Invalid credentials');
      err.status = 400;
      throw err;
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({
      token,
      user: { id: user.id, username: user.username, email: user.email }
    });

  } catch (error) {
    next(error);
  }
};

module.exports = { register, login };
