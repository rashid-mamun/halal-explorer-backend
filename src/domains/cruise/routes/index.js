const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../auth/middleware/auth');
const { requireServiceAccessMiddleware } = require('../../auth/middleware/authorization');

// Import sub-routes
const cruisePackageRoutes = require('./cruisePackageRoutes');
const cruiseEnquiryRoutes = require('./cruiseEnquiryRoutes');
const cruiseBookingRoutes = require('./cruiseBookingRoutes');
const cruiseMasterDataRoutes = require('./cruiseMasterDataRoutes');

// Apply authentication and service access middleware to all cruise routes
router.use(requireAuth);
router.use(requireServiceAccessMiddleware('cruise'));

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Cruise API is running',
    timestamp: new Date().toISOString(),
    service: 'cruise'
  });
});

// Mount sub-routes
router.use('/packages', cruisePackageRoutes);
router.use('/enquiries', cruiseEnquiryRoutes);
router.use('/bookings', cruiseBookingRoutes);
router.use('/masterdata', cruiseMasterDataRoutes);

module.exports = router;
