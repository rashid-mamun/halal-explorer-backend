const express = require('express');
const router = express.Router();
const hotelRoutes = require('./hotel/routes');
const activityRoutes = require('./activity/routes/activity');
const transfersRoutes = require('./transfers/routes/transfers');
const insuranceRoutes = require('./insurance/routes/insurance');
const holidayRoutes = require('./holiday/routes/holiday');
const cruiseRoutes = require('./cruise/routes/cruise');
const authRoutes = require('./auth-system/routes/authRoutes');
router.get('/', (req, res) => {
  res.status(200).send('<h1 style="text-align: center">App Online, 2023!</h1>');
});
router.use('/auth', authRoutes);
router.use('/hotel', hotelRoutes);
router.use('/activity', activityRoutes);
router.use('/transfers', transfersRoutes);
router.use('/insurance', insuranceRoutes);
router.use('/holiday', holidayRoutes);
router.use('/cruise', cruiseRoutes);

module.exports = router;