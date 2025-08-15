const express = require('express');
const router = express.Router();
const cruiseMasterDataController = require('../controllers/cruiseMasterDataController');
const { requireAuth } = require('../../auth/middleware/auth');
const { requirePermissionMiddleware } = require('../../auth/middleware/authorization');
const { validateRequestBody } = require('../../../shared/utils/validators');
const {
  addCruiseLineValidator,
  updateCruiseLineValidator,
  addShipValidator,
  updateShipValidator
} = require('../validators/cruiseMasterDataValidators');

// Cruise Lines Management
// Get all cruise lines
router.get('/cruiselines', 
  requireAuth, 
  requirePermissionMiddleware('cruise:read'),
  cruiseMasterDataController.getAllCruiseLines
);

// Add new cruise line (Admin only)
router.post('/cruiselines', 
  requireAuth, 
  requirePermissionMiddleware('cruise:create'),
  validateRequestBody(addCruiseLineValidator),
  cruiseMasterDataController.addCruiseLine
);

// Update cruise line (Admin only)
router.put('/cruiselines/:cruiseLineName', 
  requireAuth, 
  requirePermissionMiddleware('cruise:update'),
  validateRequestBody(updateCruiseLineValidator),
  cruiseMasterDataController.updateCruiseLine
);

// Delete cruise line (Admin only)
router.delete('/cruiselines/:cruiseLineName', 
  requireAuth, 
  requirePermissionMiddleware('cruise:delete'),
  cruiseMasterDataController.deleteCruiseLine
);

// Ships Management
// Get all ships
router.get('/ships', 
  requireAuth, 
  requirePermissionMiddleware('cruise:read'),
  cruiseMasterDataController.getAllShips
);

// Get ships by cruise line
router.get('/ships/:cruiseLine', 
  requireAuth, 
  requirePermissionMiddleware('cruise:read'),
  cruiseMasterDataController.getShipsByCruiseLine
);

// Add new ship (Admin only)
router.post('/ships', 
  requireAuth, 
  requirePermissionMiddleware('cruise:create'),
  validateRequestBody(addShipValidator),
  cruiseMasterDataController.addShip
);

// Update ship (Admin only)
router.put('/ships/:shipName/:cruiseLine', 
  requireAuth, 
  requirePermissionMiddleware('cruise:update'),
  validateRequestBody(updateShipValidator),
  cruiseMasterDataController.updateShip
);

// Delete ship (Admin only)
router.delete('/ships/:shipName/:cruiseLine', 
  requireAuth, 
  requirePermissionMiddleware('cruise:delete'),
  cruiseMasterDataController.deleteShip
);

module.exports = router;
