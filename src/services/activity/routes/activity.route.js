const express = require('express');
const { withAuth } = require('../../../middleware/auth.middleware');
const { PERMISSIONS, SERVICES, USER_ROLES } = require('../../../../authentication/types/authorization.types');
const {
    getAllCountries,
    getAllDestinations,
    searchDestination,
    getPortfolioAvail,
    getPortfolio,
    saveOrUpdateActivity,
    getAllActivity,
    getActivity,
    getAllCurrencies,
    getAllSegments,
    getAllLanguages,
    getAllDestinationHotels,
    searchActivities,
    searchActivitiesDetails,
    searchFilterActivities,
} = require('../controllers/activity.controller');
const {
    rateActivity,
    getAllHalalActivity,
    getHalalActivity,
    halalRatingStructure,
    getHalalRatingStructure,
} = require('../controllers/halalActivity.controller');
const {
    managerInfo,
    getAllManagerInfo,
    getManagerInfo,
    managerSearch,
} = require('../controllers/manager.controller');
const { activityBook } = require('../controllers/booking.controller');

const router = express.Router();

// Public routes (no authentication)
router.get('/countries', getAllCountries);
router.get('/destinations', getAllDestinations);
router.get('/destinations-search', searchDestination);
router.get('/currencies', getAllCurrencies);
router.get('/segments', getAllSegments);
router.get('/languages', getAllLanguages);
router.get('/portfolio/avail', getPortfolioAvail);
router.get('/portfolio', getPortfolio);
router.get('/destination-hotels', getAllDestinationHotels);
router.get('/search', searchActivities);
router.get('/search/filter', searchFilterActivities);
router.get('/search-details', searchActivitiesDetails);

// Protected routes (authentication required)
router.post('/info',
    withAuth([PERMISSIONS.MANAGE_ACTIVITY_SERVICES], [SERVICES.ACTIVITY], [USER_ROLES.ADMINISTRATOR, USER_ROLES.MANAGER]),
    saveOrUpdateActivity
);
router.get('/all',
    withAuth([PERMISSIONS.MANAGE_ACTIVITY_SERVICES], [SERVICES.ACTIVITY]),
    getAllActivity
);
router.get('/one',
    withAuth([PERMISSIONS.MANAGE_ACTIVITY_SERVICES], [SERVICES.ACTIVITY]),
    getActivity
);
router.post('/book',
    withAuth([PERMISSIONS.CREATE_BOOKING], [SERVICES.ACTIVITY]),
    activityBook
);
router.get('/halal/search',
    withAuth([PERMISSIONS.MANAGE_ACTIVITY_SERVICES], [SERVICES.ACTIVITY]),
    getAllHalalActivity
);
router.post('/halal/rating',
    withAuth([PERMISSIONS.MANAGE_ACTIVITY_SERVICES], [SERVICES.ACTIVITY]),
    rateActivity
);
router.get('/halal/all-activity',
    withAuth([PERMISSIONS.MANAGE_ACTIVITY_SERVICES], [SERVICES.ACTIVITY]),
    getAllHalalActivity
);
router.get('/halal/activity',
    withAuth([PERMISSIONS.MANAGE_ACTIVITY_SERVICES], [SERVICES.ACTIVITY]),
    getHalalActivity
);
router.post('/halal/structure',
    withAuth([PERMISSIONS.MANAGE_ACTIVITY_SERVICES], [SERVICES.ACTIVITY], [USER_ROLES.ADMINISTRATOR, USER_ROLES.MANAGER]),
    halalRatingStructure
);
router.get('/halal/structure',
    withAuth([PERMISSIONS.MANAGE_ACTIVITY_SERVICES], [SERVICES.ACTIVITY]),
    getHalalRatingStructure
);
router.get('/manager/search',
    withAuth([PERMISSIONS.MANAGE_ACTIVITY_SERVICES], [SERVICES.ACTIVITY], [USER_ROLES.MANAGER]),
    managerSearch
);
router.post('/manager/info',
    withAuth([PERMISSIONS.MANAGE_ACTIVITY_SERVICES], [SERVICES.ACTIVITY], [USER_ROLES.MANAGER]),
    managerInfo
);
router.get('/manager/all',
    withAuth([PERMISSIONS.MANAGE_ACTIVITY_SERVICES], [SERVICES.ACTIVITY], [USER_ROLES.MANAGER]),
    getAllManagerInfo
);
router.get('/manager/one',
    withAuth([PERMISSIONS.MANAGE_ACTIVITY_SERVICES], [SERVICES.ACTIVITY], [USER_ROLES.MANAGER]),
    getManagerInfo
);

module.exports = router;