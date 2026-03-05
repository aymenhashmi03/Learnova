const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect middleware - verifies JWT and attaches user to req.user
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    return next(new Error('Not authorized, no token provided'));
  }

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      res.status(401);
      throw new Error('Not authorized, user not found');
    }

    req.user = user;
    next();
  } catch (error) {
    if (!res.statusCode || res.statusCode === 200) {
      res.status(401);
    }
    next(error);
  }
};

// Admin only middleware - requires authenticated admin user
const adminOnly = (req, res, next) => {
  if (!req.user) {
    res.status(401);
    return next(new Error('Not authorized'));
  }

  if (req.user.role !== 'admin') {
    res.status(403);
    return next(new Error('Admin access only'));
  }

  next();
};

// Generic role-based access control
const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) {
    res.status(401);
    return next(new Error('Not authorized'));
  }

  if (!roles.includes(req.user.role)) {
    res.status(403);
    return next(new Error('Forbidden'));
  }

  return next();
};

module.exports = {
  protect,
  adminOnly,
  requireRole,
};

