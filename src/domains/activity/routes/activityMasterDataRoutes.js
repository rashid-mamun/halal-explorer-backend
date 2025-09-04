const express = require('express');
const router = express.Router();

const activityMasterDataController = require('../controllers/activityMasterDataController');
const { requirePermissionMiddleware } = require('../../auth/middleware/authorization');
const { authenticate } = require('../../auth/middleware/auth');
const { validateRequestQuery, validateRequestBody } = require('../../../shared/utils/validators');
const activityMasterDataValidators = require('../validators/activityMasterDataValidators');

// Apply authentication to all routes
router.use(authenticate);

// Master data fetch routes (read permissions)
router.get('/countries',
  requirePermissionMiddleware('activity', 'read'),
  activityMasterDataController.fetchCountries
);

router.get('/destinations/:countryCode',
  requirePermissionMiddleware('activity', 'read'),
  validateRequestQuery(activityMasterDataValidators.fetchDestinationsSchema),
  activityMasterDataController.fetchDestinations
);

router.get('/currencies',
  requirePermissionMiddleware('activity', 'read'),
  activityMasterDataController.fetchCurrencies
);

router.get('/segments',
  requirePermissionMiddleware('activity', 'read'),
  activityMasterDataController.fetchSegments
);

router.get('/languages',
  requirePermissionMiddleware('activity', 'read'),
  activityMasterDataController.fetchLanguages
);

router.get('/destination-hotels/:destinationCode',
  requirePermissionMiddleware('activity', 'read'),
  validateRequestQuery(activityMasterDataValidators.fetchDestinationHotelsSchema),
  activityMasterDataController.fetchDestinationHotels
);

router.get('/search-destinations',
  requirePermissionMiddleware('activity', 'read'),
  validateRequestQuery(activityMasterDataValidators.searchDestinationsSchema),
  activityMasterDataController.searchDestinations
);

router.get('/all',
  requirePermissionMiddleware('activity', 'read'),
  activityMasterDataController.getAllMasterData
);

// Sync routes (admin/manager permissions)
router.post('/sync',
  requirePermissionMiddleware('activity', 'create'),
  activityMasterDataController.syncAllMasterData
);

module.exports = router;
