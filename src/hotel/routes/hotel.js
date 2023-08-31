const express = require('express');
const router = express.Router();
const apiController = require('../controller/index');

router.get('/api', async (req, res) => {
  res.status(200).json({
    message: 'Hotel API running',
  });
});

router.get('/search', apiController.hotelSearch);
router.get('/search/filter', apiController.hotelSearchFilter);
router.get('/search-details', apiController.hotelSearchDetails);
router.get('/dumb', apiController.dumbHotelById);

module.exports = router;
