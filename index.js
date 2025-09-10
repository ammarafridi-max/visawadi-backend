require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');

const AppError = require('./utils/appError');
const visaRoutes = require('./routes/visa.routes');
const globalErrorHandler = require('./controllers/error.controller');

const app = express();

// ---------- ERROR HANDLING ----------
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

// ---------- MIDDLEWARE CONFIGURATION ----------
// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);
app.use(xss());
app.use(mongoSanitize());

// Rate limiting
const limiter = rateLimit({
  max: 500,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.VW_FRONTEND,
      process.env.VW_ADMIN,
      process.env.VW_BACKEND,
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new AppError('Not allowed by CORS', 403));
    }
  },
  methods: 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  allowedHeaders: [
    'Origin',
    'X-Session-ID',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
  ],
  exposedHeaders: ['Cross-Origin-Resource-Policy'],
  credentials: true,
};
app.use(cors(corsOptions));

// Body parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

// ---------- SERVER STARTUP ----------
const server = app.listen(process.env.PORT || 3001, () => {
  console.log(
    `Server running on port ${process.env.PORT || 3001} (${process.env.NODE_ENV})`
  );
});

// ---------- DATABASE CONNECTION ----------
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB successfully');
  } catch (error) {
    console.error(`Error connecting to DB: ${error.message}`);
    process.exit(1);
  }
};
connectDB();

app.use('/api/visa', visaRoutes);

// 404 handler
app.all('/*\w', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Global error handler
app.use(globalErrorHandler);

// Unhandled rejection handler
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});
