const express = require('express');
const router = express.Router();
const apiHotelSearch = require('./hotelSearch')

router.get('/', (req, res) => {
  res.status(200).send('<h1 style="text-align: center">App Online, 2023!</h1>');
});

router.use('', apiHotelSearch);


module.exports = router;
