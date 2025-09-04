const express = require('express');
const router = express.Router();

const halalActivityRatingController = require('../controllers/halalActivityRatingController');
const { requirePermissionMiddleware } = require('../../auth/middleware/authorization');
const { requireAuth } = require('../../auth/middleware/auth');
const { validateRequestQuery, validateRequestBody } = require('../../../shared/utils/validators');
const halalActivityRatingValidators = require('../validators/halalActivityRatingValidators');

// Apply authentication to all routes
router.use(requireAuth);

// Halal activity rating management routes (CRUD operations)
router.post('/',
  requirePermissionMiddleware('activity', 'create'),
  validateRequestBody(halalActivityRatingValidators.createHalalActivityRatingSchema),
  halalActivityRatingController.createHalalActivityRating
);

router.get('/:code',
  requirePermissionMiddleware('activity', 'read'),
  halalActivityRatingController.getHalalActivityRatingByCode
);

router.get('/',
  requirePermissionMiddleware('activity', 'read'),
  validateRequestQuery(halalActivityRatingValidators.getAllHalalActivityRatingsSchema),
  halalActivityRatingController.getAllHalalActivityRatings
);

router.put('/:code',
  requirePermissionMiddleware('activity', 'update'),
  validateRequestBody(halalActivityRatingValidators.updateHalalActivityRatingSchema),
  halalActivityRatingController.updateHalalActivityRating
);

router.delete('/:code',
  requirePermissionMiddleware('activity', 'delete'),
  halalActivityRatingController.deleteHalalActivityRating
);

router.get('/search',
  requirePermissionMiddleware('activity', 'read'),
  validateRequestQuery(halalActivityRatingValidators.searchHalalActivityRatingsSchema),
  halalActivityRatingController.searchHalalActivityRatings
);

// Rating structure management routes
router.post('/structure',
  requirePermissionMiddleware('activity', 'create'),
  validateRequestBody(halalActivityRatingValidators.createRatingStructureSchema),
  halalActivityRatingController.createRatingStructure
);

router.get('/structure',
  requirePermissionMiddleware('activity', 'read'),
  halalActivityRatingController.getRatingStructure
);

router.put('/structure',
  requirePermissionMiddleware('activity', 'update'),
  validateRequestBody(halalActivityRatingValidators.updateRatingStructureSchema),
  halalActivityRatingController.updateRatingStructure
);

router.delete('/structure',
  requirePermissionMiddleware('activity', 'delete'),
  halalActivityRatingController.deleteRatingStructure
);

// Statistics route
router.get('/statistics',
  requirePermissionMiddleware('activity', 'read'),
  halalActivityRatingController.getRatingStatistics
);

module.exports = router;
