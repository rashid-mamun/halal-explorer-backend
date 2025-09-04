const express = require('express');
const cors = require('cors');
const multer = require('multer');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const routes = require('./routes');
const authRoutes = require('./domains/auth/routes/authRoutes');

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});
app.use(limiter);

// CORS
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  credentials: true
}));

// Body parsing middleware
app.use(express.static('static'));
app.use(bodyParser.json({ limit: '500mb' }));
app.use(bodyParser.urlencoded({ limit: '500mb', extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('', routes);

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  
  const { sendErrorResponse } = require('./shared/utils/responseHandler');
  return sendErrorResponse(res, error.message || 'Internal server error');
});

// 404 handler
app.use('*', (req, res) => {
  const { sendNotFoundResponse } = require('./shared/utils/responseHandler');
  return sendNotFoundResponse(res, 'Route not found');
});

module.exports = app;
