require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const passport = require('./config/passport');
const { validateEnv } = require('./utils/env');

const connectDB = require('./config/db');
const apiRoutes = require('./routes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const { handleStripeWebhook } = require('./controllers/paymentController');

const app = express();

// Validate environment configuration
validateEnv();

// Connect to MongoDB
connectDB();

// Security HTTP headers
app.use(helmet());

// Basic rate limiting for all API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', apiLimiter);

// CORS
const allowedOriginsEnv = process.env.CORS_ORIGIN || process.env.FRONTEND_URL || '';
const allowedOrigins = allowedOriginsEnv
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      // Allow non-browser or same-origin requests
      return callback(null, true);
    }
    if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// Stripe webhook must use raw body and be declared before express.json
app.post(
  '/api/v1/payments/webhook',
  express.raw({ type: 'application/json' }),
  handleStripeWebhook
);

// JSON body parser for the rest of the routes
app.use(express.json());

// Sanitize data against NoSQL injection (temporarily disabled due to Express req.query getter issue)
// app.use(
//   mongoSanitize({
//     replaceWith: '_',
//   })
// );

// Initialize Passport (no sessions)
app.use(passport.initialize());

// Mount routes
app.use('/api/v1', apiRoutes);

// Health check / root route
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Learnova LMS API is running',
  });
});

// Not-found and error handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${PORT}`);
});

