const express = require('express');
const router = express.Router();

const transferRouteController = require('../controllers/transferRouteController');
const { requireAuth } = require('../../../domains/auth/middleware/auth');
const { requirePermissionMiddleware } = require('../../../domains/auth/middleware/authorization');
const { validateRequestQuery, validateRequestParams } = require('../../../shared/utils/validators');
const {
  getRoutesSchema,
  routeIdSchema,
  destinationCodeSchema,
  locationCodeSchema,
  searchRoutesByLocationSchema,
  getAllRoutesSchema
} = require('../validators/transferRouteValidators');

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'Transfer Route Service is running' });
});

// Get routes
router.get('/', 
  requireAuth,
  requirePermissionMiddleware('transfers', 'read'),
  validateRequestQuery(getRoutesSchema),
  transferRouteController.getRoutes
);

// Get all routes
router.get('/all', 
  requireAuth,
  requirePermissionMiddleware('transfers', 'read'),
  validateRequestQuery(getAllRoutesSchema),
  transferRouteController.getAllRoutes
);

// Get route by ID
router.get('/:routeId', 
  requireAuth,
  requirePermissionMiddleware('transfers', 'read'),
  validateRequestParams(routeIdSchema),
  transferRouteController.getRouteById
);

// Get routes by destination
router.get('/destination/:destinationCode', 
  requireAuth,
  requirePermissionMiddleware('transfers', 'read'),
  validateRequestParams(destinationCodeSchema),
  validateRequestQuery(getAllRoutesSchema),
  transferRouteController.getRoutesByDestination
);

// Search routes by location
router.get('/location/:locationCode', 
  requireAuth,
  requirePermissionMiddleware('transfers', 'read'),
  validateRequestParams(locationCodeSchema),
  validateRequestQuery(searchRoutesByLocationSchema),
  transferRouteController.searchRoutesByLocation
);

// Update route timestamp
router.patch('/:routeId/timestamp', 
  requireAuth,
  requirePermissionMiddleware('transfers', 'update'),
  validateRequestParams(routeIdSchema),
  transferRouteController.updateRouteTimestamp
);

// Delete route
router.delete('/:routeId', 
  requireAuth,
  requirePermissionMiddleware('transfers', 'delete'),
  validateRequestParams(routeIdSchema),
  transferRouteController.deleteRoute
);

module.exports = router;
