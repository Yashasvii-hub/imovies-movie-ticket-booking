const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const memoryStore = require('../config/memoryStore');

const JWT_SECRET = process.env.JWT_SECRET || 'imovies_super_secret_jwt_key_evaluation_2026';

// Middleware to verify JWT token
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. Please provide a valid Bearer token.'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (mongoose.connection.readyState === 1) {
      req.user = await User.findById(decoded.id).select('-password');
    } else {
      req.user = memoryStore.users.find(u => u._id.toString() === decoded.id.toString());
    }

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists.'
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token verification failed or token has expired.'
    });
  }
};

// Middleware to restrict by role
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user ? req.user.role : 'anonymous'}' is not authorized to perform this operation.`
      });
    }
    next();
  };
};

module.exports = { protect, authorize, JWT_SECRET };
