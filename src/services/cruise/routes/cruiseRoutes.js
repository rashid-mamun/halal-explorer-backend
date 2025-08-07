const express = require('express');
const router = express.Router();
const cruiseController = require('../controllers/cruiseController');
const { authenticateRequest, authorizeByRolesAndPermissions, authorizeByServices, authorizeByPermissions } = require('../../../middleware/auth');
const { handleMulterError, handleServerError } = require('../../../middleware/errorHandler');
const upload = require('../../../middleware/upload');
const { PERMISSIONS, SERVICES, USER_ROLES } = require('../../../../authentication/types/authorization.types');

// Cruise Package Routes
router.post(
    '/admin',
    authenticateRequest,
    authorizeByRolesAndPermissions(
        [USER_ROLES.ADMINISTRATOR, USER_ROLES.MANAGER],
        [PERMISSIONS.MANAGE_CRUISE_SERVICES]
    ),
    authorizeByServices([SERVICES.CRUISE]),
    upload.fields([{ name: 'coverImage', maxCount: 1 }, { name: 'gallery', maxCount: 10 }]),
    cruiseController.createOrUpdateCruisePackage
);

router.get(
    '/packages',
    authenticateRequest,
    authorizeByPermissions([PERMISSIONS.MANAGE_CRUISE_SERVICES]),
    authorizeByServices([SERVICES.CRUISE]),
    cruiseController.getAllCruisePackages
);

router.delete(
    '/packages/:packageId',
    authenticateRequest,
    authorizeByRolesAndPermissions(
        [USER_ROLES.ADMINISTRATOR, USER_ROLES.MANAGER],
        [PERMISSIONS.MANAGE_CRUISE_SERVICES]
    ),
    authorizeByServices([SERVICES.CRUISE]),
    cruiseController.deleteCruisePackage
);

router.get(
    '/packages/search/:packageId',
    authenticateRequest,
    authorizeByPermissions([PERMISSIONS.MANAGE_CRUISE_SERVICES]),
    authorizeByServices([SERVICES.CRUISE]),
    cruiseController.searchCruisePackageById
);

// Cruise Line Routes
router.post(
    '/cruise-line',
    authenticateRequest,
    authorizeByRolesAndPermissions(
        [USER_ROLES.ADMINISTRATOR, USER_ROLES.MANAGER],
        [PERMISSIONS.MANAGE_CRUISE_SERVICES]
    ),
    authorizeByServices([SERVICES.CRUISE]),
    upload.single('logo'),
    cruiseController.createCruiseLine
);

// Ship Routes
router.post(
    '/ship',
    authenticateRequest,
    authorizeByRolesAndPermissions(
        [USER_ROLES.ADMINISTRATOR, USER_ROLES.MANAGER],
        [PERMISSIONS.MANAGE_CRUISE_SERVICES]
    ),
    authorizeByServices([SERVICES.CRUISE]),
    upload.single('image'),
    cruiseController.createShip
);

// Booking Routes
router.post(
    '/book',
    authenticateRequest,
    authorizeByPermissions([PERMISSIONS.CREATE_BOOKING]),
    authorizeByServices([SERVICES.CRUISE]),
    cruiseController.createBooking
);

router.get(
    '/book/all',
    authenticateRequest,
    authorizeByRolesAndPermissions(
        [USER_ROLES.ADMINISTRATOR, USER_ROLES.MANAGER],
        [PERMISSIONS.VIEW_ALL_BOOKINGS]
    ),
    authorizeByServices([SERVICES.CRUISE]),
    cruiseController.getAllBookings
);

router.get(
    '/book',
    authenticateRequest,
    authorizeByPermissions([PERMISSIONS.VIEW_ALL_BOOKINGS]),
    authorizeByServices([SERVICES.CRUISE]),
    cruiseController.getBookingById
);

router.get(
    '/book/:userEmail',
    authenticateRequest,
    authorizeByPermissions([PERMISSIONS.VIEW_ALL_BOOKINGS]),
    authorizeByServices([SERVICES.CRUISE]),
    cruiseController.getBookingsByEmail
);

// Enquiry Routes
router.post(
    '/enquiry',
    authenticateRequest,
    authorizeByPermissions([PERMISSIONS.CREATE_ENQUIRY]),
    authorizeByServices([SERVICES.CRUISE]),
    cruiseController.createEnquiry
);

router.get(
    '/enquiry/all',
    authenticateRequest,
    authorizeByRolesAndPermissions(
        [USER_ROLES.ADMINISTRATOR, USER_ROLES.MANAGER],
        [PERMISSIONS.VIEW_ALL_ENQUIRIES]
    ),
    authorizeByServices([SERVICES.CRUISE]),
    cruiseController.getAllEnquiries
);

router.get(
    '/enquiry',
    authenticateRequest,
    authorizeByPermissions([PERMISSIONS.VIEW_ALL_ENQUIRIES]),
    authorizeByServices([SERVICES.CRUISE]),
    cruiseController.getEnquiryById
);

router.use(handleMulterError);
router.use(handleServerError);

module.exports = router;