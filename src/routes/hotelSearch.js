const express = require('express');
const router = express.Router();
const apiRoutes = require('../controller/index');



router.get('/hotel-search', apiRoutes.hotelSearch);
router.get('/hotel-search-details', apiRoutes.hotelSearchDetails);

router.get('/api', async (req, res) => {
  res.status(200).json({
    message: 'flightApiLogger was inserted successfully',
  });
});

module.exports = router;