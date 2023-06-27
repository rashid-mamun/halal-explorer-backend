const { getClient } = require("../../config/database");
const axios = require('axios');
const crypto = require('crypto');

const createHeaders = () => {
  const apiKey = process.env.HOTELBEDS_API_KEY;
  const secret = process.env.HOTELBEDS_SECRET;
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signature = crypto
    .createHash('sha256')
    .update(apiKey + secret + timestamp)
    .digest('hex');

  return {
    Accept: 'application/json',
    'Api-key': apiKey,
    'X-Signature': signature,
    'Accept-Encoding': 'gzip',
  };
};

const fetchData = async (url, successMessage, errorMessage) => {
  const headers = createHeaders();

  try {
    const response = await axios.get(url, { headers });
    if (!response.data) {
      return {
        success: false,
        error: "Unable to fetch the requested data. Please try again later.",
      };
    }

    return {
      success: true,
      message: successMessage,
      data: response.data,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: errorMessage,
    };
  }
};

const getAllCountriesInfo = async () => {
  const url = `${process.env.HOTELBEDS_API_ENDPOINT}/activity-content-api/3.0/countries/en`;
  const successMessage = 'Fetch countries information successfully';
  const errorMessage = 'Failed to fetch countries';

  return fetchData(url, successMessage, errorMessage);
};

const getAllDestinationsInfo = async (country) => {
  const url = `${process.env.HOTELBEDS_API_ENDPOINT}/activity-content-api/3.0/destinations/en/${country}`;
  const successMessage = 'Fetch destinations information successfully';
  const errorMessage = 'Failed to fetch destinations';

  return fetchData(url, successMessage, errorMessage);
};

const getPortfolioAvailInfo = async (destination, offset = 1, limit = 1000) => {
  const url = `${process.env.HOTELBEDS_API_ENDPOINT}activity-cache-api/1.0/avail?destination=${destination}&offset=${offset}&limit=${limit}`;
  const successMessage = 'Fetch portfolio information successfully';
  const errorMessage = 'Failed to fetch portfolio';

  return fetchData(url, successMessage, errorMessage);
};

const getPortfolioInfo = async (destination, offset = 1, limit = 1000) => {
  const url = `${process.env.HOTELBEDS_API_ENDPOINT}activity-cache-api/1.0/portfolio?destination=${destination}&offset=${offset}&limit=${limit}`;
  const successMessage = 'Fetch portfolio information successfully';
  const errorMessage = 'Failed to fetch portfolio';

  return fetchData(url, successMessage, errorMessage);
};

const saveOrUpdateActivityInfo = async (activityInfo) => {
  try {
    const client = getClient();
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection('activityInfo');

    const existingActivity = await collection.findOne({ id: activityInfo.id });

    if (existingActivity) {
      await collection.updateOne({ id: activityInfo.id }, { $set: activityInfo });
    } else {
      await collection.insertOne(activityInfo);
    }

    const activitiesData = await collection.find().toArray();
    return {
      success: true,
      message: 'Activity information saved/updated successfully',
      data: activitiesData,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to save/update activity information',
    };
  }
};
const getAllActivityInfo = async (req) => {
  try {
    const client = getClient();
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection('activityInfo');
    const activityData = await collection.find().toArray();
    const page = req.page;
    const pageNumber = parseInt(page, 10) || 1;
    const pageSize = parseInt(req.pageSize, 10) || 20;
    const totalActivity = activityData.length;

    // Validate page number
    const maxPageNumber = Math.ceil(totalActivity / pageSize);
    if (pageNumber > maxPageNumber) {
      return {
        success: false,
        message: 'Invalid page number',
      };
    }

    // Calculate the offset and limit
    const offset = (pageNumber - 1) * pageSize;
    const limit = pageSize;
    const paginatedData = activityData.slice(offset, offset + limit);
    return {
      success: true,
      message: 'Get activity information successfully',
      data: paginatedData,
    };
  } catch (error) {
    console.error('Failed to get activity information:', error);
    return {
      success: false,
      error: 'Failed to get activity information',
    };
  }
};

const getActivityInfo = async (req) => {
  try {
    const client = getClient();
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection('activityInfo');
    const activity = await collection.findOne({ code: req.code });

    if (activity) {
      return {
        success: true,
        message: 'activity information retrieved successfully',
        data: activity,
      };
    } else {
      return {
        success: false,
        message: 'No activity found with the specified code',
        error: 'activity not found',
      };
    }
  } catch (error) {
    console.error('Failed to get activity information:', error);
    return {
      success: false,
      message: 'Failed to retrieve activity information',
      error: 'Internal server error',
    };
  }
};

const getAllCurrenciesInfo = async () => {
  const url = `${process.env.HOTELBEDS_API_ENDPOINT}/activity-content-api/3.0/currencies/en`;
  const successMessage = 'Fetch currencies information successfully';
  const errorMessage = 'Failed to fetch currencies';

  return fetchData(url, successMessage, errorMessage);
};

const getAllSegmentsInfo = async () => {
  const url = `${process.env.HOTELBEDS_API_ENDPOINT}/activity-content-api/3.0/segments/en`;
  const successMessage = 'Fetch segments information successfully';
  const errorMessage = 'Failed to fetch segments';

  return fetchData(url, successMessage, errorMessage);
};

const getAllLanguagesInfo = async () => {
  const url = `${process.env.HOTELBEDS_API_ENDPOINT}/activity-content-api/3.0/languages`;
  const successMessage = 'Fetch languages information successfully';
  const errorMessage = 'Failed to fetch languages';

  return fetchData(url, successMessage, errorMessage);
};

const getAllDestinationHotelsInfo = async (destination) => {
  const url = `${process.env.HOTELBEDS_API_ENDPOINT}/activity-content-api/3.0/hotels/en/${destination}`;
  const successMessage = 'Fetch destination hotels information successfully';
  const errorMessage = 'Failed to fetch destination hotels';

  return fetchData(url, successMessage, errorMessage);
};

module.exports = {
  getAllCountriesInfo,
  getAllDestinationsInfo,
  getPortfolioAvailInfo,
  getPortfolioInfo,
  saveOrUpdateActivityInfo,
  getAllActivityInfo,
  getActivityInfo,
  getAllCurrenciesInfo,
  getAllSegmentsInfo,
  getAllLanguagesInfo,
  getAllDestinationHotelsInfo,
};
