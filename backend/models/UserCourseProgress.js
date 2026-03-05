const mongoose = require('mongoose');

const { Schema } = mongoose;

const userCourseProgressSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    completedLessons: [
      {
        type: String, // e.g. "0-0" => moduleIndex-lessonIndex
      },
    ],
    lastLessonKey: {
      type: String,
    },
    lessonProgress: [
      {
        lessonKey: {
          type: String, // e.g. "0-0"
          required: true,
        },
        lastTime: {
          type: Number, // seconds
          default: 0,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

userCourseProgressSchema.index({ user: 1, course: 1 }, { unique: true });

const UserCourseProgress = mongoose.model(
  'UserCourseProgress',
  userCourseProgressSchema
);

module.exports = UserCourseProgress;

