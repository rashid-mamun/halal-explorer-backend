const TransferAvailabilityRequest = require('../models/TransferAvailabilityRequest');
const axios = require('axios');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

/**
 * Create HotelBeds API headers
 */
const createHeaders = () => {
  const apiKey = process.env.HOTELBEDS_TRANSFER_API_KEY;
const secret = process.env.HOTELBEDS_TRANSFER_SECRET;
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
    'Content-Type': 'application/json',
  };
};

/**
 * Fetch data from HotelBeds API
 */
const fetchHotelBedsData = async (url, method, data, successMessage, errorMessage) => {
  const headers = createHeaders();

  try {
    const config = {
      method,
      url,
      headers,
      ...(data && { data })
    };

    const response = await axios(config);

    if (response.status === 204) {
      return {
        success: false,
        error: "No content available.",
      };
    }

    if (response.status !== 200) {
      return {
        success: false,
        error: `Request failed with status code ${response.status}`,
      };
    }

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

/**
 * Generate unique request ID
 */
const generateRequestId = () => {
  return `TRANSFER_AVAIL_${uuidv4().replace(/-/g, '').substring(0, 16).toUpperCase()}`;
};

/**
 * Check transfer availability
 */
const checkAvailability = async (params) => {
  try {
    const { language, adults, children, infants, availabilityData } = params;
    
    // Generate unique request ID
    const requestId = generateRequestId();
    
    // Create availability request record
    const availabilityRequest = new TransferAvailabilityRequest({
      requestId,
      language,
      passengers: {
        adults: parseInt(adults),
        children: parseInt(children),
        infants: parseInt(infants)
      },
      availabilityData: availabilityData.map(item => ({
        id: item.id,
        dateTime: new Date(item.dateTime)
      })),
      status: 'pending'
    });

    await availabilityRequest.save();

    // Prepare request payload for HotelBeds API
    const payload = {
      language,
      adults: parseInt(adults),
      children: parseInt(children),
      infants: parseInt(infants),
      availabilityData: availabilityData.map(item => ({
        id: item.id,
        dateTime: item.dateTime
      }))
    };

    // Call HotelBeds API
    const url = `${process.env.HOTELBEDS_API_ENDPOINT}/transfer-api/1.0/availability/routes/${language}/${adults}/${children}/${infants}`;
    const response = await fetchHotelBedsData(
      url,
      'POST',
      payload,
      'Availability checked successfully',
      'Failed to check availability'
    );

    // Update request record with response
    availabilityRequest.hotelBedsResponse = response.data;
    availabilityRequest.status = response.success ? 'success' : 'failed';
    await availabilityRequest.save();

    if (!response.success) {
      return response;
    }

    return {
      success: true,
      message: 'Availability checked successfully',
      data: {
        requestId,
        availability: response.data
      }
    };
  } catch (error) {
    throw new Error(`Failed to check availability: ${error.message}`);
  }
};

/**
 * Get availability request by ID
 */
const getAvailabilityRequest = async (requestId) => {
  try {
    const request = await TransferAvailabilityRequest.findOne({ requestId });
    
    if (!request) {
      throw new Error('Availability request not found');
    }

    return {
      success: true,
      message: 'Availability request retrieved successfully',
      data: request
    };
  } catch (error) {
    throw new Error(`Failed to get availability request: ${error.message}`);
  }
};

/**
 * Get all availability requests with pagination
 */
const getAllAvailabilityRequests = async (limit = 10, offset = 0, status = null) => {
  try {
    const query = {};
    if (status) {
      query.status = status;
    }

    const requests = await TransferAvailabilityRequest.find(query)
      .select('requestId language passengers status createdAt')
      .limit(limit)
      .skip(offset)
      .sort({ createdAt: -1 });

    const total = await TransferAvailabilityRequest.countDocuments(query);

    return {
      success: true,
      message: 'Availability requests retrieved successfully',
      data: {
        requests,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total
        }
      }
    };
  } catch (error) {
    throw new Error(`Failed to get availability requests: ${error.message}`);
  }
};

/**
 * Delete availability request
 */
const deleteAvailabilityRequest = async (requestId) => {
  try {
    const request = await TransferAvailabilityRequest.findOneAndDelete({ requestId });
    
    if (!request) {
      throw new Error('Availability request not found');
    }

    return {
      success: true,
      message: 'Availability request deleted successfully',
      data: request
    };
  } catch (error) {
    throw new Error(`Failed to delete availability request: ${error.message}`);
  }
};

/**
 * Get availability statistics
 */
const getAvailabilityStatistics = async () => {
  try {
    const stats = await TransferAvailabilityRequest.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const total = await TransferAvailabilityRequest.countDocuments();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayCount = await TransferAvailabilityRequest.countDocuments({
      createdAt: { $gte: today }
    });

    return {
      success: true,
      message: 'Statistics retrieved successfully',
      data: {
        total,
        today: todayCount,
        byStatus: stats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {})
      }
    };
  } catch (error) {
    throw new Error(`Failed to get statistics: ${error.message}`);
  }
};

module.exports = {
  checkAvailability,
  getAvailabilityRequest,
  getAllAvailabilityRequests,
  deleteAvailabilityRequest,
  getAvailabilityStatistics
};
