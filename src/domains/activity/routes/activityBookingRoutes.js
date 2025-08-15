const express = require('express');
const router = express.Router();

const activityBookingController = require('../controllers/activityBookingController');
const { requirePermissionMiddleware } = require('../../auth/middleware/authorization');
const { requireAuth } = require('../../auth/middleware/auth');
const { validateRequestQuery, validateRequestBody } = require('../../../shared/utils/validators');
const activityBookingValidators = require('../validators/activityBookingValidators');

// Apply authentication to all routes
router.use(requireAuth);

// Booking management routes (CRUD operations)
router.post('/',
  requirePermissionMiddleware('activity', 'create'),
  validateRequestBody(activityBookingValidators.createActivityBookingSchema),
  activityBookingController.createActivityBooking
);

router.get('/:bookingId',
  requirePermissionMiddleware('activity', 'read'),
  activityBookingController.getActivityBookingById
);

router.get('/',
  requirePermissionMiddleware('activity', 'read'),
  validateRequestQuery(activityBookingValidators.getAllActivityBookingsSchema),
  activityBookingController.getAllActivityBookings
);

router.put('/:bookingId',
  requirePermissionMiddleware('activity', 'update'),
  validateRequestBody(activityBookingValidators.updateActivityBookingSchema),
  activityBookingController.updateActivityBooking
);

router.delete('/:bookingId',
  requirePermissionMiddleware('activity', 'delete'),
  activityBookingController.deleteActivityBooking
);

router.get('/search',
  requirePermissionMiddleware('activity', 'read'),
  validateRequestQuery(activityBookingValidators.searchActivityBookingsSchema),
  activityBookingController.searchActivityBookings
);

// Booking confirmation and cancellation routes
router.post('/confirm',
  requirePermissionMiddleware('activity', 'create'),
  validateRequestBody(activityBookingValidators.confirmBookingSchema),
  activityBookingController.confirmBooking
);

router.post('/:bookingId/cancel',
  requirePermissionMiddleware('activity', 'update'),
  validateRequestBody(activityBookingValidators.cancelBookingSchema),
  activityBookingController.cancelBooking
);

// Statistics route
router.get('/statistics',
  requirePermissionMiddleware('activity', 'read'),
  activityBookingController.getBookingStatistics
);

module.exports = router;
