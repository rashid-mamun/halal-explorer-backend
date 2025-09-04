const express = require('express');
const router = express.Router();

const transferLocationController = require('../controllers/transferLocationController');
const { requireAuth } = require('../../../domains/auth/middleware/auth');
const { requirePermissionMiddleware } = require('../../../domains/auth/middleware/authorization');
const { validateRequestQuery, validateRequestParams } = require('../../../shared/utils/validators');
const {
  getCountriesSchema,
  getDestinationsSchema,
  getTerminalsSchema,
  getHotelsSchema,
  getPickupsSchema,
  searchLocationsSchema,
  getLocationsByTypeSchema,
  locationTypeSchema,
  locationCodeSchema
} = require('../validators/transferLocationValidators');

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'Transfer Location Service is running' });
});

// Get countries
router.get('/countries', 
  requireAuth,
  requirePermissionMiddleware('transfers', 'read'),
  validateRequestQuery(getCountriesSchema),
  transferLocationController.getCountries
);

// Get destinations
router.get('/destinations', 
  requireAuth,
  requirePermissionMiddleware('transfers', 'read'),
  validateRequestQuery(getDestinationsSchema),
  transferLocationController.getDestinations
);

// Get terminals
router.get('/terminals', 
  requireAuth,
  requirePermissionMiddleware('transfers', 'read'),
  validateRequestQuery(getTerminalsSchema),
  transferLocationController.getTerminals
);

// Get hotels
router.get('/hotels', 
  requireAuth,
  requirePermissionMiddleware('transfers', 'read'),
  validateRequestQuery(getHotelsSchema),
  transferLocationController.getHotels
);

// Get pickups
router.get('/pickups', 
  requireAuth,
  requirePermissionMiddleware('transfers', 'read'),
  validateRequestQuery(getPickupsSchema),
  transferLocationController.getPickups
);

// Search locations
router.get('/search', 
  requireAuth,
  requirePermissionMiddleware('transfers', 'read'),
  validateRequestQuery(searchLocationsSchema),
  transferLocationController.searchLocations
);

// Get locations by type
router.get('/type/:type', 
  requireAuth,
  requirePermissionMiddleware('transfers', 'read'),
  validateRequestParams(locationTypeSchema),
  validateRequestQuery(getLocationsByTypeSchema),
  transferLocationController.getLocationsByType
);

// Get location by code and type
router.get('/:type/:code', 
  requireAuth,
  requirePermissionMiddleware('transfers', 'read'),
  validateRequestParams(locationCodeSchema),
  transferLocationController.getLocationByCode
);

module.exports = router;
