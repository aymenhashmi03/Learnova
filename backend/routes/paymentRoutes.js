const express = require('express');
const { body } = require('express-validator');
const { createPaymentIntent } = require('../controllers/paymentController');
const { protect, requireRole } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

// Logged-in students create a payment intent for a course
router.post(
  '/create-intent',
  protect,
  requireRole('student'),
  [body('courseId').isMongoId().withMessage('Valid courseId is required')],
  validateRequest,
  createPaymentIntent
);

module.exports = router;

