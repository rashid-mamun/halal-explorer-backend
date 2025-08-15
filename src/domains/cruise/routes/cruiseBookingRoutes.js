const express = require('express');
const router = express.Router();
const cruiseBookingController = require('../controllers/cruiseBookingController');
const { requireAuth } = require('../../auth/middleware/auth');
const { requirePermissionMiddleware } = require('../../auth/middleware/authorization');
const { validateRequestBody, validateRequestQuery } = require('../../../shared/utils/validators');
const {
  createCruiseBookingValidator,
  updateCruiseBookingValidator,
  searchCruiseBookingValidator
} = require('../validators/cruiseBookingValidators');

// Create new cruise booking
router.post('/', 
  requireAuth, 
  requirePermissionMiddleware('cruise:create'),
  validateRequestBody(createCruiseBookingValidator),
  cruiseBookingController.createBooking
);

// Get all bookings (Admin/Manager only)
router.get('/all', 
  requireAuth, 
  requirePermissionMiddleware('cruise:read'),
  cruiseBookingController.getAllBookings
);

// Search bookings
router.get('/search', 
  requireAuth, 
  requirePermissionMiddleware('cruise:read'),
  validateRequestQuery(searchCruiseBookingValidator),
  cruiseBookingController.searchBookings
);

// Get booking by ID
router.get('/id/:bookingId', 
  requireAuth, 
  requirePermissionMiddleware('cruise:read'),
  cruiseBookingController.getBookingById
);

// Get booking by partner order ID
router.get('/order/:partnerOrderId', 
  requireAuth, 
  requirePermissionMiddleware('cruise:read'),
  cruiseBookingController.getBookingByPartnerOrderId
);

// Get bookings by email
router.get('/email/:email', 
  requireAuth, 
  requirePermissionMiddleware('cruise:read'),
  cruiseBookingController.getBookingsByEmail
);

// Update booking
router.put('/:bookingId', 
  requireAuth, 
  requirePermissionMiddleware('cruise:update'),
  validateRequestBody(updateCruiseBookingValidator),
  cruiseBookingController.updateBooking
);

// Delete booking (Admin only)
router.delete('/:bookingId', 
  requireAuth, 
  requirePermissionMiddleware('cruise:delete'),
  cruiseBookingController.deleteBooking
);

module.exports = router;
