const axios = require('axios');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const { setCacheData, getCacheData } = require('../../../utils/nodeCache');
const Activity = require('../models/activity.model');
const ActivityDestination = require('../models/activityDestination.model');
const AppError = require('../../../utils/appError');
const {
    validateGetAllDestinations,
    validateGetPortfolioAvail,
    validateGetPortfolio,
    validateSaveOrUpdateActivity,
    validateGetAllDestinationHotels,
    validateActivitySearch,
    validateActivitySearchDetails,
    validateSearchDestination,
} = require('../validators/activity.validator');

const createHeaders = (apiKey = process.env.HOTELBEDS_API_KEY, secret = process.env.HOTELBEDS_SECRET) => {
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

const createActivityData = (destination, adult, child, departure, arrival) => {
    return {
        filters: [{
            searchFilterItems: [{ type: 'destination', value: destination }],
        }],
        from: departure,
        to: arrival,
        language: 'en',
        paxes: [
            ...Array(Number(adult)).fill().map(() => ({ age: 30 })),
            ...Array(Number(child)).fill().map(() => ({ age: 5 })),
        ],
        pagination: { itemsPerPage: 100, page: 1 },
        order: 'DEFAULT',
    };
};

const activityData = (code, adult, child, departure, arrival) => {
    return {
        code,
        from: departure,
        to: arrival,
        language: 'en',
        paxes: [
            ...Array(Number(adult)).fill().map(() => ({ age: 30 })),
            ...Array(Number(child)).fill().map(() => ({ age: 5 })),
        ],
        pagination: { itemsPerPage: 100, page: 1 },
        order: 'DEFAULT',
    };
};

const getAllCountries = async () => {
    const url = `${process.env.HOTELBEDS_API_ENDPOINT}/activity-content-api/3.0/countries/en`;
    return await fetchData(url);
};

const getAllDestinations = async (query) => {
    validateGetAllDestinations(query);
    const { country } = query;
    const url = `${process.env.HOTELBEDS_API_ENDPOINT}/activity-content-api/3.0/destinations/en/${country}`;
    const data = await fetchData(url);
    const modifiedData = data.country.destinations.map(item => ({
        code: item.code,
        name: item.name,
    }));

    const existingCodes = await ActivityDestination.find({ code: { $in: modifiedData.map(item => item.code) } }).select('code');
    const existingCodeSet = new Set(existingCodes.map(item => item.code));
    const newItems = modifiedData.filter(item => !existingCodeSet.has(item.code));

    if (newItems.length > 0) {
        await ActivityDestination.insertMany(newItems);
    }

    return modifiedData;
};

const searchDestination = async (query) => {
    validateSearchDestination(query);
    const { keyword, offset = 0, limit = 10 } = query;
    const destinations = await ActivityDestination.find(
        { $text: { $search: keyword } },
        { score: { $meta: 'textScore' }, code: 1, name: 1, _id: 0 }
    )
        .sort({ score: { $meta: 'textScore' } })
        .skip(offset)
        .limit(limit);
    return destinations;
};

const getPortfolioAvail = async (query) => {
    validateGetPortfolioAvail(query);
    const { destination, offset = 0, limit = 1000 } = query;
    const url = `${process.env.HOTELBEDS_API_ENDPOINT}/activity-cache-api/1.0/avail?destination=${destination}&offset=${offset}&limit=${limit}`;
    return await fetchData(url);
};

const getPortfolio = async (query) => {
    validateGetPortfolio(query);
    const { destination, offset = 0, limit = 1000 } = query;
    const url = `${process.env.HOTELBEDS_API_ENDPOINT}/activity-cache-api/1.0/portfolio?destination=${destination}&offset=${offset}&limit=${limit}`;
    return await fetchData(url);
};

const getAllActivity = async (query) => {
    const { page = 1, pageSize = 100 } = query;
    const activities = await Activity.find().lean();
    const totalActivities = activities.length;
    if (totalActivities === 0) {
        throw new AppError('Activities not found', 404);
    }

    const maxPageNumber = Math.ceil(totalActivities / pageSize);
    if (page > maxPageNumber) {
        throw new AppError('Invalid page number', 400);
    }

    const offset = (page - 1) * pageSize;
    const paginatedData = activities.slice(offset, offset + pageSize);
    return { totalActivities, data: paginatedData };
};

const getActivity = async (query) => {
    validateGetActivity(query);
    const activity = await Activity.findOne({ activityCode: query.code }).lean();
    if (!activity) {
        throw new AppError('Activity not found', 404);
    }
    return activity;
};

const saveOrUpdateActivity = async (activityInfo) => {
    validateSaveOrUpdateActivity(activityInfo);
    const url = `${process.env.HOTELBEDS_API_ENDPOINT}/activity-content-api/3.0/activities`;
    const data = await fetchData(url, 'POST', { language: 'en', codes: activityInfo.codes });
    const activitiesContent = data.activitiesContent;

    const bulkOps = activitiesContent.map(activity => ({
        updateOne: {
            filter: { activityCode: activity.activityCode },
            update: { $set: { ...activity, address: activityInfo.address } },
            upsert: true,
        },
    }));

    await Activity.bulkWrite(bulkOps);
    return activitiesContent;
};

const getAllCurrencies = async () => {
    const url = `${process.env.HOTELBEDS_API_ENDPOINT}/activity-content-api/3.0/currencies/en`;
    return await fetchData(url);
};

const getAllSegments = async () => {
    const url = `${process.env.HOTELBEDS_API_ENDPOINT}/activity-content-api/3.0/segments/en`;
    return await fetchData(url);
};

const getAllLanguages = async () => {
    const url = `${process.env.HOTELBEDS_API_ENDPOINT}/activity-content-api/3.0/languages`;
    return await fetchData(url);
};

const getAllDestinationHotels = async (query) => {
    validateGetAllDestinationHotels(query);
    const { destination } = query;
    const url = `${process.env.HOTELBEDS_API_ENDPOINT}/activity-content-api/3.0/hotels/en/${destination}`;
    return await fetchData(url);
};

const searchActivities = async (query) => {
    validateActivitySearch(query);
    const { destination, adult, child, departure, arrival, page = 1, pageSize = 100 } = query;
    const url = `${process.env.HOTELBEDS_API_ENDPOINT}/activity-api/3.0/activities/availability`;
    const searchId = uuidv4();
    const data = createActivityData(destination, adult, child, departure, arrival);
    const response = await fetchData(url, 'POST', data);

    const activitiesData = response.activities || [];
    const activitiesDataMap = activitiesData.reduce((acc, activity) => {
        acc[activity.content.activityCode] = activity;
        return acc;
    }, {});

    const activities = await Activity.find({ activityCode: { $in: Object.keys(activitiesDataMap) } }).lean();
    const finalActivities = activities.filter(activity => activitiesDataMap[activity.activityCode]);

    const totalActivities = finalActivities.length;
    if (totalActivities === 0) {
        throw new AppError('Activities not found', 404);
    }

    const maxPageNumber = Math.ceil(totalActivities / pageSize);
    if (page > maxPageNumber) {
        throw new AppError('Invalid page number', 400);
    }

    const offset = (page - 1) * pageSize;
    const paginatedData = finalActivities.slice(offset, offset + pageSize);

    await setCacheData(searchId, paginatedData);
    return { searchId, totalActivities, data: paginatedData };
};

const searchActivitiesDetails = async (query) => {
    validateActivitySearchDetails(query);
    const { code, adult, child, departure, arrival } = query;
    const url = `${process.env.HOTELBEDS_API_ENDPOINT}/activity-api/3.0/activities/details/full`;
    const data = activityData(code, adult, child, departure, arrival);
    const response = await fetchData(url, 'POST', data);

    const activity = await Activity.findOne({ activityCode: code }).lean();
    if (!activity || !response.activity) {
        throw new AppError('Activity not found', 404);
    }

    return { data: response.activity, halalData: activity.halalRatings ? activity : null };
};

const searchFilterActivities = async (query) => {
    validateActivitySearchFilter(query);
    const { searchId, halalRating, page = 1, pageSize = 100 } = query;
    const cacheResult = await getCacheData(searchId);
    if (!cacheResult.success) {
        throw new AppError('Data not found in cache', 404);
    }

    const activities = cacheResult.cache;
    const filteredActivities = halalRating !== null
        ? activities.filter(activity => activity.star_rating >= halalRating)
        : activities;

    const totalActivities = filteredActivities.length;
    if (totalActivities === 0) {
        throw new AppError('No activities match the filter criteria', 404);
    }

    const maxPageNumber = Math.ceil(totalActivities / pageSize);
    if (page > maxPageNumber) {
        throw new AppError('Invalid page number', 400);
    }

    const offset = (page - 1) * pageSize;
    const paginatedData = filteredActivities.slice(offset, offset + pageSize);
    return { searchId, totalActivities, data: paginatedData };
};

module.exports = {
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
};