const express = require('express');
const router = express.Router();
const hotelRoutes = require('./hotel/routes');
const activityRoutes = require('./activity/routes/activity');

router.get('/', (req, res) => {
  res.status(200).send('<h1 style="text-align: center">App Online, 2023!</h1>');
});

router.use('/hotel', hotelRoutes);
router.use('/activity', activityRoutes);

module.exports = router;