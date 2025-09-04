const express = require('express');
const router = express.Router();
const insuranceBookingController = require('../controllers/insuranceBookingController');
const { requireAuth } = require('../../auth/middleware/auth');
const { requirePermissionMiddleware } = require('../../auth/middleware/authorization');
const { validateRequestBody, validateRequestQuery } = require('../../../shared/utils/validators');
const {
  createBookingValidator,
  updateBookingValidator,
  searchBookingValidator
} = require('../validators/insuranceBookingValidators');

// Get all bookings (admin/manager only)
router.get('/', 
  requireAuth, 
  requirePermissionMiddleware('insurance:read'),
  insuranceBookingController.getAllBookings
);

// Search bookings
router.get('/search', 
  requireAuth, 
  requirePermissionMiddleware('insurance:read'),
  validateRequestQuery(searchBookingValidator),
  insuranceBookingController.searchBookings
);

// Get booking by ID
router.get('/:id', 
  requireAuth, 
  requirePermissionMiddleware('insurance:read'),
  insuranceBookingController.getBookingById
);

// Get bookings by email
router.get('/email/:email', 
  requireAuth, 
  requirePermissionMiddleware('insurance:read'),
  insuranceBookingController.getBookingsByEmail
);

// Get booking by partner order ID
router.get('/order/:partnerOrderId', 
  requireAuth, 
  requirePermissionMiddleware('insurance:read'),
  insuranceBookingController.getBookingByPartnerOrderId
);

// Create new booking
router.post('/', 
  requireAuth, 
  requirePermissionMiddleware('insurance:create'),
  validateRequestBody(createBookingValidator),
  insuranceBookingController.createBooking
);

// Update booking
router.put('/:id', 
  requireAuth, 
  requirePermissionMiddleware('insurance:update'),
  validateRequestBody(updateBookingValidator),
  insuranceBookingController.updateBooking
);

// Delete booking
router.delete('/:id', 
  requireAuth, 
  requirePermissionMiddleware('insurance:delete'),
  insuranceBookingController.deleteBooking
);

module.exports = router;
