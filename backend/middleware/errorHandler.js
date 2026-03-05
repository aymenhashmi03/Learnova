const logger = require('../utils/logger');

// Global error handler middleware
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.log("FULL ERROR OBJECT:", err);

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  const response = {
    message: err.message || 'Something went wrong',
  };

  if (err.details) {
    response.errors = err.details;
  }

  if (process.env.NODE_ENV !== 'production') {
    response.stack = err.stack;
  }

  // logger.error(err.message, {
  //   statusCode,
  //   path: req.originalUrl,
  //   method: req.method,
  //   ip: req.ip,
  //   userId: req.user?.id,
  //   details: err.details,
  // });

  res.status(statusCode).json(response);
};

module.exports = errorHandler;

