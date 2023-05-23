const express = require('express');
const router = express.Router();
const apiRoutes = require('../controller/hotelSearch');


router.get('/hotel-search', apiRoutes.hotelSearch);

router.get('/api', async (req, res) => {
  res.status(200).json({
    message: 'flightApiLogger was inserted successfully',
  });
});

module.exports = router;