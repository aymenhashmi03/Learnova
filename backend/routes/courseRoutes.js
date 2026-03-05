const express = require('express');
const { body, param } = require('express-validator');
const {
  createCourse,
  updateCourse,
  deleteCourse,
  getAllCoursesAdmin,
  getAllCoursesPublic,
  getCourseById,
  updateCourseStructure,
} = require('../controllers/courseController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

// Public routes
router.get('/', getAllCoursesPublic);

// Admin routes (protected + admin only)
router.get('/admin/all', protect, adminOnly, getAllCoursesAdmin);

router.post(
  '/',
  protect,
  adminOnly,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('price')
      .isFloat({ min: 0 })
      .withMessage('Price must be a non-negative number'),
    body('level')
      .optional()
      .isIn(['beginner', 'intermediate', 'advanced'])
      .withMessage('Invalid level'),
  ],
  validateRequest,
  createCourse
);

router.put(
  '/:id',
  protect,
  adminOnly,
  [
    param('id').isMongoId().withMessage('Invalid course id'),
    body('title').optional().trim().notEmpty(),
    body('description').optional().trim().notEmpty(),
    body('category').optional().trim().notEmpty(),
    body('price').optional().isFloat({ min: 0 }),
    body('level')
      .optional()
      .isIn(['beginner', 'intermediate', 'advanced'])
      .withMessage('Invalid level'),
  ],
  validateRequest,
  updateCourse
);

// Admin: update course structure (modules + lessons order)
router.put(
  '/:id/structure',
  protect,
  adminOnly,
  [param('id').isMongoId().withMessage('Invalid course id')],
  validateRequest,
  updateCourseStructure
);

router.delete(
  '/:id',
  protect,
  adminOnly,
  [param('id').isMongoId().withMessage('Invalid course id')],
  validateRequest,
  deleteCourse
);

// Public course detail
router.get(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid course id')],
  validateRequest,
  getCourseById
);

module.exports = router;

