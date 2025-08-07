const express = require('express');
const router = express.Router();
const holidayController = require('../controllers/holidayController');
const bookingController = require('../controllers/bookingController');
const { authenticateRequest, authorizeByRolesAndPermissions, authorizeByServices, authorizeByPermissions } = require('../../../middleware/auth');
const { handleMulterError, handleServerError } = require('../../../middleware/errorHandler');
const upload = require('../../../middleware/upload');
const { PERMISSIONS, SERVICES, USER_ROLES } = require('../../../../authentication/types/authorization.types');

// Holiday Package Routes
router.post(
    '/admin',
    authenticateRequest,
    authorizeByRolesAndPermissions(
        [USER_ROLES.ADMINISTRATOR, USER_ROLES.MANAGER],
        [PERMISSIONS.MANAGE_HOLIDAY_SERVICES]
    ),
    authorizeByServices([SERVICES.HOLIDAY]),
    upload.fields([{ name: 'coverImage', maxCount: 1 }, { name: 'gallery', maxCount: 10 }]),
    holidayController.createOrUpdateHolidayPackage
);

router.get(
    '/packages',
    authenticateRequest,
    authorizeByPermissions([PERMISSIONS.MANAGE_HOLIDAY_SERVICES]),
    authorizeByServices([SERVICES.HOLIDAY]),
    holidayController.getAllHolidayPackages
);

router.delete(
    '/packages/:packageId',
    authenticateRequest,
    authorizeByRolesAndPermissions(
        [USER_ROLES.ADMINISTRATOR, USER_ROLES.MANAGER],
        [PERMISSIONS.MANAGE_HOLIDAY_SERVICES]
    ),
    authorizeByServices([SERVICES.HOLIDAY]),
    holidayController.deleteHolidayPackage
);

router.get(
    '/packages/search/:packageId',
    authenticateRequest,
    authorizeByPermissions([PERMISSIONS.MANAGE_HOLIDAY_SERVICES]),
    authorizeByServices([SERVICES.HOLIDAY]),
    holidayController.searchHolidayPackageById
);

// Booking Routes
router.post(
    '/book',
    authenticateRequest,
    authorizeByPermissions([PERMISSIONS.CREATE_BOOKING]),
    authorizeByServices([SERVICES.HOLIDAY]),
    bookingController.createBooking
);

router.get(
    '/book/all',
    authenticateRequest,
    authorizeByRolesAndPermissions(
        [USER_ROLES.ADMINISTRATOR, USER_ROLES.MANAGER],
        [PERMISSIONS.VIEW_ALL_BOOKINGS]
    ),
    authorizeByServices([SERVICES.HOLIDAY]),
    bookingController.getAllBookings
);

router.get(
    '/book',
    authenticateRequest,
    authorizeByPermissions([PERMISSIONS.VIEW_ALL_BOOKINGS]),
    authorizeByServices([SERVICES.HOLIDAY]),
    bookingController.getBookingById
);

router.get(
    '/book/:userEmail',
    authenticateRequest,
    authorizeByPermissions([PERMISSIONS.VIEW_ALL_BOOKINGS]),
    authorizeByServices([SERVICES.HOLIDAY]),
    bookingController.getBookingsByEmail
);

// Custom Booking Routes
router.post(
    '/custom/book',
    authenticateRequest,
    authorizeByPermissions([PERMISSIONS.CREATE_BOOKING]),
    authorizeByServices([SERVICES.HOLIDAY]),
    bookingController.createCustomBooking
);

router.get(
    '/custom/book/all',
    authenticateRequest,
    authorizeByRolesAndPermissions(
        [USER_ROLES.ADMINISTRATOR, USER_ROLES.MANAGER],
        [PERMISSIONS.VIEW_ALL_BOOKINGS]
    ),
    authorizeByServices([SERVICES.HOLIDAY]),
    bookingController.getCustomAllBookings
);

router.get(
    '/custom/book',
    authenticateRequest,
    authorizeByPermissions([PERMISSIONS.VIEW_ALL_BOOKINGS]),
    authorizeByServices([SERVICES.HOLIDAY]),
    bookingController.getCustomBookingById
);

router.get(
    '/custom/book/:userEmail',
    authenticateRequest,
    authorizeByPermissions([PERMISSIONS.VIEW_ALL_BOOKINGS]),
    authorizeByServices([SERVICES.HOLIDAY]),
    bookingController.getCustomBookingsByEmail
);

router.use(handleMulterError);
router.use(handleServerError);

module.exports = router;