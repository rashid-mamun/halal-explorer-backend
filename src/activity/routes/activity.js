const express = require('express');
const router = express.Router();

const activityController = require('../controller/activity');
const halalActivityController = require('../controller/halalRating');

router.get('/countries', activityController.getAllCountries);
router.get('/destinations', activityController.getAllDestinations);
router.post('/info', activityController.saveOrUpdateActivity);
router.get('/all', activityController.getAllActivity);
router.get('/one', activityController.getActivity);
router.get('/currencies', activityController.getAllCurrencies);
router.get('/segments', activityController.getAllSegments);
router.get('/languages', activityController.getAllLanguages);
router.get('/portfolio/avail', activityController.getPortfolioAvail);
router.get('/portfolio', activityController.getPortfolio);
router.get('/destination-hotels', activityController.getAllDestinationHotels);


router.get('/halal/search',activityController.getAllActivity);
router.post('/halal/rating', halalActivityController.rateActivity);
router.get('/halal/all-activity', halalActivityController.getAllHalalActivity);
router.get('/halal/activity', halalActivityController.getHalalActivity);
router.post('/halal/structure', halalActivityController.halalRatingStructure);
router.get('/halal/structure', halalActivityController.getHalalRatingStructure);

module.exports = router;
