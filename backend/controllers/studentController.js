const Course = require('../models/Course');
const Order = require('../models/Order');
const User = require('../models/User');
const UserCourseProgress = require('../models/UserCourseProgress');
const { getSignedVideoUrl } = require('../utils/s3');

// Get courses the current user is enrolled in (with pagination)
const getMyCourses = async (req, res, next) => {
  try {
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 12;
    const skip = (page - 1) * limit;

    const [courses, total] = await Promise.all([
      Course.find({
        enrolledStudents: req.user._id,
      })
        .select('title description category price level duration thumbnail')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Course.countDocuments({ enrolledStudents: req.user._id }),
    ]);

    res.status(200).json({
      data: courses,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get purchase history (orders) for current user with pagination
const getMyOrders = async (req, res, next) => {
  try {
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find({ user: req.user._id })
        .populate('course', 'title price')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments({ user: req.user._id }),
    ]);

    res.status(200).json({
      data: orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Basic profile update (name + email)
const updateMyProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    if (!name && !email) {
      res.status(400);
      throw new Error('At least one of name or email is required');
    }

    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    if (name) {
      user.name = name;
    }

    if (email && email !== user.email) {
      const existing = await User.findOne({ email, _id: { $ne: req.user._id } });
      if (existing) {
        res.status(400);
        throw new Error('Email is already in use');
      }
      user.email = email.toLowerCase().trim();
    }

    const updated = await user.save();

    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

// Get learning view for a specific course (only if enrolled)
const getMyCourseLearning = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
      res.status(404);
      throw new Error('Course not found');
    }

    const isEnrolled = course.enrolledStudents.some(
      (id) => id.toString() === req.user._id.toString()
    );

    if (!isEnrolled) {
      res.status(403);
      throw new Error('You are not enrolled in this course');
    }

    const totalLessons =
      course.modules?.reduce(
        (sum, mod) => sum + (mod.lessons ? mod.lessons.length : 0),
        0
      ) || 0;

    let progress = await UserCourseProgress.findOne({
      user: req.user._id,
      course: course._id,
    }).lean();

    if (!progress) {
      progress = {
        completedLessons: [],
        lastLessonKey: null,
        lessonProgress: [],
      };
    }

    const completedCount = progress.completedLessons?.length || 0;
    const progressPercent =
      totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    // Remove any raw video URLs before sending to client
    const safeCourse = course.toObject();
    if (safeCourse.modules) {
      safeCourse.modules = safeCourse.modules.map((mod) => ({
        ...mod,
        lessons: (mod.lessons || []).map((lesson) => {
          const { videoUrl, ...rest } = lesson;
          return rest;
        }),
      }));
    }

    res.status(200).json({
      course: safeCourse,
      progress: {
        completedLessons: progress.completedLessons || [],
        lastLessonKey: progress.lastLessonKey || null,
        lessonProgress: progress.lessonProgress || [],
        totalLessons,
        completedCount,
        progressPercent,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Mark a lesson as completed for the current user
const completeLesson = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { moduleIndex, lessonIndex } = req.body;

    if (
      moduleIndex === undefined ||
      lessonIndex === undefined ||
      moduleIndex < 0 ||
      lessonIndex < 0
    ) {
      res.status(400);
      throw new Error('moduleIndex and lessonIndex are required');
    }

    const course = await Course.findById(courseId);

    if (!course) {
      res.status(404);
      throw new Error('Course not found');
    }

    const isEnrolled = course.enrolledStudents.some(
      (id) => id.toString() === req.user._id.toString()
    );

    if (!isEnrolled) {
      res.status(403);
      throw new Error('You are not enrolled in this course');
    }

    if (
      !course.modules ||
      !course.modules[moduleIndex] ||
      !course.modules[moduleIndex].lessons ||
      !course.modules[moduleIndex].lessons[lessonIndex]
    ) {
      res.status(400);
      throw new Error('Invalid moduleIndex or lessonIndex');
    }

    const lessonKey = `${moduleIndex}-${lessonIndex}`;

    const progress =
      (await UserCourseProgress.findOne({
        user: req.user._id,
        course: course._id,
      })) ||
      new UserCourseProgress({
        user: req.user._id,
        course: course._id,
        completedLessons: [],
      });

    if (!progress.completedLessons.includes(lessonKey)) {
      progress.completedLessons.push(lessonKey);
    }

    progress.lastLessonKey = lessonKey;

    await progress.save();

    const totalLessons =
      course.modules?.reduce(
        (sum, mod) => sum + (mod.lessons ? mod.lessons.length : 0),
        0
      ) || 0;
    const completedCount = progress.completedLessons.length;
    const progressPercent =
      totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    res.status(200).json({
      completedLessons: progress.completedLessons,
      lastLessonKey: progress.lastLessonKey,
      totalLessons,
      completedCount,
      progressPercent,
    });
  } catch (error) {
    next(error);
  }
};

// Get a signed video URL for a specific lesson in a course
const getLessonVideoUrl = async (req, res, next) => {
  try {
    const { courseId, moduleIndex, lessonIndex } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
      res.status(404);
      throw new Error('Course not found');
    }

    const isEnrolled = course.enrolledStudents.some(
      (id) => id.toString() === req.user._id.toString()
    );

    if (!isEnrolled) {
      res.status(403);
      throw new Error('You are not enrolled in this course');
    }

    const modIdx = Number.parseInt(moduleIndex, 10);
    const lessonIdx = Number.parseInt(lessonIndex, 10);

    if (
      Number.isNaN(modIdx) ||
      Number.isNaN(lessonIdx) ||
      !course.modules ||
      !course.modules[modIdx] ||
      !course.modules[modIdx].lessons ||
      !course.modules[modIdx].lessons[lessonIdx]
    ) {
      res.status(400);
      throw new Error('Invalid moduleIndex or lessonIndex');
    }

    const lesson = course.modules[modIdx].lessons[lessonIdx];

    if (!lesson.videoUrl) {
      res.status(404);
      throw new Error('No video configured for this lesson');
    }

    const expiresSeconds = Math.min(
      Math.max(Number(process.env.S3_SIGNED_URL_EXPIRES) || 600, 300),
      600
    );
    const signedUrl = await getSignedVideoUrl(lesson.videoUrl, expiresSeconds);
    const lessonKey = `${modIdx}-${lessonIdx}`;

    const progress = await UserCourseProgress.findOne({
      user: req.user._id,
      course: course._id,
    }).lean();

    const resumeTime =
      progress?.lessonProgress?.find((p) => p.lessonKey === lessonKey)?.lastTime || 0;

    res.status(200).json({
      url: signedUrl,
      expiresIn: expiresSeconds,
      resumeTime,
    });
  } catch (error) {
    next(error);
  }
};

// Save lesson playback progress (timestamp) for the current user
const saveLessonProgress = async (req, res, next) => {
  try {
    const { courseId, moduleIndex, lessonIndex } = req.params;
    const { currentTime } = req.body;

    const course = await Course.findById(courseId);

    if (!course) {
      res.status(404);
      throw new Error('Course not found');
    }

    const isEnrolled = course.enrolledStudents.some(
      (id) => id.toString() === req.user._id.toString()
    );

    if (!isEnrolled) {
      res.status(403);
      throw new Error('You are not enrolled in this course');
    }

    const modIdx = Number.parseInt(moduleIndex, 10);
    const lessonIdx = Number.parseInt(lessonIndex, 10);

    if (
      Number.isNaN(modIdx) ||
      Number.isNaN(lessonIdx) ||
      !course.modules ||
      !course.modules[modIdx] ||
      !course.modules[modIdx].lessons ||
      !course.modules[modIdx].lessons[lessonIdx]
    ) {
      res.status(400);
      throw new Error('Invalid moduleIndex or lessonIndex');
    }

    const safeTime =
      typeof currentTime === 'number' && currentTime >= 0 ? currentTime : 0;

    const lessonKey = `${modIdx}-${lessonIdx}`;

    const progress =
      (await UserCourseProgress.findOne({
        user: req.user._id,
        course: course._id,
      })) ||
      new UserCourseProgress({
        user: req.user._id,
        course: course._id,
        completedLessons: [],
        lessonProgress: [],
      });

    const existing = progress.lessonProgress.find((p) => p.lessonKey === lessonKey);

    if (existing) {
      existing.lastTime = safeTime;
    } else {
      progress.lessonProgress.push({ lessonKey, lastTime: safeTime });
    }

    progress.lastLessonKey = lessonKey;

    await progress.save();

    res.status(200).json({
      lessonKey,
      lastTime: safeTime,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyCourses,
  getMyOrders,
  updateMyProfile,
  getMyCourseLearning,
  completeLesson,
  getLessonVideoUrl,
  saveLessonProgress,
};

