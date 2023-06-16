const express = require('express');
const router = express.Router();
const hotelRoutes = require('./hotel');
const halalHotelRoutes = require('./halalHotel');
const managerRoutes = require('./manager');
const activityRoutes = require('../activity/routes/activity');

router.get('/', (req, res) => {
  res.status(200).send('<h1 style="text-align: center">App Online, 2023!</h1>');
});

router.use('/hotel', hotelRoutes);
router.use('/halal', halalHotelRoutes);
router.use('/manager', managerRoutes);
router.use('/activity', activityRoutes);

module.exports = router;
