const TransferLocation = require('../models/TransferLocation');
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
 * Get countries from HotelBeds API and store in database
 */
const getCountries = async (params) => {
  try {
    const { fields = 'ALL', language = 'en', codes = '', offset = 0, limit = 10 } = params;
    const url = `${process.env.HOTELBEDS_API_ENDPOINT}/transfer-cache-api/1.0/locations/countries?fields=${fields}&language=${language}&codes=${codes}&offset=${offset}&limit=${limit}`;
    
    const response = await fetchHotelBedsData(url, 'Fetch countries information successfully', 'Failed to fetch countries');
    
    if (!response.success) {
      return response;
    }

    // Store countries in database
    const countries = response.data.map(item => ({
      code: item.code,
      name: item.name,
      type: 'country',
      content: item,
      language,
      lastUpdated: new Date()
    }));

    // Upsert countries
    for (const country of countries) {
      await TransferLocation.findOneAndUpdate(
        { code: country.code, type: 'country' },
        country,
        { upsert: true, new: true }
      );
    }

    return {
      success: true,
      message: 'Countries retrieved and stored successfully',
      data: countries
    };
  } catch (error) {
    throw new Error(`Failed to get countries: ${error.message}`);
  }
};

/**
 * Get destinations from HotelBeds API and store in database
 */
const getDestinations = async (params) => {
  try {
    const { fields = 'ALL', language = 'en', countryCode = '', codes = '', offset = 0, limit = 10 } = params;
    const url = `${process.env.HOTELBEDS_API_ENDPOINT}/transfer-cache-api/1.0/locations/destinations?fields=${fields}&language=${language}&countryCode=${countryCode}&codes=${codes}&offset=${offset}&limit=${limit}`;
    
    const response = await fetchHotelBedsData(url, 'Fetch destinations information successfully', 'Failed to fetch destinations');
    
    if (!response.success) {
      return response;
    }

    // Store destinations in database
    const destinations = response.data.map(item => ({
      code: item.code,
      name: item.name,
      type: 'destination',
      countryCode: item.countryCode,
      content: item,
      language,
      lastUpdated: new Date()
    }));

    // Upsert destinations
    for (const destination of destinations) {
      await TransferLocation.findOneAndUpdate(
        { code: destination.code, type: 'destination' },
        destination,
        { upsert: true, new: true }
      );
    }

    return {
      success: true,
      message: 'Destinations retrieved and stored successfully',
      data: destinations
    };
  } catch (error) {
    throw new Error(`Failed to get destinations: ${error.message}`);
  }
};

/**
 * Get terminals from HotelBeds API and store in database
 */
const getTerminals = async (params) => {
  try {
    const { fields = 'ALL', language = 'en', countryCode = '', codes = '', offset = 0, limit = 10 } = params;
    const url = `${process.env.HOTELBEDS_API_ENDPOINT}/transfer-cache-api/1.0/locations/terminals?fields=${fields}&language=${language}&countryCode=${countryCode}&codes=${codes}&offset=${offset}&limit=${limit}`;
    
    const response = await fetchHotelBedsData(url, 'Fetch terminals information successfully', 'Failed to fetch terminals');
    
    if (!response.success) {
      return response;
    }

    // Store terminals in database
    const terminals = response.data.map(item => ({
      code: item.code,
      name: item.content.description,
      type: 'terminal',
      countryCode: item.countryCode,
      coordinates: item.coordinates,
      content: item,
      language,
      lastUpdated: new Date()
    }));

    // Upsert terminals
    for (const terminal of terminals) {
      await TransferLocation.findOneAndUpdate(
        { code: terminal.code, type: 'terminal' },
        terminal,
        { upsert: true, new: true }
      );
    }

    return {
      success: true,
      message: 'Terminals retrieved and stored successfully',
      data: terminals
    };
  } catch (error) {
    throw new Error(`Failed to get terminals: ${error.message}`);
  }
};

/**
 * Get hotels from HotelBeds API and store in database
 */
const getHotels = async (params) => {
  try {
    const { fields = 'ALL', language = 'en', countryCodes = '', destinationCodes = '', codes = '', giataCodes = '', offset = 1, limit = 10 } = params;
    const url = `${process.env.HOTELBEDS_API_ENDPOINT}/transfer-cache-api/1.0/hotels?fields=${fields}&language=${language}&countryCodes=${countryCodes}&destinationCodes=${destinationCodes}&codes=${codes}&giataCodes=${giataCodes}&offset=${offset}&limit=${limit}`;
    
    const response = await fetchHotelBedsData(url, 'Fetch hotels information successfully', 'Failed to fetch hotels');
    
    if (!response.success) {
      return response;
    }

    // Store hotels in database
    const hotels = response.data.map(item => ({
      code: item.code,
      name: item.name,
      type: 'hotel',
      countryCode: item.countryCode,
      destinationCode: item.destinationCode,
      coordinates: item.coordinates,
      content: item,
      language,
      lastUpdated: new Date()
    }));

    // Upsert hotels
    for (const hotel of hotels) {
      await TransferLocation.findOneAndUpdate(
        { code: hotel.code, type: 'hotel' },
        hotel,
        { upsert: true, new: true }
      );
    }

    return {
      success: true,
      message: 'Hotels retrieved and stored successfully',
      data: hotels
    };
  } catch (error) {
    throw new Error(`Failed to get hotels: ${error.message}`);
  }
};

/**
 * Get pickups from HotelBeds API and store in database
 */
const getPickups = async (params) => {
  try {
    const { fields = 'ALL', language = 'en', codes = '', offset = 1, limit = 10 } = params;
    const url = `${process.env.HOTELBEDS_API_ENDPOINT}/transfer-cache-api/1.0/pickups?fields=${fields}&language=${language}&codes=${codes}&offset=${offset}&limit=${limit}`;
    
    const response = await fetchHotelBedsData(url, 'Fetch pickups information successfully', 'Failed to fetch pickups');
    
    if (!response.success) {
      return response;
    }

    // Store pickups in database
    const pickups = response.data.map(item => ({
      code: item.code,
      name: item.name,
      type: 'pickup',
      content: item,
      language,
      lastUpdated: new Date()
    }));

    // Upsert pickups
    for (const pickup of pickups) {
      await TransferLocation.findOneAndUpdate(
        { code: pickup.code, type: 'pickup' },
        pickup,
        { upsert: true, new: true }
      );
    }

    return {
      success: true,
      message: 'Pickups retrieved and stored successfully',
      data: pickups
    };
  } catch (error) {
    throw new Error(`Failed to get pickups: ${error.message}`);
  }
};

/**
 * Search locations by keyword
 */
const searchLocations = async (keyword, type = null, limit = 10) => {
  try {
    const query = { $text: { $search: keyword } };
    if (type) {
      query.type = type;
    }

    const locations = await TransferLocation.find(query)
      .select('code name type countryCode destinationCode')
      .limit(limit)
      .sort({ score: { $meta: 'textScore' } });

    return {
      success: true,
      message: 'Search successful',
      data: locations
    };
  } catch (error) {
    throw new Error(`Failed to search locations: ${error.message}`);
  }
};

/**
 * Get locations by type
 */
const getLocationsByType = async (type, limit = 10, offset = 0) => {
  try {
    const locations = await TransferLocation.find({ type })
      .select('code name countryCode destinationCode coordinates')
      .limit(limit)
      .skip(offset)
      .sort({ name: 1 });

    return {
      success: true,
      message: `${type} locations retrieved successfully`,
      data: locations
    };
  } catch (error) {
    throw new Error(`Failed to get ${type} locations: ${error.message}`);
  }
};

/**
 * Get location by code and type
 */
const getLocationByCode = async (code, type) => {
  try {
    const location = await TransferLocation.findOne({ code, type });
    
    if (!location) {
      throw new Error('Location not found');
    }

    return {
      success: true,
      message: 'Location retrieved successfully',
      data: location
    };
  } catch (error) {
    throw new Error(`Failed to get location: ${error.message}`);
  }
};

module.exports = {
  getCountries,
  getDestinations,
  getTerminals,
  getHotels,
  getPickups,
  searchLocations,
  getLocationsByType,
  getLocationByCode
};
