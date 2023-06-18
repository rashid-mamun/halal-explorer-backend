const express = require('express');
const router = express.Router();
const apiController = require('../controller/index');

router.get('/api', async (req, res) => {
  res.status(200).json({
    message: 'Halal hotel API running',
  });
});

router.get('/search', apiController.halalSearch);
router.post('/rating', apiController.halalRating);
router.get('/all-hotels', apiController.getAllHalalHotel);
router.get('/hotel', apiController.getHalalHotel);
router.post('/structure', apiController.halalRatingStrucuture);
router.get('/structure', apiController.getHalalRatingStrucuture);

module.exports = router;