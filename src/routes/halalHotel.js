const express = require('express');
const router = express.Router();
const apiRoutes = require('../controller/index');

router.get('/search',apiRoutes.halalSearch);
router.post('/rating', apiRoutes.halalRating);
router.get('/all-hotels',apiRoutes.geAlltHalalHotel);

router.get('/api', async (req, res) => {
  res.status(200).json({
    message: 'Halal hotel api running up',
  });
});

module.exports = router;