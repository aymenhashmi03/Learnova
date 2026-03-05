const express = require('express');
const { body, param } = require('express-validator');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
  getAdminOverview,
  getAdminUsers,
  updateAdminUser,
  getAdminOrders,
  updateAdminOrder,
} = require('../controllers/adminController');
const { refundOrder } = require('../controllers/paymentController');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

// All admin routes require admin auth
router.use(protect, adminOnly);

router.get('/overview', getAdminOverview);

// User management
router.get('/users', getAdminUsers);
router.patch(
  '/users/:id',
  [
    param('id').isMongoId().withMessage('Invalid user id'),
    body('role')
      .optional()
      .isIn(['admin', 'student'])
      .withMessage('Invalid role'),
  ],
  validateRequest,
  updateAdminUser
);

// Order management
router.get('/orders', getAdminOrders);
router.patch(
  '/orders/:id',
  [
    param('id').isMongoId().withMessage('Invalid order id'),
    body('paymentStatus')
      .optional()
      .isIn(['pending', 'completed', 'failed', 'refunded'])
      .withMessage('Invalid payment status'),
  ],
  validateRequest,
  updateAdminOrder
);

router.post(
  '/orders/:id/refund',
  [param('id').isMongoId().withMessage('Invalid order id')],
  validateRequest,
  refundOrder
);

module.exports = router;

