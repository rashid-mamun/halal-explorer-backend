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

const postData = async (url, data, successMessage, errorMessage) => {
  const headers = createHeaders();

  try {
    const response = await axios.post(url, data, { headers });
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

const processActivityData = async (activitiesData, activityCodeObject, collection) => {
  const bulkOperations = [];

  for (const activityCode in activityCodeObject) {
    const existingActivity = activitiesData.find(activity => activity.activityCode === activityCode);
    const activity = activityCodeObject[activityCode];

    if (existingActivity) {
      // Update existing activity
      bulkOperations.push({
        updateOne: {
          filter: { activityCode: activityCode },
          update: { $set: activity }
        }
      });
    } else {
      // Insert new activity using upsert
      bulkOperations.push({
        updateOne: {
          filter: { activityCode: activityCode },
          update: { $set: activity },
          upsert: true
        }
      });
    }
  }

  const result = await collection.bulkWrite(bulkOperations);

  return {
    success: true,
    message: 'Activity information saved/updated successfully',
    // data: activitiesData,
  };
};


const saveOrUpdateActivityInfo = async (activityInfo) => {
  try {
    const url = `${process.env.HOTELBEDS_API_ENDPOINT}/activity-content-api/3.0/activities`;
    const successMessage = 'Fetched activities information successfully';
    const errorMessage = 'Failed to fetch activities';

    const data = {
      language: 'en',
      codes: activityInfo.codes
    };

    const response = await postData(url, data, successMessage, errorMessage);

    if (!response.success) {
      return response;
    }

    const activitiesContent = response.data.activitiesContent;
    const activityCodeObject = activitiesContent.reduce((acc, activity) => {
      acc[activity.activityCode] = {
        ...activity,
        address: activityInfo.address
      };
      return acc;
    }, {});
    // console.log(JSON.stringify(activityCodeObject));
    const client = getClient();
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection('activityInfo');
    const activitiesData = await collection.find().toArray();

    return processActivityData(activitiesData, activityCodeObject, collection);
  } catch (error) {
    return {
      success: false,
      error: 'Failed to save/update activity information: ' + error.message,
    };
  }
};
const getActivitiesDataMapping = async (activitiesDataCursor) => {
  const activitiesDataMapping = {};

  await activitiesDataCursor.forEach((activityData) => {
    activitiesDataMapping[activityData.activityCode] = activityData;
  });

  return activitiesDataMapping;
};

const searchActivities = async (req) => {
  try {
    const keyword = req.city;
    const client = getClient();
    const db = client.db(process.env.DB_NAME);
    const activityCollection = db.collection('activityInfo');
    const halalActivityCollection = db.collection('halalActivities');

    // Create a text index on the 'address' column if it's not already created
    const indexes = await activityCollection.indexes();
    const addressIndexExists = indexes.some((index) => index.key.address);
    if (!addressIndexExists) {
      await activityCollection.createIndex({ address: 'text' });
    }

    // Search for activities using a regex pattern match on the 'address' field
    const regexPattern = new RegExp(keyword, 'i');
    const activitiesDataCursor = activityCollection.find({ address: regexPattern });

    // Check if activitiesDataCursor is empty
    if ((await activitiesDataCursor.count()) === 0) {
      return {
        success: true,
        message: 'No activities found for the given search criteria.',
        totalActivities: 0,
        data: [],
      };
    }

    // Retrieve the mapping of activity IDs to data
    const activitiesDataMapping = await getActivitiesDataMapping(activitiesDataCursor);

    const halalActivitiesDataCodes = await halalActivityCollection.distinct('code');
    const finalActivityCodes = halalActivitiesDataCodes.filter((code) => activitiesDataMapping.hasOwnProperty(code));

    const page = parseInt(req.page, 10) || 1;
    const pageSize = parseInt(req.pageSize, 10) || 10;

    const totalActivities = finalActivityCodes.length;

    // Validate page number
    const maxPageNumber = Math.ceil(totalActivities / pageSize);
    if (page > maxPageNumber) {
      return {
        success: false,
        error: 'Invalid page number',
      };
    }

    // Calculate the offset and limit
    const offset = (page - 1) * pageSize;
    const limit = pageSize;
    const paginatedData = finalActivityCodes.slice(offset, offset + limit);

    const paginatedActivitiesData = paginatedData.map((code) => activitiesDataMapping[code]);

    return {
      success: true,
      totalActivities,
      data: paginatedActivitiesData,
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      error: 'An error occurred while searching activities.',
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
      totalActivity: totalActivity,
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
    const activity = await collection.findOne({ activityCode: req.code });

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
  searchActivities,
};
