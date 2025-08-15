const ActivityAvailabilityRequest = require('../models/ActivityAvailabilityRequest');
const HalalActivityRating = require('../models/HalalActivityRating');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const crypto = require('crypto');
const { setCacheData, getCacheData } = require('../../../shared/utils/nodeCache');

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

const createAvailabilityRequest = async (requestData) => {
  try {
    const requestId = uuidv4();
    const availabilityRequest = new ActivityAvailabilityRequest({
      requestId,
      ...requestData,
      status: 'pending'
    });
    await availabilityRequest.save();
    return availabilityRequest;
  } catch (error) {
    throw new Error(`Failed to create availability request: ${error.message}`);
  }
};

const searchActivities = async (destination, adult, child, departure, arrival, req) => {
  try {
    const uniqueSearchId = uuidv4();
    
    // Create availability request record
    const requestData = {
      destination,
      passengers: { adults: adult, children: child },
      dates: { from: new Date(departure), to: new Date(arrival) },
      language: 'en',
      filters: [{ type: 'destination', value: destination }]
    };
    
    await createAvailabilityRequest(requestData);

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

    console.log('total activities content return hotelbeds:', activitiesData.length);
    
    // Get halal activities data
    const halalActivitiesData = await HalalActivityRating.find({ isStructure: false });
    const halalActivitiesDataObj = halalActivitiesData.reduce((obj, activity) => {
      obj[activity.code] = {
        code: activity.code,
        halalRating: activity.starRating,
      };
      return obj;
    }, {});
    
    const halalActivitiesDataCodes = Object.keys(halalActivitiesDataObj);
    console.log(JSON.stringify(halalActivitiesDataCodes, null, 2));

    // Filter activity codes to include only those present in activitiesDataObj and halalActivitiesDataCodes
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

    const filteredActivities = activityCacheData.filter(activity => {
      const meetsHalalRating = minHalalRating === null || activity.halalRating >= minHalalRating;
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

const searchActivitiesDetails = async (code, adult, child, departure, arrival, req) => {
  try {
    const halalActivity = await HalalActivityRating.findOne({ code, isStructure: false });
    const url = `${process.env.HOTELBEDS_API_ENDPOINT}activity-api/3.0/activities/details/full`;

    const successMessage = 'Fetched activities information successfully';
    const errorMessage = 'Failed to fetch activities';

    const data = {
      code,
      from: departure,
      to: arrival,
      language: 'en',
      paxes: [
        ...Array(adult).fill().map(() => ({ age: 30 })),
        ...Array(child).fill().map(() => ({ age: 5 }))
      ],
      pagination: {
        itemsPerPage: 100,
        page: 1,
      },
      order: 'DEFAULT',
    };
    
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

const getAvailabilityRequestById = async (requestId) => {
  try {
    const availabilityRequest = await ActivityAvailabilityRequest.findOne({ requestId });
    return availabilityRequest;
  } catch (error) {
    throw new Error(`Failed to get availability request: ${error.message}`);
  }
};

const getAllAvailabilityRequests = async (page = 1, pageSize = 100) => {
  try {
    const skip = (page - 1) * pageSize;
    const availabilityRequests = await ActivityAvailabilityRequest.find()
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 });
    
    const total = await ActivityAvailabilityRequest.countDocuments();
    
    return {
      data: availabilityRequests,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  } catch (error) {
    throw new Error(`Failed to get all availability requests: ${error.message}`);
  }
};

const updateAvailabilityRequestStatus = async (requestId, status) => {
  try {
    const availabilityRequest = await ActivityAvailabilityRequest.findOneAndUpdate(
      { requestId },
      { status },
      { new: true }
    );
    return availabilityRequest;
  } catch (error) {
    throw new Error(`Failed to update availability request status: ${error.message}`);
  }
};

const deleteAvailabilityRequest = async (requestId) => {
  try {
    const availabilityRequest = await ActivityAvailabilityRequest.findOneAndDelete({ requestId });
    return availabilityRequest;
  } catch (error) {
    throw new Error(`Failed to delete availability request: ${error.message}`);
  }
};

module.exports = {
  createAvailabilityRequest,
  searchActivities,
  searchFilterActivities,
  searchActivitiesDetails,
  getAvailabilityRequestById,
  getAllAvailabilityRequests,
  updateAvailabilityRequestStatus,
  deleteAvailabilityRequest
};
