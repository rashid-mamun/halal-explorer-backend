const express = require('express');
const router = express.Router();

const transferAvailabilityController = require('../controllers/transferAvailabilityController');
const { requireAuth } = require('../../../domains/auth/middleware/auth');
const { requirePermissionMiddleware } = require('../../../domains/auth/middleware/authorization');
const { validateRequestBody, validateRequestQuery, validateRequestParams } = require('../../../shared/utils/validators');
const {
  checkAvailabilitySchema,
  requestIdSchema,
  getAllAvailabilityRequestsSchema
} = require('../validators/transferAvailabilityValidators');

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'Transfer Availability Service is running' });
});

// Check availability
router.post('/check', 
  requireAuth,
  requirePermissionMiddleware('transfers', 'create'),
  validateRequestBody(checkAvailabilitySchema),
  transferAvailabilityController.checkAvailability
);

// Get all availability requests
router.get('/', 
  requireAuth,
  requirePermissionMiddleware('transfers', 'read'),
  validateRequestQuery(getAllAvailabilityRequestsSchema),
  transferAvailabilityController.getAllAvailabilityRequests
);

// Get availability request by ID
router.get('/:requestId', 
  requireAuth,
  requirePermissionMiddleware('transfers', 'read'),
  validateRequestParams(requestIdSchema),
  transferAvailabilityController.getAvailabilityRequest
);

// Get availability statistics
router.get('/stats/statistics', 
  requireAuth,
  requirePermissionMiddleware('transfers', 'read'),
  transferAvailabilityController.getAvailabilityStatistics
);

// Delete availability request
router.delete('/:requestId', 
  requireAuth,
  requirePermissionMiddleware('transfers', 'delete'),
  validateRequestParams(requestIdSchema),
  transferAvailabilityController.deleteAvailabilityRequest
);

module.exports = router;
