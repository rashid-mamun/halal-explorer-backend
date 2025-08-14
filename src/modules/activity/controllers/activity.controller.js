const { successResponse } = require('../../../utils/response.util');
const {
    getAllCountries,
    getAllDestinations,
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
    searchDestination,
    searchFilterActivities,
} = require('../services/activity.service');

const getAllCountriesHandler = async (req, res, next) => {
    try {
        const countries = await getAllCountries();
        successResponse(res, countries, 'Countries fetched successfully');
    } catch (err) {
        next(err);
    }
};

const getAllDestinationsHandler = async (req, res, next) => {
    try {
        const destinations = await getAllDestinations(req.query);
        successResponse(res, destinations, 'Destinations fetched successfully');
    } catch (err) {
        next(err);
    }
};

const searchDestinationHandler = async (req, res, next) => {
    try {
        const destinations = await searchDestination(req.query);
        successResponse(res, destinations, 'Destination search completed successfully');
    } catch (err) {
        next(err);
    }
};

const getPortfolioAvailHandler = async (req, res, next) => {
    try {
        const portfolio = await getPortfolioAvail(req.query);
        successResponse(res, portfolio, 'Portfolio availability fetched successfully');
    } catch (err) {
        next(err);
    }
};

const getPortfolioHandler = async (req, res, next) => {
    try {
        const portfolio = await getPortfolio(req.query);
        successResponse(res, portfolio, 'Portfolio fetched successfully');
    } catch (err) {
        next(err);
    }
};

const saveOrUpdateActivityHandler = async (req, res, next) => {
    try {
        const activity = await saveOrUpdateActivity(req.body);
        successResponse(res, activity, 'Activity information saved/updated successfully');
    } catch (err) {
        next(err);
    }
};

const getAllActivityHandler = async (req, res, next) => {
    try {
        const { totalActivities, data } = await getAllActivity(req.query);
        successResponse(res, { totalActivities, activities: data }, 'Activities fetched successfully');
    } catch (err) {
        next(err);
    }
};

const getActivityHandler = async (req, res, next) => {
    try {
        const activity = await getActivity(req.query);
        successResponse(res, activity, 'Activity fetched successfully');
    } catch (err) {
        next(err);
    }
};

const getAllCurrenciesHandler = async (req, res, next) => {
    try {
        const currencies = await getAllCurrencies();
        successResponse(res, currencies, 'Currencies fetched successfully');
    } catch (err) {
        next(err);
    }
};

const getAllSegmentsHandler = async (req, res, next) => {
    try {
        const segments = await getAllSegments();
        successResponse(res, segments, 'Segments fetched successfully');
    } catch (err) {
        next(err);
    }
};

const getAllLanguagesHandler = async (req, res, next) => {
    try {
        const languages = await getAllLanguages();
        successResponse(res, languages, 'Languages fetched successfully');
    } catch (err) {
        next(err);
    }
};

const getAllDestinationHotelsHandler = async (req, res, next) => {
    try {
        const hotels = await getAllDestinationHotels(req.query);
        successResponse(res, hotels, 'Destination hotels fetched successfully');
    } catch (err) {
        next(err);
    }
};

const searchActivitiesHandler = async (req, res, next) => {
    try {
        const { searchId, totalActivities, data } = await searchActivities(req.query);
        successResponse(res, { searchId, totalActivities, activities: data }, 'Activities search completed successfully');
    } catch (err) {
        next(err);
    }
};

const searchActivitiesDetailsHandler = async (req, res, next) => {
    try {
        const { data, halalData } = await searchActivitiesDetails(req.query);
        successResponse(res, { activity: data, halalData }, 'Activity details fetched successfully');
    } catch (err) {
        next(err);
    }
};

const searchFilterActivitiesHandler = async (req, res, next) => {
    try {
        const { searchId, totalActivities, data } = await searchFilterActivities(req.query);
        successResponse(res, { searchId, totalActivities, activities: data }, 'Filtered activities fetched successfully');
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAllCountries: getAllCountriesHandler,
    getAllDestinations: getAllDestinationsHandler,
    searchDestination: searchDestinationHandler,
    getPortfolioAvail: getPortfolioAvailHandler,
    getPortfolio: getPortfolioHandler,
    saveOrUpdateActivity: saveOrUpdateActivityHandler,
    getAllActivity: getAllActivityHandler,
    getActivity: getActivityHandler,
    getAllCurrencies: getAllCurrenciesHandler,
    getAllSegments: getAllSegmentsHandler,
    getAllLanguages: getAllLanguagesHandler,
    getAllDestinationHotels: getAllDestinationHotelsHandler,
    searchActivities: searchActivitiesHandler,
    searchActivitiesDetails: searchActivitiesDetailsHandler,
    searchFilterActivities: searchFilterActivitiesHandler,
};