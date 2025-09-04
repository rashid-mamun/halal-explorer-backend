const express = require('express');
const router = express.Router();

// Import sub-routes
const holidayPackageRoutes = require('./holidayPackageRoutes');
const holidayBookingRoutes = require('./holidayBookingRoutes');
const customHolidayBookingRoutes = require('./customHolidayBookingRoutes');

// Note: Authentication and service access middleware are applied at src/routes.js level

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Holiday API is running',
    timestamp: new Date().toISOString(),
    service: 'holiday'
  });
});

// Mount sub-routes
router.use('/packages', holidayPackageRoutes);
router.use('/bookings', holidayBookingRoutes);
router.use('/custom-bookings', customHolidayBookingRoutes);

module.exports = router;
