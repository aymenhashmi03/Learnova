const User = require('../models/User');
const Course = require('../models/Course');
const Order = require('../models/Order');
const logger = require('../utils/logger');

// Get high-level admin overview stats and sales series
const getAdminOverview = async (req, res, next) => {
  try {
    const [totalUsers, totalCourses, revenueAgg, recentSales] = await Promise.all([
      User.countDocuments(),
      Course.countDocuments(),
      Order.aggregate([
        { $match: { paymentStatus: 'completed' } },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$amount' },
            totalOrders: { $sum: 1 },
          },
        },
      ]),
      Order.aggregate([
        { $match: { paymentStatus: 'completed' } },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
            },
            revenue: { $sum: '$amount' },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        { $limit: 30 },
      ]),
    ]);

    const totalRevenue =
      revenueAgg && revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;
    const totalOrders =
      revenueAgg && revenueAgg.length > 0 ? revenueAgg[0].totalOrders : 0;

    const salesSeries = recentSales.map((entry) => ({
      date: entry._id,
      revenue: entry.revenue,
      orders: entry.count,
    }));

    const payload = {
      totals: {
        users: totalUsers,
        courses: totalCourses,
        revenue: totalRevenue,
        orders: totalOrders,
      },
      salesSeries,
    };

    logger.info('Admin overview fetched', {
      adminId: req.user?.id,
      ...payload.totals,
    });

    res.status(200).json(payload);
  } catch (error) {
    next(error);
  }
};

// List users for admin management with pagination
const getAdminUsers = async (req, res, next) => {
  try {
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find().select('-password').sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      User.countDocuments(),
    ]);

    const payload = {
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };

    logger.info('Admin users listing fetched', {
      adminId: req.user?.id,
      page,
      limit,
      total,
    });

    res.status(200).json(payload);
  } catch (error) {
    next(error);
  }
};

// Update user (block/unblock or change role)
const updateAdminUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const user = await User.findById(id).select('-password');

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    const previous = {
      role: user.role,
    };

    if (role && ['admin', 'student'].includes(role)) {
      user.role = role;
    }

    const updated = await user.save();

    logger.info('Admin updated user', {
      adminId: req.user?.id,
      userId: user.id,
      previous,
      current: {
        role: updated.role,
      },
    });

    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

// List orders for admin with pagination
const getAdminOrders = async (req, res, next) => {
  try {
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find()
        .populate('user', 'name email')
        .populate('course', 'title')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments(),
    ]);

    const payload = {
      data: orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };

    logger.info('Admin orders listing fetched', {
      adminId: req.user?.id,
      page,
      limit,
      total,
    });

    res.status(200).json(payload);
  } catch (error) {
    next(error);
  }
};

// Update order (e.g. mark refunded)
const updateAdminOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    const order = await Order.findById(id)
      .populate('user', 'name email')
      .populate('course', 'title');

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    if (
      paymentStatus &&
      ['pending', 'completed', 'failed', 'refunded'].includes(paymentStatus)
    ) {
      order.paymentStatus = paymentStatus;
    }

    const previousStatus = order.paymentStatus;

    const updated = await order.save();

    logger.info('Admin updated order', {
      adminId: req.user?.id,
      orderId: order.id,
      previousStatus,
      currentStatus: updated.paymentStatus,
    });

    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminOverview,
  getAdminUsers,
  updateAdminUser,
  getAdminOrders,
  updateAdminOrder,
};

