const logger = require('./logger');

const validateEnv = () => {
  const requiredCommon = ['MONGODB_URI', 'JWT_SECRET', 'FRONTEND_URL'];
  const requiredProd = ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET'];

  const missingCommon = requiredCommon.filter((key) => !process.env[key]);
  if (missingCommon.length > 0) {
    throw new Error(`Missing required environment variables: ${missingCommon.join(', ')}`);
  }

  if (process.env.NODE_ENV === 'production') {
    const missingProd = requiredProd.filter((key) => !process.env[key]);
    if (missingProd.length > 0) {
      throw new Error(
        `Missing required production environment variables: ${missingProd.join(', ')}`
      );
    }
  } else {
    const missingProd = requiredProd.filter((key) => !process.env[key]);
    if (missingProd.length > 0) {
      logger.warn('Stripe keys are not fully configured (dev mode)', {
        missing: missingProd,
      });
    }
  }
};

module.exports = {
  validateEnv,
};

