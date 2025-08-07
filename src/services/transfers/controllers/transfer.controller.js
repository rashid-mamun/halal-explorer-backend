const { successResponse } = require('../../../utils/response.util');
const {
    getPickups,
    getHotels,
    getCountries,
    getDestinations,
    getTerminals,
    searchTerminals,
    getMasterCategories,
    getMasterVehicles,
    getMasterTransferTypes,
    getCurrencies,
    getRoutes,
} = require('../services/transfer.service');

const getPickupsHandler = async (req, res, next) => {
    try {
        const pickups = await getPickups(req.query);
        successResponse(res, pickups, 'Pickups fetched successfully');
    } catch (err) {
        next(err);
    }
};

const getHotelsHandler = async (req, res, next) => {
    try {
        const hotels = await getHotels(req.query);
        successResponse(res, hotels, 'Hotels fetched successfully');
    } catch (err) {
        next(err);
    }
};

const getCountriesHandler = async (req, res, next) => {
    try {
        const countries = await getCountries(req.query);
        successResponse(res, countries, 'Countries fetched successfully');
    } catch (err) {
        next(err);
    }
};

const getDestinationsHandler = async (req, res, next) => {
    try {
        const destinations = await getDestinations(req.query);
        successResponse(res, destinations, 'Destinations fetched successfully');
    } catch (err) {
        next(err);
    }
};

const getTerminalsHandler = async (req, res, next) => {
    try {
        const terminals = await getTerminals(req.query);
        successResponse(res, terminals, 'Terminals fetched successfully');
    } catch (err) {
        next(err);
    }
};

const searchTerminalsHandler = async (req, res, next) => {
    try {
        const terminals = await searchTerminals(req.query);
        successResponse(res, terminals, 'Terminal search completed successfully');
    } catch (err) {
        next(err);
    }
};

const getMasterCategoriesHandler = async (req, res, next) => {
    try {
        const categories = await getMasterCategories(req.query);
        successResponse(res, categories, 'Master categories fetched successfully');
    } catch (err) {
        next(err);
    }
};

const getMasterVehiclesHandler = async (req, res, next) => {
    try {
        const vehicles = await getMasterVehicles(req.query);
        successResponse(res, vehicles, 'Master vehicles fetched successfully');
    } catch (err) {
        next(err);
    }
};

const getMasterTransferTypesHandler = async (req, res, next) => {
    try {
        const transferTypes = await getMasterTransferTypes(req.query);
        successResponse(res, transferTypes, 'Master transfer types fetched successfully');
    } catch (err) {
        next(err);
    }
};

const getCurrenciesHandler = async (req, res, next) => {
    try {
        const currencies = await getCurrencies(req.query);
        successResponse(res, currencies, 'Currencies fetched successfully');
    } catch (err) {
        next(err);
    }
};

const getRoutesHandler = async (req, res, next) => {
    try {
        const routes = await getRoutes(req.query);
        successResponse(res, routes, 'Routes fetched successfully');
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getPickups: getPickupsHandler,
    getHotels: getHotelsHandler,
    getCountries: getCountriesHandler,
    getDestinations: getDestinationsHandler,
    getTerminals: getTerminalsHandler,
    searchTerminals: searchTerminalsHandler,
    getMasterCategories: getMasterCategoriesHandler,
    getMasterVehicles: getMasterVehiclesHandler,
    getMasterTransferTypes: getMasterTransferTypesHandler,
    getCurrencies: getCurrenciesHandler,
    getRoutes: getRoutesHandler,
};