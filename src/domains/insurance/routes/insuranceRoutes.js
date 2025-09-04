const express = require('express');
const router = express.Router();
const insuranceController = require('../controllers/insuranceController');
const { requireAuth } = require('../../auth/middleware/auth');
const { requirePermissionMiddleware } = require('../../auth/middleware/authorization');
const { validateRequestBody, validateRequestQuery } = require('../../../shared/utils/validators');
const {
  createInsuranceValidator,
  updateInsuranceValidator,
  searchInsuranceValidator
} = require('../validators/insuranceValidators');

// Get all insurance policies
router.get('/', 
  requireAuth, 
  requirePermissionMiddleware('insurance:read'),
  insuranceController.getAllInsurances
);

// Search insurance policies
router.get('/search', 
  requireAuth, 
  requirePermissionMiddleware('insurance:read'),
  validateRequestQuery(searchInsuranceValidator),
  insuranceController.searchInsurances
);

// Get insurance policy by ID
router.get('/:id', 
  requireAuth, 
  requirePermissionMiddleware('insurance:read'),
  insuranceController.getInsuranceById
);

// Create new insurance policy
router.post('/', 
  requireAuth, 
  requirePermissionMiddleware('insurance:create'),
  validateRequestBody(createInsuranceValidator),
  insuranceController.createInsurance
);

// Update insurance policy
router.put('/:id', 
  requireAuth, 
  requirePermissionMiddleware('insurance:update'),
  validateRequestBody(updateInsuranceValidator),
  insuranceController.updateInsurance
);

// Delete insurance policy
router.delete('/:id', 
  requireAuth, 
  requirePermissionMiddleware('insurance:delete'),
  insuranceController.deleteInsurance
);

module.exports = router;
