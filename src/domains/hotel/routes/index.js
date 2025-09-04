const express = require('express');
const router = express.Router();
const hotelRoutes = require('./hotelRoutes');
const halalRatingRoutes = require('./halalRatingRoutes');
const managerRoutes = require('./managerRoutes');

// Health check route
router.get('/health', async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Hotel Domain API running',
    timestamp: new Date().toISOString()
  });
});

// Mount sub-routes
router.use('/hotel', hotelRoutes);
router.use('/halal-rating', halalRatingRoutes);
router.use('/manager', managerRoutes);

module.exports = router;
