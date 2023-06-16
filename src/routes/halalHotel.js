const express = require('express');
const router = express.Router();
const apiController = require('../controller/index');

router.get('/api', async (req, res) => {
  res.status(200).json({
    message: 'Halal hotel API running',
  });
});

router.get('/search', apiController.halalSearch);
router.get('/all-hotels', apiController.getAllHalalHotels);
router.get('/hotel', apiController.getHalalHotel);
router.post('/rating', apiController.halalRating);
router.get('/structure', apiController.getHalalRatingStructure);
router.post('/structure', apiController.halalRatingStructure);

module.exports = router;
