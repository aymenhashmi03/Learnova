const express = require('express');
const { body, param } = require('express-validator');
const { protect, requireRole } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const {
  getMyCourses,
  getMyOrders,
  updateMyProfile,
  getMyCourseLearning,
  completeLesson,
  getLessonVideoUrl,
  saveLessonProgress,
} = require('../controllers/studentController');

const router = express.Router();

// All student routes require authentication and student role
router.use(protect, requireRole('student'));

router.get('/me/courses', getMyCourses);
router.get('/me/orders', getMyOrders);

router.patch(
  '/me',
  [
    body('name')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Name is required when provided'),
    body('email')
      .optional()
      .isEmail()
      .withMessage('Please provide a valid email address'),
  ],
  validateRequest,
  updateMyProfile
);

// Learning endpoints
router.get(
  '/me/courses/:courseId/learning',
  [param('courseId').isMongoId().withMessage('Invalid course id')],
  validateRequest,
  getMyCourseLearning
);

router.post(
  '/me/courses/:courseId/lessons/complete',
  [
    param('courseId').isMongoId().withMessage('Invalid course id'),
    body('moduleIndex')
      .isInt({ min: 0 })
      .withMessage('moduleIndex must be a non-negative integer'),
    body('lessonIndex')
      .isInt({ min: 0 })
      .withMessage('lessonIndex must be a non-negative integer'),
  ],
  validateRequest,
  completeLesson
);

router.get(
  '/me/courses/:courseId/lessons/:moduleIndex/:lessonIndex/video',
  [
    param('courseId').isMongoId().withMessage('Invalid course id'),
    param('moduleIndex')
      .isInt({ min: 0 })
      .withMessage('moduleIndex must be a non-negative integer'),
    param('lessonIndex')
      .isInt({ min: 0 })
      .withMessage('lessonIndex must be a non-negative integer'),
  ],
  validateRequest,
  getLessonVideoUrl
);

router.post(
  '/me/courses/:courseId/lessons/:moduleIndex/:lessonIndex/progress',
  [
    param('courseId').isMongoId().withMessage('Invalid course id'),
    param('moduleIndex')
      .isInt({ min: 0 })
      .withMessage('moduleIndex must be a non-negative integer'),
    param('lessonIndex')
      .isInt({ min: 0 })
      .withMessage('lessonIndex must be a non-negative integer'),
    body('currentTime')
      .isFloat({ min: 0 })
      .withMessage('currentTime must be a non-negative number'),
  ],
  validateRequest,
  saveLessonProgress
);

module.exports = router;

