const express = require('express');
const router = express.Router();

const { requireServiceAccessMiddleware } = require('../../auth/middleware/authorization');
const { requireAuth } = require('../../auth/middleware/auth');
const { sendSuccessResponse } = require('../../../shared/utils/responseHandler');

// Import all activity route modules
const activityMasterDataRoutes = require('./activityMasterDataRoutes');
const activityContentRoutes = require('./activityContentRoutes');
const activityAvailabilityRoutes = require('./activityAvailabilityRoutes');
const activityBookingRoutes = require('./activityBookingRoutes');
const halalActivityRatingRoutes = require('./halalActivityRatingRoutes');

// Apply authentication and service access middleware to all routes
router.use(requireAuth);
router.use(requireServiceAccessMiddleware('activity'));

// Health check route
router.get('/health', (req, res) => {
  return sendSuccessResponse(res, 'Activity service is running', {
    service: 'activity',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Mount sub-routes
router.use('/master-data', activityMasterDataRoutes);
router.use('/content', activityContentRoutes);
router.use('/availability', activityAvailabilityRoutes);
router.use('/bookings', activityBookingRoutes);
router.use('/halal-ratings', halalActivityRatingRoutes);

module.exports = router;
