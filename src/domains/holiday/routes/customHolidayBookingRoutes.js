const express = require('express');
const router = express.Router();
const customHolidayBookingController = require('../controllers/customHolidayBookingController');
const { requireAuth } = require('../../auth/middleware/auth');
const { requirePermissionMiddleware } = require('../../auth/middleware/authorization');
const { validateRequestBody, validateRequestQuery } = require('../../../shared/utils/validators');
const {
  createCustomHolidayBookingValidator,
  updateCustomHolidayBookingValidator,
  searchCustomHolidayBookingValidator
} = require('../validators/customHolidayBookingValidators');

// Create new custom holiday booking
router.post('/', 
  requireAuth, 
  requirePermissionMiddleware('holiday:create'),
  validateRequestBody(createCustomHolidayBookingValidator),
  customHolidayBookingController.createCustomBooking
);

// Get all custom bookings (Admin/Manager only)
router.get('/all', 
  requireAuth, 
  requirePermissionMiddleware('holiday:read'),
  customHolidayBookingController.getAllCustomBookings
);

// Search custom bookings
router.get('/search', 
  requireAuth, 
  requirePermissionMiddleware('holiday:read'),
  validateRequestQuery(searchCustomHolidayBookingValidator),
  customHolidayBookingController.searchCustomBookings
);

// Get custom booking by ID
router.get('/id', 
  requireAuth, 
  requirePermissionMiddleware('holiday:read'),
  customHolidayBookingController.getCustomBookingById
);

// Get custom booking by partner order ID
router.get('/order/:partnerOrderId', 
  requireAuth, 
  requirePermissionMiddleware('holiday:read'),
  customHolidayBookingController.getCustomBookingByPartnerOrderId
);

// Get custom bookings by email
router.get('/email/:email', 
  requireAuth, 
  requirePermissionMiddleware('holiday:read'),
  customHolidayBookingController.getCustomBookingsByEmail
);

// Update custom booking
router.put('/:bookingId', 
  requireAuth, 
  requirePermissionMiddleware('holiday:update'),
  validateRequestBody(updateCustomHolidayBookingValidator),
  customHolidayBookingController.updateCustomBooking
);

// Delete custom booking (Admin only)
router.delete('/:bookingId', 
  requireAuth, 
  requirePermissionMiddleware('holiday:delete'),
  customHolidayBookingController.deleteCustomBooking
);

module.exports = router;
