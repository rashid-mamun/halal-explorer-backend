const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../auth/middleware/auth');
const { requireServiceAccessMiddleware } = require('../../auth/middleware/authorization');
const { sendSuccessResponse } = require('../../../shared/utils/responseHandler');

// Import sub-routes
const insuranceConfigRoutes = require('./insuranceConfigRoutes');
const insuranceRoutes = require('./insuranceRoutes');
const insuranceBookingRoutes = require('./insuranceBookingRoutes');

// Apply authentication and service access middleware to all insurance routes
router.use(requireAuth);
router.use(requireServiceAccessMiddleware('insurance'));

// Health check endpoint
router.get('/health', (req, res) => {
  sendSuccessResponse(res, 'Insurance service is healthy', { status: 'ok' });
});

// Mount sub-routes
router.use('/config', insuranceConfigRoutes);
router.use('/policies', insuranceRoutes);
router.use('/bookings', insuranceBookingRoutes);

module.exports = router;
