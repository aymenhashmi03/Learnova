const { validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400);
    const err = new Error('Validation failed');
    err.details = errors.array();
    return next(err);
  }

  return next();
};

module.exports = validateRequest;

