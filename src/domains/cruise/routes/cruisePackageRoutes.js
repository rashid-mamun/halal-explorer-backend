const express = require('express');
const router = express.Router();
const cruisePackageController = require('../controllers/cruisePackageController');
const { requireAuth } = require('../../auth/middleware/auth');
const { requirePermissionMiddleware } = require('../../auth/middleware/authorization');
const { validateRequestBody, validateRequestQuery } = require('../../../shared/utils/validators');
const {
  createCruisePackageValidator,
  updateCruisePackageValidator,
  searchCruisePackageValidator
} = require('../validators/cruisePackageValidators');

// Get all cruise packages
router.get('/', 
  requireAuth, 
  requirePermissionMiddleware('cruise:read'),
  cruisePackageController.getAllCruisePackages
);

// Search cruise packages
router.get('/search', 
  requireAuth, 
  requirePermissionMiddleware('cruise:read'),
  validateRequestQuery(searchCruisePackageValidator),
  cruisePackageController.searchCruisePackages
);

// Get cruise package by ID
router.get('/:id', 
  requireAuth, 
  requirePermissionMiddleware('cruise:read'),
  cruisePackageController.getCruisePackageById
);

// Create new cruise package (Admin only)
router.post('/', 
  requireAuth, 
  requirePermissionMiddleware('cruise:create'),
  validateRequestBody(createCruisePackageValidator),
  cruisePackageController.createCruisePackage
);

// Update cruise package (Admin only)
router.put('/:id', 
  requireAuth, 
  requirePermissionMiddleware('cruise:update'),
  validateRequestBody(updateCruisePackageValidator),
  cruisePackageController.updateCruisePackage
);

// Delete cruise package (Admin only)
router.delete('/:id', 
  requireAuth, 
  requirePermissionMiddleware('cruise:delete'),
  cruisePackageController.deleteCruisePackage
);

module.exports = router;
