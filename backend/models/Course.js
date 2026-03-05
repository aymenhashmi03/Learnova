const mongoose = require('mongoose');

const { Schema } = mongoose;

const lessonSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    videoUrl: {
      type: String,
      trim: true,
    },
    pdfUrl: {
      type: String,
      trim: true,
    },
    // Explicit position within its module
    order: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const moduleSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    // Explicit position at the course level
    order: {
      type: Number,
      default: 0,
    },
    lessons: [lessonSchema],
  },
  { _id: false }
);

const courseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    thumbnail: {
      type: String,
      trim: true,
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    duration: {
      type: String,
      trim: true,
    },
    modules: [moduleSchema],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    enrolledStudents: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

// Keep module and lesson `order` fields in sync with array position
courseSchema.pre('save', function normalizeModuleAndLessonOrder(next) {
  if (Array.isArray(this.modules)) {
    this.modules.forEach((mod, modIndex) => {
      // eslint-disable-next-line no-param-reassign
      mod.order = modIndex;

      if (Array.isArray(mod.lessons)) {
        mod.lessons.forEach((lesson, lessonIndex) => {
          // eslint-disable-next-line no-param-reassign
          lesson.order = lessonIndex;
        });
      }
    });
  }

  next();
});

// Indexes for common course queries and search
courseSchema.index({ category: 1, level: 1, price: 1, createdAt: -1 });
courseSchema.index({
  title: 'text',
  description: 'text',
  category: 'text',
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;

