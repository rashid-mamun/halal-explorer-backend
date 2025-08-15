const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../auth/middleware/auth');
const { requireResourcePermissionMiddleware } = require('../../auth/middleware/authorization');
const { validateRequestBody, validateRequestQuery } = require('../../../shared/utils/validators');
const {
  hotelSearchSchema,
  hotelSearchFilterSchema,
  hotelSearchDetailsSchema,
  hotelBookSchema
} = require('../validators/hotelValidators');
const apiController = require('../controllers');

router.get('/api', async (req, res) => {
  res.status(200).json({
    message: 'Hotel API running',
  });
});

// Public routes
router.get('/search', validateRequestQuery(hotelSearchSchema), apiController.hotelSearch);
router.get('/search/filter', validateRequestQuery(hotelSearchFilterSchema), apiController.hotelSearchFilter);
router.get('/search-details', validateRequestQuery(hotelSearchDetailsSchema), apiController.hotelSearchDetails);
router.get('/dumb', apiController.dumbHotelById);

// Protected routes
router.post('/book', 
  requireAuth, 
  requireResourcePermissionMiddleware('hotel', 'create'),
  validateRequestBody(hotelBookSchema),
  apiController.hotelBook
);
router.get('/book/all', 
  requireAuth, 
  requireResourcePermissionMiddleware('hotel', 'read'),
  apiController.getAllBookings
);
router.get('/book/:email', 
  requireAuth, 
  requireResourcePermissionMiddleware('hotel', 'read'),
  apiController.getBookingsByEmail
);

module.exports = router;
