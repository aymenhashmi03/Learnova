const Course = require('../models/Course');

// Admin: create course
const createCourse = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      price,
      thumbnail,
      level,
      duration,
      modules,
    } = req.body;

    if (!title || !description || !category) {
      res.status(400);
      throw new Error('Title, description and category are required');
    }

    const course = await Course.create({
      title,
      description,
      category,
      price,
      thumbnail,
      level,
      duration,
      modules,
      createdBy: req.user._id,
    });

    res.status(201).json(course);
  } catch (error) {
    next(error);
  }
};

// Admin: update only the course structure (modules + lessons order)
const updateCourseStructure = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { modules } = req.body;

    if (!Array.isArray(modules)) {
      res.status(400);
      throw new Error('Modules must be an array');
    }

    const course = await Course.findById(id);

    if (!course) {
      res.status(404);
      throw new Error('Course not found');
    }

    course.modules = modules;

    const updatedCourse = await course.save();

    res.status(200).json(updatedCourse.modules);
  } catch (error) {
    next(error);
  }
};

// Admin: update course
const updateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);

    if (!course) {
      res.status(404);
      throw new Error('Course not found');
    }

    Object.assign(course, req.body);

    const updatedCourse = await course.save();

    res.status(200).json(updatedCourse);
  } catch (error) {
    next(error);
  }
};

// Admin: delete course
const deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);

    if (!course) {
      res.status(404);
      throw new Error('Course not found');
    }

    await course.deleteOne();

    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Admin: get all courses (admin view, includes enrolledStudents count and createdBy)
const getAllCoursesAdmin = async (req, res, next) => {
  try {
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const [courses, total] = await Promise.all([
      Course.find()
        .populate('createdBy', 'name email role')
        .populate('enrolledStudents', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Course.countDocuments(),
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

// Public: get all courses (public view) with search, filters, sorting, pagination
const getAllCoursesPublic = async (req, res, next) => {
  try {
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 12;
    const skip = (page - 1) * limit;
    const { search, category, level, sort: sortParam } = req.query;

    const filter = {};

    if (search) {
      filter.$text = { $search: search };
    }

    if (category) {
      filter.category = category;
    }

    if (level) {
      filter.level = level;
    }

    let sort = { createdAt: -1 };

    if (sortParam === 'price_asc') {
      sort = { price: 1, createdAt: -1 };
    } else if (sortParam === 'price_desc') {
      sort = { price: -1, createdAt: -1 };
    } else if (sortParam === 'newest') {
      sort = { createdAt: -1 };
    }

    const [courses, total] = await Promise.all([
      Course.find(filter)
        .select('title description category price thumbnail level duration')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Course.countDocuments(filter),
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

// Public: get single course details (never expose raw S3/video links)
const getCourseById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id)
      .populate('createdBy', 'name')
      .populate('enrolledStudents', 'name')
      .lean();

    if (!course) {
      res.status(404);
      throw new Error('Course not found');
    }

    if (course.modules) {
      course.modules = course.modules.map((mod) => ({
        ...mod,
        lessons: (mod.lessons || []).map(({ videoUrl, ...lesson }) => lesson),
      }));
    }

    res.status(200).json(course);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCourse,
  updateCourse,
  deleteCourse,
  getAllCoursesAdmin,
  getAllCoursesPublic,
  getCourseById,
  updateCourseStructure,
};

