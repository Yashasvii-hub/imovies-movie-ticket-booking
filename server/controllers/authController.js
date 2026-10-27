const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User');
const memoryStore = require('../config/memoryStore');
const { JWT_SECRET } = require('../middleware/auth');

const signToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, email, and password.'
      });
    }

    const isMongo = mongoose.connection.readyState === 1;

    if (isMongo) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email address already exists.'
        });
      }

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        password,
        phone: phone || '',
        role: role === 'admin' ? 'admin' : 'user'
      });

      const token = signToken(user._id);

      return res.status(201).json({
        success: true,
        message: 'Account registered successfully.',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone
        }
      });
    } else {
      // Memory Store fallback
      const existing = memoryStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email address already exists.'
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = {
        _id: '66a1' + Math.random().toString(16).substring(2, 22).padEnd(20, '0'),
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        phone: phone || '',
        role: role === 'admin' ? 'admin' : 'user',
        createdAt: new Date()
      };

      memoryStore.users.push(newUser);
      const token = signToken(newUser._id);

      return res.status(201).json({
        success: true,
        message: 'Account registered successfully.',
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          phone: newUser.phone
        }
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    const isMongo = mongoose.connection.readyState === 1;

    if (isMongo) {
      const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials. Please verify your email and password.'
        });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials. Please verify your email and password.'
        });
      }

      const token = signToken(user._id);

      return res.status(200).json({
        success: true,
        message: 'Logged in successfully.',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone
        }
      });
    } else {
      // Memory Store fallback
      const user = memoryStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials. Please verify your email and password.'
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials. Please verify your email and password.'
        });
      }

      const token = signToken(user._id);

      return res.status(200).json({
        success: true,
        message: 'Logged in successfully.',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone
        }
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        phone: req.user.phone,
        createdAt: req.user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};
