const express = require('express');
const router = express.Router();

const transferMasterDataController = require('../controllers/transferMasterDataController');
const { requireAuth } = require('../../../domains/auth/middleware/auth');
const { requirePermissionMiddleware } = require('../../../domains/auth/middleware/authorization');
const { validateRequestQuery, validateRequestParams } = require('../../../shared/utils/validators');
const {
  getCategoriesSchema,
  getVehiclesSchema,
  getTransferTypesSchema,
  getCurrenciesSchema,
  searchMasterDataSchema,
  masterDataTypeSchema
} = require('../validators/transferMasterDataValidators');

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'Transfer Master Data Service is running' });
});

// Get categories
router.get('/categories', 
  requireAuth,
  requirePermissionMiddleware('transfers', 'read'),
  validateRequestQuery(getCategoriesSchema),
  transferMasterDataController.getCategories
);

// Get vehicles
router.get('/vehicles', 
  requireAuth,
  requirePermissionMiddleware('transfers', 'read'),
  validateRequestQuery(getVehiclesSchema),
  transferMasterDataController.getVehicles
);

// Get transfer types
router.get('/transfer-types', 
  requireAuth,
  requirePermissionMiddleware('transfers', 'read'),
  validateRequestQuery(getTransferTypesSchema),
  transferMasterDataController.getTransferTypes
);

// Get currencies
router.get('/currencies', 
  requireAuth,
  requirePermissionMiddleware('transfers', 'read'),
  validateRequestQuery(getCurrenciesSchema),
  transferMasterDataController.getCurrencies
);

// Get all master data
router.get('/all', 
  requireAuth,
  requirePermissionMiddleware('transfers', 'read'),
  transferMasterDataController.getAllMasterData
);

// Get master data by type
router.get('/type/:type', 
  requireAuth,
  requirePermissionMiddleware('transfers', 'read'),
  validateRequestParams(masterDataTypeSchema),
  transferMasterDataController.getMasterDataByType
);

// Search master data
router.get('/search', 
  requireAuth,
  requirePermissionMiddleware('transfers', 'read'),
  validateRequestQuery(searchMasterDataSchema),
  transferMasterDataController.searchMasterData
);

module.exports = router;
