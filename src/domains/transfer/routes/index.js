const express = require('express');
const router = express.Router();

const transferLocationRoutes = require('./transferLocationRoutes');
const transferMasterDataRoutes = require('./transferMasterDataRoutes');
const transferRouteRoutes = require('./transferRouteRoutes');
const transferAvailabilityRoutes = require('./transferAvailabilityRoutes');
const transferBookingRoutes = require('./transferBookingRoutes');

const { requireAuth } = require('../../../domains/auth/middleware/auth');
const { requireServiceAccessMiddleware } = require('../../../domains/auth/middleware/authorization');

// Apply authentication and service access middleware to all transfer routes
router.use(requireAuth);
router.use(requireServiceAccessMiddleware('transfers'));

// Health check
router.get('/health', (req, res) => {
  res.json({ 
    status: 'Transfer Service is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Mount sub-routes
router.use('/locations', transferLocationRoutes);
router.use('/master-data', transferMasterDataRoutes);
router.use('/routes', transferRouteRoutes);
router.use('/availability', transferAvailabilityRoutes);
router.use('/bookings', transferBookingRoutes);

module.exports = router;
