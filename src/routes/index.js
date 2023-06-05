const express = require('express');
const router = express.Router();
const apiHotel = require('./hotel');
const apiHalalHotel = require('./halalHotel')
const apiManager = require('./manager')

router.get('/', (req, res) => {
  res.status(200).send('<h1 style="text-align: center">App Online, 2023!</h1>');
});

router.use('/hotel', apiHotel);
router.use('/halal', apiHalalHotel);
router.use('/manager', apiManager);


module.exports = router;
