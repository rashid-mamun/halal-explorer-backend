const express = require('express');
const router = express.Router();
const apiRoutes = require('../controller/index');

router.get('/search', apiRoutes.hotelSearch);
router.get('/search-details', apiRoutes.hotelSearchDetails);
router.get('/api', async (req, res) => {
  res.status(200).json({
    message: 'Hotel api running up',
  });
});

module.exports = router;