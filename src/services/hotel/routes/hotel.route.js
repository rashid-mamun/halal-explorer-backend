const express = require('express');
const { withAuth } = require('../../../middleware/auth.middleware');
const { PERMISSIONS, SERVICES, USER_ROLES } = require('../../../../authentication/types/authorization.types');
const {
    hotelSearch,
    hotelSearchFilter,
    hotelSearchDetails,
    dumbHotelById,
} = require('../controllers/hotel.controller');
const {
    rateHotel,
    getAllHalalHotel,
    getHalalHotel,
    halalRatingStructure,
    getHalalRatingStructure,
} = require('../controllers/halalHotel.controller');
const {
    managerInfo,
    getAllManagerInfo,
    getManagerInfo,
    managerSearch,
} = require('../controllers/manager.controller');
const {
    hotelBook,
    getAllBookings,
    getBookingsByEmail,
} = require('../controllers/booking.controller');

const router = express.Router();

// Public routes (no authentication)
router.get('/api', (req, res) => res.status(200).json({ status: 'success', message: 'Hotel API is running', timestamp: new Date().toISOString() }));
router.get('/search', hotelSearch);
router.get('/search/filter', hotelSearchFilter);
router.get('/search-details', hotelSearchDetails);
router.get('/dumb', dumbHotelById);

// Protected routes (authentication required)
router.post('/book',
    withAuth([PERMISSIONS.CREATE_BOOKING], [SERVICES.HOTEL]),
    hotelBook
);
router.get('/book/all',
    withAuth([PERMISSIONS.VIEW_ALL_BOOKINGS], [SERVICES.HOTEL], [USER_ROLES.ADMINISTRATOR, USER_ROLES.MANAGER]),
    getAllBookings
);
router.get('/book/:userEmail',
    withAuth([PERMISSIONS.VIEW_ALL_BOOKINGS], [SERVICES.HOTEL]),
    getBookingsByEmail
);
router.post('/rating',
    withAuth([PERMISSIONS.MANAGE_HOTELS], [SERVICES.HOTEL]),
    rateHotel
);
router.get('/all-hotels',
    withAuth([PERMISSIONS.MANAGE_HOTELS], [SERVICES.HOTEL]),
    getAllHalalHotel
);
router.get('/hotel',
    withAuth([PERMISSIONS.MANAGE_HOTELS], [SERVICES.HOTEL]),
    getHalalHotel
);
router.post('/structure',
    withAuth([PERMISSIONS.MANAGE_HOTELS], [SERVICES.HOTEL], [USER_ROLES.ADMINISTRATOR, USER_ROLES.MANAGER]),
    halalRatingStructure
);
router.get('/structure',
    withAuth([PERMISSIONS.MANAGE_HOTELS], [SERVICES.HOTEL]),
    getHalalRatingStructure
);
router.get('/manager/search',
    withAuth([PERMISSIONS.MANAGE_HOTELS], [SERVICES.HOTEL], [USER_ROLES.MANAGER]),
    managerSearch
);
router.post('/manager/info',
    withAuth([PERMISSIONS.MANAGE_HOTELS], [SERVICES.HOTEL], [USER_ROLES.MANAGER]),
    managerInfo
);
router.get('/manager/all',
    withAuth([PERMISSIONS.MANAGE_HOTELS], [SERVICES.HOTEL], [USER_ROLES.MANAGER]),
    getAllManagerInfo
);
router.get('/manager/one',
    withAuth([PERMISSIONS.MANAGE_HOTELS], [SERVICES.HOTEL], [USER_ROLES.MANAGER]),
    getManagerInfo
);

module.exports = router;