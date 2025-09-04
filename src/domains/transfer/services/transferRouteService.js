const TransferRoute = require('../models/TransferRoute');
const axios = require('axios');
const crypto = require('crypto');

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
  };
};

/**
 * Fetch data from HotelBeds API
 */
const fetchHotelBedsData = async (url, successMessage, errorMessage) => {
  const headers = createHeaders();

  try {
    const response = await axios.get(url, { headers });

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
 * Get routes from HotelBeds API and store in database
 */
const getRoutes = async (params) => {
  try {
    const { fields = 'ALL', destinationCode, offset = 0, limit = 10 } = params;
    const url = `${process.env.HOTELBEDS_API_ENDPOINT}/transfer-cache-api/1.0/routes?fields=${fields}&destinationCode=${destinationCode}&offset=${offset}&limit=${limit}`;
    
    const response = await fetchHotelBedsData(url, 'Fetch routes information successfully', 'Failed to fetch routes');
    
    if (!response.success) {
      return response;
    }

    // Store routes in database
    const routes = response.data.map(item => ({
      routeId: item.id,
      destinationCode: destinationCode,
      fromLocation: {
        code: item.from.code,
        name: item.from.description,
        type: item.from.type
      },
      toLocation: {
        code: item.to.code,
        name: item.to.description,
        type: item.to.type
      },
      hotelBedsData: item,
      lastUpdated: new Date()
    }));

    // Upsert routes
    for (const route of routes) {
      await TransferRoute.findOneAndUpdate(
        { routeId: route.routeId },
        route,
        { upsert: true, new: true }
      );
    }

    return {
      success: true,
      message: 'Routes retrieved and stored successfully',
      data: routes
    };
  } catch (error) {
    throw new Error(`Failed to get routes: ${error.message}`);
  }
};

/**
 * Get route by ID
 */
const getRouteById = async (routeId) => {
  try {
    const route = await TransferRoute.findOne({ routeId });
    
    if (!route) {
      throw new Error('Route not found');
    }

    return {
      success: true,
      message: 'Route retrieved successfully',
      data: route
    };
  } catch (error) {
    throw new Error(`Failed to get route: ${error.message}`);
  }
};

/**
 * Get routes by destination
 */
const getRoutesByDestination = async (destinationCode, limit = 10, offset = 0) => {
  try {
    const routes = await TransferRoute.find({ destinationCode })
      .select('routeId fromLocation toLocation')
      .limit(limit)
      .skip(offset)
      .sort({ createdAt: -1 });

    return {
      success: true,
      message: 'Routes retrieved successfully',
      data: routes
    };
  } catch (error) {
    throw new Error(`Failed to get routes: ${error.message}`);
  }
};

/**
 * Search routes by location
 */
const searchRoutesByLocation = async (locationCode, locationType = 'from', limit = 10) => {
  try {
    const query = {};
    if (locationType === 'from') {
      query['fromLocation.code'] = locationCode;
    } else if (locationType === 'to') {
      query['toLocation.code'] = locationCode;
    } else {
      query.$or = [
        { 'fromLocation.code': locationCode },
        { 'toLocation.code': locationCode }
      ];
    }

    const routes = await TransferRoute.find(query)
      .select('routeId fromLocation toLocation destinationCode')
      .limit(limit)
      .sort({ createdAt: -1 });

    return {
      success: true,
      message: 'Routes found successfully',
      data: routes
    };
  } catch (error) {
    throw new Error(`Failed to search routes: ${error.message}`);
  }
};

/**
 * Get all routes with pagination
 */
const getAllRoutes = async (limit = 10, offset = 0) => {
  try {
    const routes = await TransferRoute.find()
      .select('routeId fromLocation toLocation destinationCode')
      .limit(limit)
      .skip(offset)
      .sort({ createdAt: -1 });

    const total = await TransferRoute.countDocuments();

    return {
      success: true,
      message: 'Routes retrieved successfully',
      data: {
        routes,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total
        }
      }
    };
  } catch (error) {
    throw new Error(`Failed to get routes: ${error.message}`);
  }
};

/**
 * Delete route by ID
 */
const deleteRoute = async (routeId) => {
  try {
    const route = await TransferRoute.findOneAndDelete({ routeId });
    
    if (!route) {
      throw new Error('Route not found');
    }

    return {
      success: true,
      message: 'Route deleted successfully',
      data: route
    };
  } catch (error) {
    throw new Error(`Failed to delete route: ${error.message}`);
  }
};

/**
 * Update route last updated timestamp
 */
const updateRouteTimestamp = async (routeId) => {
  try {
    const route = await TransferRoute.findOneAndUpdate(
      { routeId },
      { lastUpdated: new Date() },
      { new: true }
    );
    
    if (!route) {
      throw new Error('Route not found');
    }

    return {
      success: true,
      message: 'Route timestamp updated successfully',
      data: route
    };
  } catch (error) {
    throw new Error(`Failed to update route timestamp: ${error.message}`);
  }
};

module.exports = {
  getRoutes,
  getRouteById,
  getRoutesByDestination,
  searchRoutesByLocation,
  getAllRoutes,
  deleteRoute,
  updateRouteTimestamp
};
