const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../auth/middleware/auth');
const { requireServiceAccessMiddleware } = require('../../auth/middleware/authorization');

// Import sub-routes
const holidayPackageRoutes = require('./holidayPackageRoutes');
const holidayBookingRoutes = require('./holidayBookingRoutes');
const customHolidayBookingRoutes = require('./customHolidayBookingRoutes');

// Apply authentication and service access middleware to all holiday routes
router.use(requireAuth);
router.use(requireServiceAccessMiddleware('holiday'));

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
