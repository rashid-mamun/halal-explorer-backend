const express = require('express');
const router = express.Router();

const transferBookingController = require('../controllers/transferBookingController');
const { requireAuth } = require('../../../domains/auth/middleware/auth');
const { requirePermissionMiddleware } = require('../../../domains/auth/middleware/authorization');
const { validateRequestBody, validateRequestQuery, validateRequestParams } = require('../../../shared/utils/validators');
const {
  createBookingSchema,
  bookingIdSchema,
  hotelBedsReferenceSchema,
  emailSchema,
  getAllBookingsSchema,
  getBookingsByEmailSchema,
  updateBookingStatusSchema
} = require('../validators/transferBookingValidators');

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'Transfer Booking Service is running' });
});

// Create booking
router.post('/', 
  requireAuth,
  requirePermissionMiddleware('transfers', 'create'),
  validateRequestBody(createBookingSchema),
  transferBookingController.createBooking
);

// Get all bookings
router.get('/', 
  requireAuth,
  requirePermissionMiddleware('transfers', 'read'),
  validateRequestQuery(getAllBookingsSchema),
  transferBookingController.getAllBookings
);

// Get booking by ID
router.get('/:bookingId', 
  requireAuth,
  requirePermissionMiddleware('transfers', 'read'),
  validateRequestParams(bookingIdSchema),
  transferBookingController.getBookingById
);

// Get booking by HotelBeds reference
router.get('/reference/:hotelBedsReference', 
  requireAuth,
  requirePermissionMiddleware('transfers', 'read'),
  validateRequestParams(hotelBedsReferenceSchema),
  transferBookingController.getBookingByHotelBedsReference
);

// Get bookings by customer email
router.get('/customer/:email', 
  requireAuth,
  requirePermissionMiddleware('transfers', 'read'),
  validateRequestParams(emailSchema),
  validateRequestQuery(getBookingsByEmailSchema),
  transferBookingController.getBookingsByEmail
);

// Update booking status
router.patch('/:bookingId/status', 
  requireAuth,
  requirePermissionMiddleware('transfers', 'update'),
  validateRequestParams(bookingIdSchema),
  validateRequestBody(updateBookingStatusSchema),
  transferBookingController.updateBookingStatus
);

// Cancel booking
router.post('/:bookingId/cancel', 
  requireAuth,
  requirePermissionMiddleware('transfers', 'update'),
  validateRequestParams(bookingIdSchema),
  transferBookingController.cancelBooking
);

// Get booking statistics
router.get('/stats/statistics', 
  requireAuth,
  requirePermissionMiddleware('transfers', 'read'),
  transferBookingController.getBookingStatistics
);

module.exports = router;
