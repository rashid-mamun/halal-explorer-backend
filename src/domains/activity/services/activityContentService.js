const ActivityContent = require('../models/ActivityContent');
const { v4: uuidv4 } = require('uuid');
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

const createActivityContent = async (contentData) => {
  try {
    const activityContent = new ActivityContent(contentData);
    await activityContent.save();
    return activityContent;
  } catch (error) {
    throw new Error(`Failed to create activity content: ${error.message}`);
  }
};

const getActivityContentByCode = async (activityCode) => {
  try {
    const activityContent = await ActivityContent.findOne({ activityCode });
    return activityContent;
  } catch (error) {
    throw new Error(`Failed to get activity content: ${error.message}`);
  }
};

const getAllActivityContent = async (page = 1, pageSize = 100) => {
  try {
    const skip = (page - 1) * pageSize;
    const activityContents = await ActivityContent.find()
      .skip(skip)
      .limit(pageSize)
      .sort({ lastUpdated: -1 });
    
    const total = await ActivityContent.countDocuments();
    
    return {
      data: activityContents,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  } catch (error) {
    throw new Error(`Failed to get all activity content: ${error.message}`);
  }
};

const updateActivityContent = async (activityCode, updateData) => {
  try {
    const activityContent = await ActivityContent.findOneAndUpdate(
      { activityCode },
      { ...updateData, lastUpdated: new Date() },
      { new: true, upsert: true }
    );
    return activityContent;
  } catch (error) {
    throw new Error(`Failed to update activity content: ${error.message}`);
  }
};

const deleteActivityContent = async (activityCode) => {
  try {
    const activityContent = await ActivityContent.findOneAndDelete({ activityCode });
    return activityContent;
  } catch (error) {
    throw new Error(`Failed to delete activity content: ${error.message}`);
  }
};

const searchActivityContent = async (searchParams) => {
  try {
    const { keyword, category, segment, page = 1, pageSize = 100 } = searchParams;
    const skip = (page - 1) * pageSize;
    
    let query = {};
    
    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { address: { $regex: keyword, $options: 'i' } }
      ];
    }
    
    if (category) {
      query['categories.code'] = category;
    }
    
    if (segment) {
      query['segments.code'] = segment;
    }
    
    const activityContents = await ActivityContent.find(query)
      .skip(skip)
      .limit(pageSize)
      .sort({ lastUpdated: -1 });
    
    const total = await ActivityContent.countDocuments(query);
    
    return {
      data: activityContents,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  } catch (error) {
    throw new Error(`Failed to search activity content: ${error.message}`);
  }
};

const fetchActivityContentFromHotelBeds = async (activityCodes, address) => {
  try {
    const url = `${process.env.HOTELBEDS_API_ENDPOINT}/activity-content-api/3.0/activities`;
    const data = {
      language: 'en',
      codes: activityCodes.map(code => ({ activityCode: code }))
    };

    const response = await postData(
      url, 
      data, 
      'Activity content fetched successfully', 
      'Failed to fetch activity content'
    );

    if (!response.success) {
      return response;
    }

    const activitiesContent = response.data.activitiesContent || [];
    const bulkOperations = [];

    for (const activity of activitiesContent) {
      const activityData = {
        ...activity,
        address: address,
        lastUpdated: new Date()
      };

      bulkOperations.push({
        updateOne: {
          filter: { activityCode: activity.activityCode },
          update: { $set: activityData },
          upsert: true
        }
      });
    }

    if (bulkOperations.length > 0) {
      await ActivityContent.bulkWrite(bulkOperations);
    }

    return {
      success: true,
      message: 'Activity content saved/updated successfully',
      data: activitiesContent
    };
  } catch (error) {
    throw new Error(`Failed to fetch activity content from HotelBeds: ${error.message}`);
  }
};

const getPortfolioData = async (destination, offset = 1, limit = 1000) => {
  try {
    const url = `${process.env.HOTELBEDS_API_ENDPOINT}activity-cache-api/1.0/portfolio?destination=${destination}&offset=${offset}&limit=${limit}`;
    const headers = createHeaders();
    
    const response = await axios.get(url, { headers });
    
    if (!response.data) {
      return {
        success: false,
        error: "Unable to fetch portfolio data. Please try again later.",
      };
    }

    return {
      success: true,
      message: 'Portfolio data fetched successfully',
      data: response.data,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: 'Failed to fetch portfolio data',
    };
  }
};

const getPortfolioAvailability = async (destination, offset = 1, limit = 1000) => {
  try {
    const url = `${process.env.HOTELBEDS_API_ENDPOINT}activity-cache-api/1.0/avail?destination=${destination}&offset=${offset}&limit=${limit}`;
    const headers = createHeaders();
    
    const response = await axios.get(url, { headers });
    
    if (!response.data) {
      return {
        success: false,
        error: "Unable to fetch portfolio availability. Please try again later.",
      };
    }

    return {
      success: true,
      message: 'Portfolio availability fetched successfully',
      data: response.data,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: 'Failed to fetch portfolio availability',
    };
  }
};

module.exports = {
  createActivityContent,
  getActivityContentByCode,
  getAllActivityContent,
  updateActivityContent,
  deleteActivityContent,
  searchActivityContent,
  fetchActivityContentFromHotelBeds,
  getPortfolioData,
  getPortfolioAvailability
};
