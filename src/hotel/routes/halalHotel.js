const express = require('express');
const router = express.Router();
const apiController = require('../controller/index');

router.get('/api', async (req, res) => {
  res.status(200).json({
    message: 'Halal hotel API running',
  });
});

router.get('/search', apiController.halalSearch);
router.post('/rating', apiController.rateHotel);
router.get('/all-hotels', apiController.getAllHalalHotel);
router.get('/hotel', apiController.getHalalHotel);
router.post('/structure', apiController.halalRatingStructure);
router.get('/structure', apiController.getHalalRatingStructure);

module.exports = router;