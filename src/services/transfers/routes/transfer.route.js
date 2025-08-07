const express = require('express');
const { withAuth } = require('../../../middleware/auth.middleware');
const { PERMISSIONS, SERVICES } = require('../../../../authentication/types/authorization.types');
const {
    getPickups,
    getHotels,
    getCountries,
    getDestinations,
    getTerminals,
    searchTerminals,
    getMasterCategories,
    getMasterVehicles,
    getMasterTransferTypes,
    getCurrencies,
    getRoutes,
} = require('../controllers/transfer.controller');
const { multipleAvailability } = require('../controllers/availability.controller');

const router = express.Router();

// Public routes (no authentication)
router.get('/locations/countries', getCountries);
router.get('/locations/destinations', getDestinations);
router.get('/locations/terminals', getTerminals);
router.get('/locations/terminals-search', searchTerminals);
router.get('/locations/destination-hotels', getHotels);

// Protected routes (authentication required)
router.get('/masters/categories', withAuth([PERMISSIONS.MANAGE_TRANSFER_SERVICES], [SERVICES.TRANSFER]), getMasterCategories);
router.get('/masters/vehicles', withAuth([PERMISSIONS.MANAGE_TRANSFER_SERVICES], [SERVICES.TRANSFER]), getMasterVehicles);
router.get('/masters/transferTypes', withAuth([PERMISSIONS.MANAGE_TRANSFER_SERVICES], [SERVICES.TRANSFER]), getMasterTransferTypes);
router.get('/masters/pickups', withAuth([PERMISSIONS.MANAGE_TRANSFER_SERVICES], [SERVICES.TRANSFER]), getPickups);
router.get('/masters/currencies', withAuth([PERMISSIONS.MANAGE_TRANSFER_SERVICES], [SERVICES.TRANSFER]), getCurrencies);
router.get('/routes', withAuth([PERMISSIONS.MANAGE_TRANSFER_SERVICES], [SERVICES.TRANSFER]), getRoutes);
router.post('/availability/routes/:language/:adults/:children/:infants', withAuth([PERMISSIONS.CREATE_BOOKING], [SERVICES.TRANSFER]), multipleAvailability);

module.exports = router;