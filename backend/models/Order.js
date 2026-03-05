const mongoose = require('mongoose');

const { Schema } = mongoose;

const orderSchema = new Schema(
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
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentIntentId: {
      type: String,
      trim: true,
    },
    failureReason: {
      type: String,
      trim: true,
    },
    failureCount: {
      type: Number,
      default: 0,
    },
    lastFailureAt: Date,
    refundId: {
      type: String,
      trim: true,
    },
    refundedAt: Date,
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

// Indexes to speed up lookups and enforce uniqueness
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ course: 1, createdAt: -1 });
orderSchema.index({ paymentStatus: 1, createdAt: -1 });
orderSchema.index({ paymentIntentId: 1 }, { unique: true, sparse: true });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;

