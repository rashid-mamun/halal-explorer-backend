const express = require('express');
const router = express.Router();

const transfersController = require('../controller/transfers');


router.get('/locations/countries', transfersController.getCountriesController);
router.get('/locations/destinations', transfersController.getDestinationsController);
router.get('/locations/terminals', transfersController.getTerminalsController);
router.get('/locations/destination-hotels', transfersController.getHotelsController);


router.get('/masters/categories', transfersController.getMasterCategoriesController);
router.get('/masters/vehicles', transfersController.getMasterVehiclesController);
router.get('/masters/transferTypes', transfersController.getMasterTransferTypesController);
router.get('/masters/pickups', transfersController.getPickupsController);
router.get('/masters/currencies', transfersController.getCurrenciesController);


// router.get('/search', transfersController.activitySearch);
// router.get('/search-details', transfersController.activitySearchDetails);


router.get('/routes',transfersController.getRoutesController);


module.exports = router;
