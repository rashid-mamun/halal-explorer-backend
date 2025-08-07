const express = require('express');
const router = express.Router();

// Import service routes
const authRoutes = require('./auth/routes');
const cruiseRoutes = require('./services/cruise/routes');
const insuranceRoutes = require('./services/insurance/routes');
const holidayRoutes = require('./services/holiday/routes');
const adminHolidayRoutes = require('./services/holiday/adminRoutes');

/**
 * Health check endpoint
 */
router.get('/', (request, response) => {
  response.status(200).json({
    status: 'success',
    message: 'Halal Explorer Backend API is online',
    timestamp: new Date().toISOString(),
    version: '2024.1.0'
  });
});

/**
 * Health check endpoint
 */
router.get('/health', (request, response) => {
  response.status(200).json({
    status: 'success',
    message: 'Halal Explorer Backend API is healthy',
    timestamp: new Date().toISOString(),
    version: '2024.1.0',
    services: {
      auth: 'active',
      cruise: 'active',
      insurance: 'active',
      holiday: 'active'
    }
  });
});

// Mount authentication routes
router.use('/auth', authRoutes);

// Mount service routes
router.use('/cruise', cruiseRoutes);
router.use('/insurance', insuranceRoutes);
router.use('/holiday/admin', adminHolidayRoutes);
router.use('/holiday', holidayRoutes);

module.exports = router;