const express = require('express');
const router = express.Router();
const holidayPackageController = require('../controllers/holidayPackageController');
const { requireAuth } = require('../../auth/middleware/auth');
const { requirePermissionMiddleware } = require('../../auth/middleware/authorization');
const { validateRequestBody, validateRequestQuery } = require('../../../shared/utils/validators');
const {
  createHolidayPackageValidator,
  updateHolidayPackageValidator,
  searchHolidayPackageValidator
} = require('../validators/holidayPackageValidators');

// Get all holiday packages
router.get('/', 
  requireAuth, 
  requirePermissionMiddleware('holiday:read'),
  holidayPackageController.getAllHolidayPackages
);

// Search holiday packages
router.get('/search', 
  requireAuth, 
  requirePermissionMiddleware('holiday:read'),
  validateRequestQuery(searchHolidayPackageValidator),
  holidayPackageController.searchHolidayPackages
);

// Get holiday package by ID
router.get('/:id', 
  requireAuth, 
  requirePermissionMiddleware('holiday:read'),
  holidayPackageController.getHolidayPackageById
);

// Create new holiday package (Admin only)
router.post('/', 
  requireAuth, 
  requirePermissionMiddleware('holiday:create'),
  validateRequestBody(createHolidayPackageValidator),
  holidayPackageController.createHolidayPackage
);

// Update holiday package (Admin only)
router.put('/:id', 
  requireAuth, 
  requirePermissionMiddleware('holiday:update'),
  validateRequestBody(updateHolidayPackageValidator),
  holidayPackageController.updateHolidayPackage
);

// Delete holiday package (Admin only)
router.delete('/:id', 
  requireAuth, 
  requirePermissionMiddleware('holiday:delete'),
  holidayPackageController.deleteHolidayPackage
);

module.exports = router;
