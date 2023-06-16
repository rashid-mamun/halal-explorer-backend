const express = require('express');
const router = express.Router();

const activityController = require('../controller/activity');

router.get('/countries', activityController.getAllCountries);
router.get('/destinations', activityController.getAllDestinations);
router.post('/activity', activityController.saveOrUpdateActivity);
router.get('/currencies', activityController.getAllCurrencies);
router.get('/segments', activityController.getAllSegments);
router.get('/languages', activityController.getAllLanguages);
router.get('/portfolio/avail', activityController.getPortfolioAvail);
router.get('/portfolio', activityController.getPortfolio);
router.get('/destination-hotels', activityController.getAllDestinationHotels);



module.exports = router;
