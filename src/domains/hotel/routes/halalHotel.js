const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../auth/middleware/auth');
const { requireResourcePermissionMiddleware } = require('../../auth/middleware/authorization');
const { validateRequestBody } = require('../../../shared/utils/validators');
const {
  halalRatingSchema,
  halalRatingStructureSchema
} = require('../validators/hotelValidators');
const apiController = require('../controllers');

router.get('/api', async (req, res) => {
  res.status(200).json({
    message: 'Halal hotel API running',
  });
});

// Public routes
router.get('/search', apiController.halalSearch);
router.get('/all-hotels', apiController.getAllHalalHotel);
router.get('/hotel', apiController.getHalalHotel);
router.get('/structure', apiController.getHalalRatingStructure);

// Protected routes
router.post('/rating', 
  requireAuth, 
  requireResourcePermissionMiddleware('hotel', 'create'),
  validateRequestBody(halalRatingSchema),
  apiController.rateHotel
);
router.post('/structure', 
  requireAuth, 
  requireResourcePermissionMiddleware('hotel', 'create'),
  validateRequestBody(halalRatingStructureSchema),
  apiController.halalRatingStructure
);

module.exports = router;
