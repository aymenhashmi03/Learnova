const express = require('express');
const passport = require('passport');
const { body, param } = require('express-validator');
const { register, login } = require('../controllers/authController');
const generateToken = require('../utils/generateToken');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
  ],
  validateRequest,
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validateRequest,
  login
);

// Google OAuth
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: '/auth/google/failure',
  }),
  (req, res) => {
    const user = req.user;
    const token = generateToken(user._id, user.role);

    const { FRONTEND_URL } = process.env;

    if (FRONTEND_URL) {
      const base = FRONTEND_URL.replace(/\/$/, '');
      const redirectUrl = `${base}/auth/google/callback?token=${encodeURIComponent(
        token
      )}&userId=${encodeURIComponent(user._id.toString())}&name=${encodeURIComponent(
        user.name || ''
      )}&email=${encodeURIComponent(user.email || '')}&role=${encodeURIComponent(
        user.role
      )}`;

      return res.redirect(redirectUrl);
    }

    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  }
);

router.get('/google/failure', (req, res) => {
  res.status(401).json({ message: 'Google authentication failed' });
});

module.exports = router;

