const express = require('express');
const router = express.Router();
const holidayBookingController = require('../controllers/holidayBookingController');
const { requireAuth } = require('../../auth/middleware/auth');
const { requirePermissionMiddleware } = require('../../auth/middleware/authorization');
const { validateRequestBody, validateRequestQuery } = require('../../../shared/utils/validators');
const {
  createHolidayBookingValidator,
  updateHolidayBookingValidator,
  searchHolidayBookingValidator
} = require('../validators/holidayBookingValidators');

// Create new holiday booking
router.post('/', 
  requireAuth, 
  requirePermissionMiddleware('holiday:create'),
  validateRequestBody(createHolidayBookingValidator),
  holidayBookingController.createBooking
);

// Get all bookings (Admin/Manager only)
router.get('/all', 
  requireAuth, 
  requirePermissionMiddleware('holiday:read'),
  holidayBookingController.getAllBookings
);

// Search bookings
router.get('/search', 
  requireAuth, 
  requirePermissionMiddleware('holiday:read'),
  validateRequestQuery(searchHolidayBookingValidator),
  holidayBookingController.searchBookings
);

// Get booking by ID
router.get('/id', 
  requireAuth, 
  requirePermissionMiddleware('holiday:read'),
  holidayBookingController.getBookingById
);

// Get booking by partner order ID
router.get('/order/:partnerOrderId', 
  requireAuth, 
  requirePermissionMiddleware('holiday:read'),
  holidayBookingController.getBookingByPartnerOrderId
);

// Get bookings by email
router.get('/email/:email', 
  requireAuth, 
  requirePermissionMiddleware('holiday:read'),
  holidayBookingController.getBookingsByEmail
);

// Update booking
router.put('/:bookingId', 
  requireAuth, 
  requirePermissionMiddleware('holiday:update'),
  validateRequestBody(updateHolidayBookingValidator),
  holidayBookingController.updateBooking
);

// Delete booking (Admin only)
router.delete('/:bookingId', 
  requireAuth, 
  requirePermissionMiddleware('holiday:delete'),
  holidayBookingController.deleteBooking
);

module.exports = router;
