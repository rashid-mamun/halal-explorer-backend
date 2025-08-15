const express = require('express');
const router = express.Router();
const insuranceConfigController = require('../controllers/insuranceConfigController');
const { requireAuth } = require('../../auth/middleware/auth');
const { requirePermissionMiddleware } = require('../../auth/middleware/authorization');
const { validateRequestBody } = require('../../../shared/utils/validators');
const {
  travellerTypeValidator,
  policyTypeValidator,
  areaValidator,
  restTypeValidator,
  productNameValidator,
  ageGroupValidator,
  countryValidator,
  durationValidator
} = require('../validators/insuranceConfigValidators');

// Get all configuration data
router.get('/', 
  requireAuth, 
  requirePermissionMiddleware('insurance:read'),
  insuranceConfigController.getAllConfig
);

// Get specific configuration section
router.get('/:section', 
  requireAuth, 
  requirePermissionMiddleware('insurance:read'),
  insuranceConfigController.getConfigSection
);

// Add traveller type
router.post('/traveller-types', 
  requireAuth, 
  requirePermissionMiddleware('insurance:create'),
  validateRequestBody(travellerTypeValidator),
  insuranceConfigController.addTravellerType
);

// Add policy type
router.post('/policy-types', 
  requireAuth, 
  requirePermissionMiddleware('insurance:create'),
  validateRequestBody(policyTypeValidator),
  insuranceConfigController.addPolicyType
);

// Add area
router.post('/areas', 
  requireAuth, 
  requirePermissionMiddleware('insurance:create'),
  validateRequestBody(areaValidator),
  insuranceConfigController.addArea
);

// Add rest type
router.post('/rest-types', 
  requireAuth, 
  requirePermissionMiddleware('insurance:create'),
  validateRequestBody(restTypeValidator),
  insuranceConfigController.addRestType
);

// Add product name
router.post('/product-names', 
  requireAuth, 
  requirePermissionMiddleware('insurance:create'),
  validateRequestBody(productNameValidator),
  insuranceConfigController.addProductName
);

// Add age group
router.post('/age-groups', 
  requireAuth, 
  requirePermissionMiddleware('insurance:create'),
  validateRequestBody(ageGroupValidator),
  insuranceConfigController.addAgeGroup
);

// Add country
router.post('/countries', 
  requireAuth, 
  requirePermissionMiddleware('insurance:create'),
  validateRequestBody(countryValidator),
  insuranceConfigController.addCountry
);

// Add duration
router.post('/durations', 
  requireAuth, 
  requirePermissionMiddleware('insurance:create'),
  validateRequestBody(durationValidator),
  insuranceConfigController.addDuration
);

module.exports = router;
