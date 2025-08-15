const ActivityMasterData = require('../models/ActivityMasterData');
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

const getOrCreateMasterData = async () => {
  try {
    let masterData = await ActivityMasterData.findOne();
    if (!masterData) {
      masterData = new ActivityMasterData({
        countries: [],
        destinations: [],
        currencies: [],
        segments: [],
        languages: [],
        destinationHotels: []
      });
      await masterData.save();
    }
    return masterData;
  } catch (error) {
    throw new Error(`Failed to get or create master data: ${error.message}`);
  }
};

const updateMasterData = async (updateData) => {
  try {
    const masterData = await getOrCreateMasterData();
    Object.assign(masterData, updateData, { lastUpdated: new Date() });
    await masterData.save();
    return masterData;
  } catch (error) {
    throw new Error(`Failed to update master data: ${error.message}`);
  }
};

const fetchCountries = async () => {
  try {
    const url = `${process.env.HOTELBEDS_API_ENDPOINT}/activity-content-api/3.0/countries/en`;
    const response = await fetchData(url, 'Countries fetched successfully', 'Failed to fetch countries');
    
    if (response.success) {
      const countries = response.data.countries || [];
      const masterData = await getOrCreateMasterData();
      masterData.countries = countries;
      masterData.lastUpdated = new Date();
      await masterData.save();
      
      return {
        success: true,
        message: 'Countries updated successfully',
        data: countries
      };
    }
    
    return response;
  } catch (error) {
    throw new Error(`Failed to fetch countries: ${error.message}`);
  }
};

const fetchDestinations = async (countryCode) => {
  try {
    const url = `${process.env.HOTELBEDS_API_ENDPOINT}/activity-content-api/3.0/destinations/en/${countryCode}`;
    const response = await fetchData(url, 'Destinations fetched successfully', 'Failed to fetch destinations');
    
    if (response.success) {
      const destinations = response.data.country?.destinations || [];
      const masterData = await getOrCreateMasterData();
      
      // Update destinations for the specific country
      const existingDestinations = masterData.destinations.filter(d => d.countryCode !== countryCode);
      const newDestinations = destinations.map(dest => ({
        code: dest.code,
        name: dest.name,
        countryCode: countryCode
      }));
      
      masterData.destinations = [...existingDestinations, ...newDestinations];
      masterData.lastUpdated = new Date();
      await masterData.save();
      
      return {
        success: true,
        message: 'Destinations updated successfully',
        data: newDestinations
      };
    }
    
    return response;
  } catch (error) {
    throw new Error(`Failed to fetch destinations: ${error.message}`);
  }
};

const fetchCurrencies = async () => {
  try {
    const url = `${process.env.HOTELBEDS_API_ENDPOINT}/activity-content-api/3.0/currencies/en`;
    const response = await fetchData(url, 'Currencies fetched successfully', 'Failed to fetch currencies');
    
    if (response.success) {
      const currencies = response.data.currencies || [];
      const masterData = await getOrCreateMasterData();
      masterData.currencies = currencies;
      masterData.lastUpdated = new Date();
      await masterData.save();
      
      return {
        success: true,
        message: 'Currencies updated successfully',
        data: currencies
      };
    }
    
    return response;
  } catch (error) {
    throw new Error(`Failed to fetch currencies: ${error.message}`);
  }
};

const fetchSegments = async () => {
  try {
    const url = `${process.env.HOTELBEDS_API_ENDPOINT}/activity-content-api/3.0/segments/en`;
    const response = await fetchData(url, 'Segments fetched successfully', 'Failed to fetch segments');
    
    if (response.success) {
      const segments = response.data.segments || [];
      const masterData = await getOrCreateMasterData();
      masterData.segments = segments;
      masterData.lastUpdated = new Date();
      await masterData.save();
      
      return {
        success: true,
        message: 'Segments updated successfully',
        data: segments
      };
    }
    
    return response;
  } catch (error) {
    throw new Error(`Failed to fetch segments: ${error.message}`);
  }
};

const fetchLanguages = async () => {
  try {
    const url = `${process.env.HOTELBEDS_API_ENDPOINT}/activity-content-api/3.0/languages`;
    const response = await fetchData(url, 'Languages fetched successfully', 'Failed to fetch languages');
    
    if (response.success) {
      const languages = response.data.languages || [];
      const masterData = await getOrCreateMasterData();
      masterData.languages = languages;
      masterData.lastUpdated = new Date();
      await masterData.save();
      
      return {
        success: true,
        message: 'Languages updated successfully',
        data: languages
      };
    }
    
    return response;
  } catch (error) {
    throw new Error(`Failed to fetch languages: ${error.message}`);
  }
};

const fetchDestinationHotels = async (destinationCode) => {
  try {
    const url = `${process.env.HOTELBEDS_API_ENDPOINT}/activity-content-api/3.0/hotels/en/${destinationCode}`;
    const response = await fetchData(url, 'Destination hotels fetched successfully', 'Failed to fetch destination hotels');
    
    if (response.success) {
      const hotels = response.data.hotels || [];
      const masterData = await getOrCreateMasterData();
      
      // Update hotels for the specific destination
      const existingHotels = masterData.destinationHotels.filter(dh => dh.destinationCode !== destinationCode);
      const newDestinationHotels = {
        destinationCode,
        hotels: hotels
      };
      
      masterData.destinationHotels = [...existingHotels, newDestinationHotels];
      masterData.lastUpdated = new Date();
      await masterData.save();
      
      return {
        success: true,
        message: 'Destination hotels updated successfully',
        data: hotels
      };
    }
    
    return response;
  } catch (error) {
    throw new Error(`Failed to fetch destination hotels: ${error.message}`);
  }
};

const searchDestinations = async (keyword, offset = 0, limit = 10) => {
  try {
    const masterData = await getOrCreateMasterData();
    const query = { name: { $regex: keyword, $options: 'i' } };
    
    const destinations = masterData.destinations.filter(dest => 
      dest.name.toLowerCase().includes(keyword.toLowerCase())
    );
    
    const paginatedDestinations = destinations.slice(offset, offset + limit);
    
    return {
      success: true,
      message: 'Search successful',
      data: paginatedDestinations,
      total: destinations.length
    };
  } catch (error) {
    throw new Error(`Failed to search destinations: ${error.message}`);
  }
};

const getAllMasterData = async () => {
  try {
    const masterData = await getOrCreateMasterData();
    return {
      success: true,
      message: 'Master data retrieved successfully',
      data: masterData
    };
  } catch (error) {
    throw new Error(`Failed to get master data: ${error.message}`);
  }
};

const syncAllMasterData = async () => {
  try {
    await fetchCountries();
    await fetchCurrencies();
    await fetchSegments();
    await fetchLanguages();
    
    return {
      success: true,
      message: 'All master data synchronized successfully'
    };
  } catch (error) {
    throw new Error(`Failed to sync master data: ${error.message}`);
  }
};

module.exports = {
  getOrCreateMasterData,
  updateMasterData,
  fetchCountries,
  fetchDestinations,
  fetchCurrencies,
  fetchSegments,
  fetchLanguages,
  fetchDestinationHotels,
  searchDestinations,
  getAllMasterData,
  syncAllMasterData
};
