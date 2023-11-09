const { getClient } = require("../../config/database");
const axios = require('axios');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const { setCacheData, getCacheData } = require('../../utils/nodeCache')

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
const axiosPost = async (url, data, headers) => {
  try {
    const response = await axios.post(url, data, { headers });
    return response.data;
  } catch (error) {
    console.error(`Request failed: ${error.message}`);
    return null;
  }
};

const postData = async (url, data, successMessage, errorMessage) => {
  const headers = createHeaders();

  try {
    const responseData = await axiosPost(url, data, headers);

    if (!responseData) {
      console.error('Unable to fetch the requested data. Please try again later.');
      return {
        success: false,
        error: 'Unable to fetch the requested data. Please try again later.',
      };
    }

    return {
      success: true,
      message: successMessage,
      data: responseData,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: errorMessage || 'An error occurred during the request.',
    };
  }
};


const createActivityData = (destination, adult, child, departure, arrival) => {
  const filters = [
    {
      searchFilterItems: [
        {
          type: 'destination',
          value: destination,
        },
      ],
    },
  ];

  const from = departure;
  const to = arrival;
  const language = 'en';
  const paxes = [];

  for (let i = 0; i < adult; i++) {
    paxes.push({
      age: 30,
    });
  }

  for (let i = 0; i < child; i++) {
    paxes.push({
      age: 5,
    });
  }

  const pagination = {
    itemsPerPage: 100,
    page: 1,
  };

  const order = 'DEFAULT';

  return {
    filters,
    from,
    to,
    language,
    paxes,
    pagination,
    order,
  };
};
const activityData = (code, adult, child, departure, arrival) => {
  const from = departure;
  const to = arrival;
  const language = 'en';
  const paxes = [];

  for (let i = 0; i < adult; i++) {
    paxes.push({
      age: 30,
    });
  }

  for (let i = 0; i < child; i++) {
    paxes.push({
      age: 5,
    });
  }

  const pagination = {
    itemsPerPage: 100,
    page: 1,
  };

  const order = 'DEFAULT';

  return {
    code,
    from,
    to,
    language,
    paxes,
    pagination,
    order,
  };
};
function generateUniqueSearchId() {
  return uuidv4();
}

const searchActivities = async (destination, adult, child, departure, arrival, req) => {
  try {
    const uniqueSearchId = generateUniqueSearchId();
    const client = getClient();
    const db = client.db(process.env.DB_NAME);
    const halalActivityCollection = db.collection('halalActivities');

    const url = `${process.env.HOTELBEDS_API_ENDPOINT}activity-api/3.0/activities/availability`;
    const successMessage = 'Fetched activities information successfully';
    const errorMessage = 'Failed to fetch activities';

    const data = createActivityData(destination, adult, child, departure, arrival);
    const response = await postData(url, data, successMessage, errorMessage);

    if (!response.success) {
      return {
        success: false,
        error: 'An error occurred while searching activities.',
      };
    }

    const activitiesData = response.data.activities;
    const activitiesDataObj = activitiesData.reduce((acc, activity) => {
      acc[activity.content.activityCode] = activity;
      return acc;
    }, {});
    // console.log(JSON.stringify(activitiesDataObj));
    console.log('total activities content return hotelbeds:', activitiesData.length);
    const halalActivitiesData = await halalActivityCollection.find().toArray();
    const halalActivitiesDataObj = halalActivitiesData.reduce((obj, hotel) => {
      obj[hotel.code] = {
        code: hotel.code,
        halalRating: hotel.star_rating,
      };
      return obj;
    }, {});
    const halalActivitiesDataCodes = Object.keys(halalActivitiesDataObj);
    console.log(JSON.stringify(halalActivitiesDataCodes, null, 2));

    // Filter activity codes to include only those present in activitiesDataMapping and halalActivitiesDataCodes
    const finalActivityCodes = halalActivitiesDataCodes.filter((code) =>
      activitiesDataObj.hasOwnProperty(code)
    );

    const page = parseInt(req.page, 10) || 1;
    const pageSize = parseInt(req.pageSize, 10) || 100;

    const totalActivities = finalActivityCodes.length;

    if (totalActivities == 0) {
      return {
        success: false,
        error: 'Activities not found',
      };
    }

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

    // Retrieve paginated activities data with halalRating
    const paginatedActivitiesData = paginatedData.map((code) => {
      const activityData = activitiesDataObj[code];
      if (halalActivitiesDataObj[code] && halalActivitiesDataObj[code].halalRating) {
        activityData.halalRating = halalActivitiesDataObj[code].halalRating;
      }
      return activityData;
    });
    const setResult = await setCacheData(uniqueSearchId, paginatedActivitiesData);
    return {
      success: true,
      searchId: uniqueSearchId,
      totalActivities,
      data: paginatedActivitiesData,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: 'An error occurred while searching activities.',
    };
  }
};
const searchFilterActivities = async (req) => {
  try {

    const searchId = req.searchId;
    const minHalalRating = parseInt(req.halalRating) || null;
    const activityCacheDataRes = await getCacheData(searchId);
    if (!activityCacheDataRes.success) {
      return {
        success: false,
        error: 'Data not found in cache'
      }
    }
    const activityCacheData = activityCacheDataRes.cache;

    const filteredActivities = activityCacheData.filter(hotel => {
      const meetsHalalRating = minHalalRating === null || hotel.halalRating >= minHalalRating;
      console.log(`meetsHalalRating=${meetsHalalRating}`);
      return meetsHalalRating;
    });

    const totalActivities = filteredActivities.length;
    if (totalActivities == 0) {
      return {
        success: false,
        message: 'Please change the filter parameter'
      }
    }
    const page = req.page;
    const pageNumber = parseInt(page, 10) || 1;
    const pageSize = parseInt(req.pageSize, 10) || 100;
    const offset = (pageNumber - 1) * pageSize;
    const limit = pageSize;

    const paginatedData = filteredActivities.slice(offset, offset + limit);

    return {
      success: true,
      searchId,
      totalActivities,
      data: paginatedData,
    }

  } catch (err) {
    console.error(err);
    return {
      success: false,
      error: 'Internal server error'
    }
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

const searchActivitiesDetails = async (code, adult, child, departure, arrival, req) => {
  try {

    const client = getClient();
    const db = client.db(process.env.DB_NAME);
    const halalActivityCollection = db.collection('halalActivities');
    const halalActivity = await halalActivityCollection.findOne({ code });
    const url = `${process.env.HOTELBEDS_API_ENDPOINT}activity-api/3.0/activities/details/full`;

    const successMessage = 'Fetched activities information successfully';
    const errorMessage = 'Failed to fetch activities';

    const data = activityData(code, adult, child, departure, arrival);
    console.log(data);
    const response = await postData(url, data, successMessage, errorMessage);

    if (!response.success) {
      return {
        success: false,
        error: 'An error occurred while searching activities.',
      };
    }
    if (halalActivity && response.data) {
      return {
        success: true,
        message: 'Activity information retrieved successfully',
        data: response.data.activity,
        halalData: halalActivity,
      };
    }
    return {
      success: false,
      message: 'No halal Activity found with the specified ID',
      error: 'Activity not found',
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
  const client = getClient();
  const db = client.db(process.env.DB_NAME);
  const activityCollection = db.collection('activityDestination');

  const url = `${process.env.HOTELBEDS_API_ENDPOINT}/activity-content-api/3.0/destinations/en/${country}`;
  const successMessage = 'Fetch destinations information successfully';
  const errorMessage = 'Failed to fetch destinations';

  const response = await fetchData(url, successMessage, errorMessage);

  if (!response.success) {
    return response;
  }

  const modifiedData = response.data.country.destinations.map(item => ({
    code: item.code,
    name: item.name,

  }));
  try {
    const insertedData = [];
    const existingItems = await activityCollection.find({ code: { $in: modifiedData.map(item => item.code) } }).toArray();

    for (const item of modifiedData) {
      const existingItem = existingItems.find(existing => existing.code === item.code);

      if (existingItem) {
        insertedData.push(existingItem);
      } else {
        await activityCollection.insertOne(item);
        insertedData.push(item);
      }
    }

    return {
      success: true,
      message: successMessage,
      data: insertedData,
    };
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    return {
      success: false,
      message: errorMessage,
      data: [],
    };
  }
};
const createNameIndexIfNotExists = async (collection) => {
  const indexExists = await collection.indexExists('name_text');
  if (!indexExists) {
    await collection.createIndex({ name: 'text' },
      { default_language: 'english', language_override: 'english' }

    );
  }
};
const searchDestination = async (keyword, offset = 0, limit = 10) => {
  try {
    const client = getClient();
    const db = client.db(process.env.DB_NAME);
    const terminalsCollection = db.collection('activityDestination');

    const query = { name: { $regex: keyword, $options: 'i' } };
    const projection = { _id: 0, code: 1, name: 1 };
    const cursor = await terminalsCollection.find(query, { projection }).skip(offset).limit(limit).toArray();

    return {
      success: true,
      message: 'Search successful',
      data: cursor,
    };
  } catch (error) {
    console.error('Failed to perform search:', error);
    return {
      success: false,
      message: 'Internal server error',
      data: [],
    };
  }
};


// const searchDestination = async (keyword, offset = 0, limit = 10) => {
//   try {
//     const client = getClient();
//     const db = client.db(process.env.DB_NAME);
//     const terminalsCollection = db.collection('activityDestination');

//     await createNameIndexIfNotExists(terminalsCollection);

//     const query = { $text: { $search: keyword } };
//     const projection = { _id: 0, code: 1, name: 1 };
//     const cursor = await terminalsCollection.find(query, { projection }).skip(offset).limit(limit).toArray();

//     return {
//       success: true,
//       message: 'Search successful',
//       data: cursor,
//     };
//   } catch (error) {
//     console.error('Failed to perform search:', error);
//     return {
//       success: false,
//       message: 'Internal server error',
//       data: [],
//     };
//   }
// };
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
    const halalCollection = db.collection(process.env.HALAL_ACTIVITIES_COLLECTION);
    const halalActivitiesData = await halalCollection.find().toArray();
    const halalActivitiesDataObj = halalActivitiesData.reduce((acc, item) => {
      acc[item.code] = item;
      return acc;
    }, {});


    activityData.forEach(data => {
      if (halalActivitiesDataObj[data.activityCode]) {
        data.halalRatingInfo = halalActivitiesDataObj[data.activityCode];
      }
    });
    // console.log(JSON.stringify(activityData));

    const page = req.page;
    const pageNumber = parseInt(page, 10) || 1;
    const pageSize = parseInt(req.pageSize, 10) || 100;
    const totalActivity = activityData.length;

    if (totalActivity == 0) {
      return {
        success: false,
        error: 'Activities not found',
      };
    }
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
  searchActivitiesDetails,
  searchDestination,
  searchFilterActivities,
};
