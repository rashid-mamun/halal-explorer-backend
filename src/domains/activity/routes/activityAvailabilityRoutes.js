const express = require('express');
const router = express.Router();

const activityAvailabilityController = require('../controllers/activityAvailabilityController');
const { requirePermissionMiddleware } = require('../../auth/middleware/authorization');
const { requireAuth } = require('../../auth/middleware/auth');
const { validateRequestQuery, validateRequestBody } = require('../../../shared/utils/validators');
const activityAvailabilityValidators = require('../validators/activityAvailabilityValidators');

// Apply authentication to all routes
router.use(requireAuth);

// Activity search and availability routes
router.get('/search',
  requirePermissionMiddleware('activity', 'read'),
  validateRequestQuery(activityAvailabilityValidators.searchActivitiesSchema),
  activityAvailabilityController.searchActivities
);

router.get('/search/filter',
  requirePermissionMiddleware('activity', 'read'),
  validateRequestQuery(activityAvailabilityValidators.searchFilterActivitiesSchema),
  activityAvailabilityController.searchFilterActivities
);

router.get('/search-details',
  requirePermissionMiddleware('activity', 'read'),
  validateRequestQuery(activityAvailabilityValidators.searchActivitiesDetailsSchema),
  activityAvailabilityController.searchActivitiesDetails
);

// Availability request management routes
router.get('/requests/:requestId',
  requirePermissionMiddleware('activity', 'read'),
  activityAvailabilityController.getAvailabilityRequestById
);

router.get('/requests',
  requirePermissionMiddleware('activity', 'read'),
  validateRequestQuery(activityAvailabilityValidators.getAllAvailabilityRequestsSchema),
  activityAvailabilityController.getAllAvailabilityRequests
);

router.put('/requests/:requestId/status',
  requirePermissionMiddleware('activity', 'update'),
  validateRequestBody(activityAvailabilityValidators.updateAvailabilityRequestStatusSchema),
  activityAvailabilityController.updateAvailabilityRequestStatus
);

router.delete('/requests/:requestId',
  requirePermissionMiddleware('activity', 'delete'),
  activityAvailabilityController.deleteAvailabilityRequest
);

module.exports = router;
