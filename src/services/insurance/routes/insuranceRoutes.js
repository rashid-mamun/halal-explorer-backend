const express = require('express');
const router = express.Router();
const insuranceController = require('../controllers/insuranceController');
const { authenticateRequest, authorizeByPermissions, authorizeByServices, authorizeByRolesAndPermissions, authorizeByRoleHierarchy } = require('../../../authentication/guards/authorizationGuard');
const { handleServerError } = require('../../../middleware/errorHandler');
const { PERMISSIONS, SERVICES, USER_ROLES } = require('../../../authentication/types/authorization.types');

// Master Data Routes
router.get('/policy-type',
    authenticateRequest,
    authorizeByPermissions([PERMISSIONS.MANAGE_INSURANCE_SERVICES]),
    authorizeByServices([SERVICES.INSURANCE]),
    insuranceController.getPolicyTypes
);

router.post('/policy-type',
    authenticateRequest,
    authorizeByRoleHierarchy(USER_ROLES.ADMINISTRATOR),
    authorizeByServices([SERVICES.INSURANCE]),
    insuranceController.createPolicyType
);

router.get('/area',
    authenticateRequest,
    authorizeByPermissions([PERMISSIONS.MANAGE_INSURANCE_SERVICES]),
    authorizeByServices([SERVICES.INSURANCE]),
    insuranceController.getAreas
);

router.post('/area',
    authenticateRequest,
    authorizeByRoleHierarchy(USER_ROLES.ADMINISTRATOR),
    authorizeByServices([SERVICES.INSURANCE]),
    insuranceController.createArea
);

router.get('/country',
    authenticateRequest,
    authorizeByPermissions([PERMISSIONS.MANAGE_INSURANCE_SERVICES]),
    authorizeByServices([SERVICES.INSURANCE]),
    insuranceController.getCountries
);

router.post('/country',
    authenticateRequest,
    authorizeByRoleHierarchy(USER_ROLES.ADMINISTRATOR),
    authorizeByServices([SERVICES.INSURANCE]),
    insuranceController.createCountry
);

router.get('/traveller-type',
    authenticateRequest,
    authorizeByPermissions([PERMISSIONS.MANAGE_INSURANCE_SERVICES]),
    authorizeByServices([SERVICES.INSURANCE]),
    insuranceController.getTravellerTypes
);

router.post('/traveller-type',
    authenticateRequest,
    authorizeByRoleHierarchy(USER_ROLES.ADMINISTRATOR),
    authorizeByServices([SERVICES.INSURANCE]),
    insuranceController.createTravellerType
);

router.get('/rest-type',
    authenticateRequest,
    authorizeByPermissions([PERMISSIONS.MANAGE_INSURANCE_SERVICES]),
    authorizeByServices([SERVICES.INSURANCE]),
    insuranceController.getRestTypes
);

router.post('/rest-type',
    authenticateRequest,
    authorizeByRoleHierarchy(USER_ROLES.ADMINISTRATOR),
    authorizeByServices([SERVICES.INSURANCE]),
    insuranceController.createRestType
);

router.get('/age-group',
    authenticateRequest,
    authorizeByPermissions([PERMISSIONS.MANAGE_INSURANCE_SERVICES]),
    authorizeByServices([SERVICES.INSURANCE]),
    insuranceController.getAgeGroups
);

router.post('/age-group',
    authenticateRequest,
    authorizeByRoleHierarchy(USER_ROLES.ADMINISTRATOR),
    authorizeByServices([SERVICES.INSURANCE]),
    insuranceController.createAgeGroup
);

router.get('/plan',
    authenticateRequest,
    authorizeByPermissions([PERMISSIONS.MANAGE_INSURANCE_SERVICES]),
    authorizeByServices([SERVICES.INSURANCE]),
    insuranceController.getPlans
);

router.post('/plan',
    authenticateRequest,
    authorizeByRoleHierarchy(USER_ROLES.ADMINISTRATOR),
    authorizeByServices([SERVICES.INSURANCE]),
    insuranceController.createPlan
);

router.get('/plan/:planId',
    authenticateRequest,
    authorizeByPermissions([PERMISSIONS.MANAGE_INSURANCE_SERVICES]),
    authorizeByServices([SERVICES.INSURANCE]),
    insuranceController.getPlanById
);

router.put('/plan/:planId',
    authenticateRequest,
    authorizeByRoleHierarchy(USER_ROLES.ADMINISTRATOR),
    authorizeByServices([SERVICES.INSURANCE]),
    insuranceController.updatePlan
);

router.delete('/plan/:planId',
    authenticateRequest,
    authorizeByRoleHierarchy(USER_ROLES.ADMINISTRATOR),
    authorizeByServices([SERVICES.INSURANCE]),
    insuranceController.deletePlan
);

// Booking Routes
router.post('/book',
    authenticateRequest,
    authorizeByPermissions([PERMISSIONS.CREATE_BOOKING]),
    authorizeByServices([SERVICES.INSURANCE]),
    insuranceController.bookInsurance
);

router.get('/book/all',
    authenticateRequest,
    authorizeByRolesAndPermissions(
        [USER_ROLES.ADMINISTRATOR, USER_ROLES.MANAGER],
        [PERMISSIONS.VIEW_ALL_BOOKINGS]
    ),
    authorizeByServices([SERVICES.INSURANCE]),
    insuranceController.getAllBookings
);

router.get('/book/:userEmail',
    authenticateRequest,
    authorizeByPermissions([PERMISSIONS.VIEW_ALL_BOOKINGS]),
    authorizeByServices([SERVICES.INSURANCE]),
    insuranceController.getBookingsByEmail
);

router.get('/book/:bookingId',
    authenticateRequest,
    authorizeByPermissions([PERMISSIONS.VIEW_ALL_BOOKINGS]),
    authorizeByServices([SERVICES.INSURANCE]),
    insuranceController.getBookingById
);

router.use(handleServerError);

module.exports = router;