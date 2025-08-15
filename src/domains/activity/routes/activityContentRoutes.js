const express = require('express');
const router = express.Router();

const activityContentController = require('../controllers/activityContentController');
const { requirePermissionMiddleware } = require('../../auth/middleware/authorization');
const { requireAuth } = require('../../auth/middleware/auth');
const { validateRequestQuery, validateRequestBody } = require('../../../shared/utils/validators');
const activityContentValidators = require('../validators/activityContentValidators');

// Apply authentication to all routes
router.use(requireAuth);

// Content management routes (CRUD operations)
router.post('/',
  requirePermissionMiddleware('activity', 'create'),
  validateRequestBody(activityContentValidators.createActivityContentSchema),
  activityContentController.createActivityContent
);

router.get('/:activityCode',
  requirePermissionMiddleware('activity', 'read'),
  validateRequestQuery(activityContentValidators.getActivityContentSchema),
  activityContentController.getActivityContentByCode
);

router.get('/',
  requirePermissionMiddleware('activity', 'read'),
  validateRequestQuery(activityContentValidators.getAllActivityContentSchema),
  activityContentController.getAllActivityContent
);

router.put('/:activityCode',
  requirePermissionMiddleware('activity', 'update'),
  validateRequestBody(activityContentValidators.updateActivityContentSchema),
  activityContentController.updateActivityContent
);

router.delete('/:activityCode',
  requirePermissionMiddleware('activity', 'delete'),
  activityContentController.deleteActivityContent
);

router.get('/search',
  requirePermissionMiddleware('activity', 'read'),
  validateRequestQuery(activityContentValidators.searchActivityContentSchema),
  activityContentController.searchActivityContent
);

// HotelBeds integration routes
router.post('/fetch-from-hotelbeds',
  requirePermissionMiddleware('activity', 'create'),
  validateRequestBody(activityContentValidators.fetchActivityContentSchema),
  activityContentController.fetchActivityContentFromHotelBeds
);

router.get('/portfolio/:destination',
  requirePermissionMiddleware('activity', 'read'),
  validateRequestQuery(activityContentValidators.getPortfolioDataSchema),
  activityContentController.getPortfolioData
);

router.get('/portfolio-availability/:destination',
  requirePermissionMiddleware('activity', 'read'),
  validateRequestQuery(activityContentValidators.getPortfolioAvailabilitySchema),
  activityContentController.getPortfolioAvailability
);

module.exports = router;
