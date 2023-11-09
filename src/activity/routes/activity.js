const express = require('express');
const router = express.Router();

const activityController = require('../controller/activity');
const halalActivityController = require('../controller/halalRating');
const managerController = require('../controller/manager');
const activityBookController = require('../controller/book');

router.get('/countries', activityController.getAllCountries);
router.get('/destinations', activityController.getAllDestinations);
router.get('/destinations-search', activityController.getDestinationSearchController);
router.post('/info', activityController.saveOrUpdateActivity);
router.get('/all', activityController.getAllActivity);
router.get('/one', activityController.getActivity);
router.get('/currencies', activityController.getAllCurrencies);
router.get('/segments', activityController.getAllSegments);
router.get('/languages', activityController.getAllLanguages);
router.get('/portfolio/avail', activityController.getPortfolioAvail);
router.get('/portfolio', activityController.getPortfolio);
router.get('/destination-hotels', activityController.getAllDestinationHotels);
router.get('/search', activityController.activitySearch);
router.get('/search/filter', activityController.activitySearchFilter);
router.get('/search-details', activityController.activitySearchDetails);
router.post('/book', activityBookController.activityBook);


router.get('/halal/search', activityController.getAllActivity);
router.post('/halal/rating', halalActivityController.rateActivity);
router.get('/halal/all-activity', halalActivityController.getAllHalalActivity);
router.get('/halal/activity', halalActivityController.getHalalActivity);
router.post('/halal/structure', halalActivityController.halalRatingStructure);
router.get('/halal/structure', halalActivityController.getHalalRatingStructure);

router.get('/manager/search', managerController.managerSearch);
router.post('/manager/info', managerController.managerInfo);
router.get('/manager/all', managerController.getAllManagerInfo);
router.get('/manager/one', managerController.getManagerInfo);

module.exports = router;
