const axios = require('axios');
const crypto = require('crypto');
const { Terminal } = require('../models/transfer.model');
const AppError = require('../../../utils/appError');
const {
    validateMultipleAvailabilityBody,
    validatePickupsQuery,
    validateHotelsQuery,
    validateCountriesQuery,
    validateDestinationsQuery,
    validateTerminalsQuery,
    validateSearchTerminalsQuery,
    validateMasterCategoriesQuery,
    validateMasterVehiclesQuery,
    validateMasterTransferTypesQuery,
    validateCurrenciesQuery,
    validateRoutesQuery,
} = require('../validators/transfer.validator');

const createHeaders = (apiKey = process.env.HOTELBEDS_TRANSFERS_API_KEY, secret = process.env.HOTELBEDS_TRANSFERS_SECRET) => {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const signature = crypto.createHash('sha256').update(apiKey + secret + timestamp).digest('hex');
    return {
        Accept: 'application/json',
        'Api-key': apiKey,
        'X-Signature': signature,
        'Accept-Encoding': 'gzip',
    };
};

const fetchData = async (url, method = 'GET', data = null) => {
    const headers = createHeaders();
    try {
        const response = await axios({ url, method: method.toLowerCase(), headers, data });
        if (![200, 201].includes(response.status)) {
            throw new AppError(`Request failed with status code ${response.status}`, 400);
        }
        if (!response.data) {
            throw new AppError('No data returned from the API', 404);
        }
        return response.data;
    } catch (error) {
        throw new AppError(error.response?.data?.error || 'Failed to fetch data from API', error.response?.status || 500);
    }
};

const postMultipleAvailability = async ({ language, adults, children, infants, availabilityData }) => {
    validateMultipleAvailabilityBody(availabilityData);
    const url = `${process.env.HOTELBEDS_API_ENDPOINT}/transfer-api/1.0/availability/routes/${language}/${adults}/${children}/${infants}`;
    const data = await fetchData(url, 'POST', availabilityData);
    return data.routes || [];
};

const getPickups = async (query) => {
    validatePickupsQuery(query);
    const { fields = 'ALL', language = 'en', codes = '', offset = 0, limit = 10 } = query;
    const url = `${process.env.HOTELBEDS_API_ENDPOINT}/transfer-cache-api/1.0/pickups?fields=${fields}&language=${language}&codes=${codes}&offset=${offset}&limit=${limit}`;
    return await fetchData(url);
};

const getHotels = async (query) => {
    validateHotelsQuery(query);
    const { fields = 'ALL', language = 'en', countryCodes = '', destinationCodes = '', codes = '', giataCodes = '', offset = 0, limit = 10 } = query;
    const url = `${process.env.HOTELBEDS_API_ENDPOINT}/transfer-cache-api/1.0/hotels?fields=${fields}&language=${language}&countryCodes=${countryCodes}&destinationCodes=${destinationCodes}&codes=${codes}&giataCodes=${giataCodes}&offset=${offset}&limit=${limit}`;
    return await fetchData(url);
};

const getCountries = async (query) => {
    validateCountriesQuery(query);
    const { fields = 'ALL', language = 'en', codes = '', offset = 0, limit = 10 } = query;
    const url = `${process.env.HOTELBEDS_API_ENDPOINT}/transfer-cache-api/1.0/locations/countries?fields=${fields}&language=${language}&codes=${codes}&offset=${offset}&limit=${limit}`;
    return await fetchData(url);
};

const getDestinations = async (query) => {
    validateDestinationsQuery(query);
    const { fields = 'ALL', language = 'en', countryCodes = '', codes = '', offset = 0, limit = 10 } = query;
    const url = `${process.env.HOTELBEDS_API_ENDPOINT}/transfer-cache-api/1.0/locations/destinations?fields=${fields}&language=${language}&countryCodes=${countryCodes}&codes=${codes}&offset=${offset}&limit=${limit}`;
    return await fetchData(url);
};

const getTerminals = async (query) => {
    validateTerminalsQuery(query);
    const { fields = 'ALL', language = 'en', countryCode = '', codes = '', offset = 0, limit = 10 } = query;
    const url = `${process.env.HOTELBEDS_API_ENDPOINT}/transfer-cache-api/1.0/locations/terminals?fields=${fields}&language=${language}&countryCode=${countryCode}&codes=${codes}&offset=${offset}&limit=${limit}`;
    const data = await fetchData(url);

    const modifiedData = data.map(item => ({
        code: item.code,
        name: item.content.description,
        content: item.content,
        countryCode: item.countryCode,
        coordinates: item.coordinates,
        language: item.language,
    }));

    const existingCodes = await Terminal.find({ code: { $in: modifiedData.map(item => item.code) } }).select('code');
    const existingCodeSet = new Set(existingCodes.map(item => item.code));
    const newItems = modifiedData.filter(item => !existingCodeSet.has(item.code));

    if (newItems.length > 0) {
        await Terminal.insertMany(newItems);
    }

    return modifiedData;
};

const searchTerminals = async (query) => {
    validateSearchTerminalsQuery(query);
    const { keyword, offset = 0, limit = 10 } = query;
    const terminals = await Terminal.find(
        { $text: { $search: keyword } },
        { score: { $meta: 'textScore' }, code: 1, name: 1, _id: 0 }
    )
        .sort({ score: { $meta: 'textScore' } })
        .skip(offset)
        .limit(limit);
    return terminals;
};

const getMasterCategories = async (query) => {
    validateMasterCategoriesQuery(query);
    const { fields = 'ALL', language = 'en', codes = '', offset = 0, limit = 10 } = query;
    const url = `${process.env.HOTELBEDS_API_ENDPOINT}/transfer-cache-api/1.0/masters/categories?fields=${fields}&language=${language}&codes=${codes}&offset=${offset}&limit=${limit}`;
    return await fetchData(url);
};

const getMasterVehicles = async (query) => {
    validateMasterVehiclesQuery(query);
    const { fields = 'ALL', language = 'en', codes = '', offset = 0, limit = 10 } = query;
    const url = `${process.env.HOTELBEDS_API_ENDPOINT}/transfer-cache-api/1.0/masters/vehicles?fields=${fields}&language=${language}&codes=${codes}&offset=${offset}&limit=${limit}`;
    return await fetchData(url);
};

const getMasterTransferTypes = async (query) => {
    validateMasterTransferTypesQuery(query);
    const { fields = 'ALL', language = 'en', codes = '', offset = 0, limit = 10 } = query;
    const url = `${process.env.HOTELBEDS_API_ENDPOINT}/transfer-cache-api/1.0/masters/transferTypes?fields=${fields}&language=${language}&codes=${codes}&offset=${offset}&limit=${limit}`;
    return await fetchData(url);
};

const getCurrencies = async (query) => {
    validateCurrenciesQuery(query);
    const { fields = 'ALL', language = 'en', codes = '', offset = 0, limit = 10 } = query;
    const url = `${process.env.HOTELBEDS_API_ENDPOINT}/transfer-cache-api/1.0/currencies?fields=${fields}&language=${language}&codes=${codes}&offset=${offset}&limit=${limit}`;
    return await fetchData(url);
};

const getRoutes = async (query) => {
    validateRoutesQuery(query);
    const { fields = 'ALL', destinationCode, offset = 0, limit = 10 } = query;
    const url = `${process.env.HOTELBEDS_API_ENDPOINT}/transfer-cache-api/1.0/routes?fields=${fields}&destinationCode=${destinationCode}&offset=${offset}&limit=${limit}`;
    return await fetchData(url);
};

module.exports = {
    postMultipleAvailability,
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
};