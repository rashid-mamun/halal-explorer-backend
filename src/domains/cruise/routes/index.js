const express = require('express');
const router = express.Router();

// Import sub-routes
const cruisePackageRoutes = require('./cruisePackageRoutes');
const cruiseEnquiryRoutes = require('./cruiseEnquiryRoutes');
const cruiseBookingRoutes = require('./cruiseBookingRoutes');
const cruiseMasterDataRoutes = require('./cruiseMasterDataRoutes');

// Note: Authentication and service access middleware are applied at src/routes.js level

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
