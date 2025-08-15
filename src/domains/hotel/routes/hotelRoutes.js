const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotelController');
const { 
  requireResourcePermissionMiddleware,
  requireRoleMiddleware
} = require('../../auth/middleware/authorization');
const { validateRequestQuery, validateRequestBody } = require('../../../shared/utils/validators');
const {
  hotelSearchSchema,
  hotelSearchFilterSchema,
  hotelSearchDetailsSchema,
  hotelBookSchema,
  hotelByIdSchema
} = require('../validators/hotelValidators');

// Health check route
router.get('/health', async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Hotel API running',
    timestamp: new Date().toISOString()
  });
});

// Hotel search - Read permission required
router.get('/search', 
  requireResourcePermissionMiddleware('hotel', 'read'),
  validateRequestQuery(hotelSearchSchema),
  hotelController.hotelSearch
);

// Hotel search with filters - Read permission required
router.get('/search/filter', 
  requireResourcePermissionMiddleware('hotel', 'read'),
  validateRequestQuery(hotelSearchFilterSchema),
  hotelController.hotelSearchFilter
);

// Hotel search details - Read permission required
router.get('/search-details', 
  requireResourcePermissionMiddleware('hotel', 'read'),
  validateRequestQuery(hotelSearchDetailsSchema),
  hotelController.hotelSearchDetails
);

// Hotel booking - Create permission required
router.post('/book', 
  requireResourcePermissionMiddleware('hotel', 'create'),
  validateRequestBody(hotelBookSchema),
  hotelController.hotelBook
);

// Get all bookings - Admin/Manager only
router.get('/book/all', 
  requireRoleMiddleware(['admin', 'manager']),
  hotelController.getAllBookings
);

// Get bookings by email - User can access their own bookings or admin/manager
router.get('/book/:email', 
  requireResourcePermissionMiddleware('hotel', 'read'),
  hotelController.getBookingsByEmail
);

// Get hotel by ID - Read permission required
router.get('/hotel', 
  requireResourcePermissionMiddleware('hotel', 'read'),
  validateRequestQuery(hotelByIdSchema),
  hotelController.getHotelById
);

module.exports = router;
