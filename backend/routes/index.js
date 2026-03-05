const express = require('express');

const authRoutes = require('./authRoutes');
const courseRoutes = require('./courseRoutes');
const paymentRoutes = require('./paymentRoutes');
const studentRoutes = require('./studentRoutes');
const adminRoutes = require('./adminRoutes');

const router = express.Router();

// Basic health check / API root
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'Learnova LMS API',
  });
});

// Auth routes
router.use('/auth', authRoutes);

// Course routes
router.use('/courses', courseRoutes);

// Payment routes
router.use('/payments', paymentRoutes);

// Student routes (authenticated learner endpoints)
router.use('/students', studentRoutes);

// Admin routes
router.use('/admin', adminRoutes);

module.exports = router;

