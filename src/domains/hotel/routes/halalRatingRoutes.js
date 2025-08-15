const express = require('express');
const router = express.Router();
const halalRatingController = require('../controllers/halalRatingController');
const {
  requireResourcePermissionMiddleware,
  requireRoleMiddleware
} = require('../../auth/middleware/authorization');
const { validateRequestQuery, validateRequestBody } = require('../../../shared/utils/validators');
const {
  halalRatingSchema,
  halalRatingStructureSchema,
  getHalalHotelSchema
} = require('../validators/hotelValidators');

// Health check route
router.get('/health', async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Halal Rating API running',
    timestamp: new Date().toISOString()
  });
});

// Halal hotel search - Read permission required
router.get('/search', 
  requireResourcePermissionMiddleware('hotel', 'read'),
  halalRatingController.halalSearch
);

// Rate hotel - Create permission required
router.post('/rating', 
  requireResourcePermissionMiddleware('hotel', 'create'),
  validateRequestBody(halalRatingSchema),
  halalRatingController.rateHotel
);

// Get all halal hotels - Read permission required
router.get('/all-hotels', 
  requireResourcePermissionMiddleware('hotel', 'read'),
  halalRatingController.getAllHalalHotel
);

// Get specific halal hotel - Read permission required
router.get('/hotel', 
  requireResourcePermissionMiddleware('hotel', 'read'),
  validateRequestQuery(getHalalHotelSchema),
  halalRatingController.getHalalHotel
);

// Create halal rating structure - Admin/Manager only
router.post('/structure', 
  requireRoleMiddleware(['admin', 'manager']),
  requireResourcePermissionMiddleware('hotel', 'create'),
  validateRequestBody(halalRatingStructureSchema),
  halalRatingController.halalRatingStructure
);

// Get halal rating structure - Read permission required
router.get('/structure', 
  requireResourcePermissionMiddleware('hotel', 'read'),
  halalRatingController.getHalalRatingStructure
);

module.exports = router;
