const Stripe = require('stripe');
const Course = require('../models/Course');
const Order = require('../models/Order');
const User = require('../models/User');
const logger = require('../utils/logger');
const { sendMail } = require('../utils/emailService');
const { orderConfirmationReceiptEmail } = require('../templates/emailTemplates');

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const stripe = stripeSecretKey ? Stripe(stripeSecretKey) : null;

// Create Stripe payment intent (logged-in users only)
const createPaymentIntent = async (req, res, next) => {
  try {
    if (!stripe) {
      throw new Error('Stripe is not configured');
    }

    const { courseId, idempotencyKey: idempotencyKeyFromClient } = req.body;

    if (!courseId) {
      res.status(400);
      throw new Error('courseId is required');
    }

    const course = await Course.findById(courseId);

    if (!course) {
      res.status(404);
      throw new Error('Course not found');
    }

    // Prevent duplicate purchases: check for completed order for this course
    const existingOrder = await Order.findOne({
      user: req.user._id,
      course: course._id,
      paymentStatus: 'completed',
    }).lean();

    if (existingOrder) {
      res.status(400);
      throw new Error('You have already purchased this course');
    }

    const alreadyEnrolled = course.enrolledStudents.some(
      (id) => id.toString() === req.user._id.toString()
    );

    if (alreadyEnrolled) {
      res.status(400);
      throw new Error('You are already enrolled in this course');
    }

    const amountInCents = Math.round(course.price * 100);

    const idempotencyKey =
      idempotencyKeyFromClient ||
      `${req.user._id.toString()}:${course._id.toString()}:payment_intent`;

    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount: amountInCents,
        currency: 'usd',
        metadata: {
          userId: req.user._id.toString(),
          courseId: course._id.toString(),
          idempotencyKey,
        },
      },
      { idempotencyKey }
    );

    logger.info('Stripe payment intent created', {
      userId: req.user._id.toString(),
      courseId: course._id.toString(),
      amountInCents,
      paymentIntentId: paymentIntent.id,
      idempotencyKey,
    });

    res.status(201).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    next(error);
  }
};

// Stripe webhook handler - payment confirmation and failures
const handleStripeWebhook = async (req, res) => {
  if (!stripe || !stripeWebhookSecret) {
    logger.error('Stripe webhook is not configured properly');
    return res.status(500).send('Stripe not configured');
  }

  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, stripeWebhookSecret);
  } catch (err) {
    logger.warn('Stripe webhook signature verification failed', {
      message: err.message,
    });
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const userId = paymentIntent.metadata?.userId;
      const courseId = paymentIntent.metadata?.courseId;

      if (!userId || !courseId) {
        return res.status(200).json({ received: true });
      }

      const [user, course] = await Promise.all([
        User.findById(userId),
        Course.findById(courseId),
      ]);

      if (!user || !course) {
        return res.status(200).json({ received: true });
      }

      const amount = paymentIntent.amount_received || paymentIntent.amount || 0;

      // Idempotent order creation/update
      const order = await Order.findOneAndUpdate(
        { paymentIntentId: paymentIntent.id },
        {
          $set: {
            user: user._id,
            course: course._id,
            amount: amount / 100,
            paymentStatus: 'completed',
          },
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );

      const alreadyEnrolled = course.enrolledStudents.some(
        (id) => id.toString() === user._id.toString()
      );

      if (!alreadyEnrolled) {
        course.enrolledStudents.push(user._id);
        await course.save();
      }

      const { subject, html } = orderConfirmationReceiptEmail({
        userName: user.name,
        courseTitle: course.title,
        amount: amount / 100,
        orderId: order._id?.toString?.() || order.id,
        date: order.createdAt,
      });
      await sendMail({ to: user.email, subject, html });

      logger.info('Stripe payment succeeded', {
        paymentIntentId: paymentIntent.id,
        userId,
        courseId,
        orderId: order.id,
        amount: amount / 100,
      });
    } else if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object;
      const userId = paymentIntent.metadata?.userId;
      const courseId = paymentIntent.metadata?.courseId;
      const failureReason =
        paymentIntent.last_payment_error?.message ||
        paymentIntent.last_payment_error?.code ||
        'Unknown reason';

      logger.warn('Stripe payment failed', {
        paymentIntentId: paymentIntent.id,
        userId,
        courseId,
        failureReason,
      });

      const amount = paymentIntent.amount || 0;

      await Order.findOneAndUpdate(
        { paymentIntentId: paymentIntent.id },
        userId && courseId
          ? {
              $set: {
                user: userId,
                course: courseId,
                amount: amount / 100,
                paymentStatus: 'failed',
                failureReason,
                lastFailureAt: new Date(),
              },
              $inc: { failureCount: 1 },
            }
          : {
              $set: {
                paymentStatus: 'failed',
                failureReason,
                lastFailureAt: new Date(),
              },
              $inc: { failureCount: 1 },
            },
        {
          upsert: !!(userId && courseId),
          new: true,
          setDefaultsOnInsert: true,
        }
      );
    }

    // Always acknowledge to prevent endless retries
    res.status(200).json({ received: true });
  } catch (error) {
    logger.error('Error processing Stripe webhook', {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).send('Webhook handler failed');
  }
};

// Admin-triggered refund endpoint
const refundOrder = async (req, res, next) => {
  try {
    if (!stripe) {
      throw new Error('Stripe is not configured');
    }

    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    if (!order.paymentIntentId) {
      res.status(400);
      throw new Error('Order does not have an associated payment intent');
    }

    if (order.paymentStatus === 'refunded') {
      res.status(400);
      throw new Error('Order has already been refunded');
    }

    if (order.paymentStatus !== 'completed') {
      res.status(400);
      throw new Error('Only completed orders can be refunded');
    }

    const refund = await stripe.refunds.create({
      payment_intent: order.paymentIntentId,
      amount: Math.round(order.amount * 100),
    });

    order.paymentStatus = 'refunded';
    order.refundId = refund.id;
    order.refundedAt = new Date();

    const updated = await order.save();

    logger.info('Admin refunded order', {
      adminId: req.user?.id,
      orderId: updated.id,
      paymentIntentId: order.paymentIntentId,
      refundId: refund.id,
      amount: order.amount,
    });

    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPaymentIntent,
  handleStripeWebhook,
  refundOrder,
};

