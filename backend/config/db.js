const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    // eslint-disable-next-line no-console
    console.log('MongoDB connected successfully');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('MongoDB connection error:', error.message);
    if (error.message.includes('ECONNREFUSED') && process.env.MONGODB_URI?.includes('127.0.0.1')) {
      // eslint-disable-next-line no-console
      console.error('Tip: Install MongoDB locally (https://www.mongodb.com/try/download/community) or use Atlas in .env');
    }
    process.exit(1);
  }
};

module.exports = connectDB;

