const express = require('express');
const router = express.Router();
const { sendSuccessResponse } = require('../../../shared/utils/responseHandler');

// Import sub-routes
const insuranceConfigRoutes = require('./insuranceConfigRoutes');
const insuranceRoutes = require('./insuranceRoutes');
const insuranceBookingRoutes = require('./insuranceBookingRoutes');

// Note: Authentication and service access middleware are applied at src/routes.js level

// Health check endpoint
router.get('/health', (req, res) => {
  sendSuccessResponse(res, 'Insurance service is healthy', { status: 'ok' });
});

// Mount sub-routes
router.use('/config', insuranceConfigRoutes);
router.use('/policies', insuranceRoutes);
router.use('/bookings', insuranceBookingRoutes);

module.exports = router;
