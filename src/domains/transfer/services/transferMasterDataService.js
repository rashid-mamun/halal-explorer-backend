const TransferMasterData = require('../models/TransferMasterData');
const axios = require('axios');
const crypto = require('crypto');

/**
 * Create HotelBeds API headers
 */
const createHeaders = () => {
  const apiKey = process.env.HOTELBEDS_TRANSFERS_API_KEY;
  const secret = process.env.HOTELBEDS_TRANSFERS_SECRET;
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
 * Get or create master data document
 */
const getOrCreateMasterData = async () => {
  try {
    let masterData = await TransferMasterData.findOne();
    
    if (!masterData) {
      masterData = new TransferMasterData({
        categories: [],
        vehicles: [],
        transferTypes: [],
        currencies: []
      });
      await masterData.save();
    }
    
    return masterData;
  } catch (error) {
    throw new Error(`Failed to get or create master data: ${error.message}`);
  }
};

/**
 * Get categories from HotelBeds API and store in database
 */
const getCategories = async (params) => {
  try {
    const { fields = 'ALL', language = 'en', codes = '', offset = 0, limit = 10 } = params;
    const url = `${process.env.HOTELBEDS_API_ENDPOINT}/transfer-cache-api/1.0/masters/categories?fields=${fields}&language=${language}&codes=${codes}&offset=${offset}&limit=${limit}`;
    
    const response = await fetchHotelBedsData(url, 'Fetch categories information successfully', 'Failed to fetch categories');
    
    if (!response.success) {
      return response;
    }

    // Update master data with new categories
    const masterData = await getOrCreateMasterData();
    masterData.categories = response.data.map(item => ({
      code: item.code,
      name: item.name,
      description: item.description
    }));
    masterData.lastUpdated = new Date();
    await masterData.save();

    return {
      success: true,
      message: 'Categories retrieved and stored successfully',
      data: masterData.categories
    };
  } catch (error) {
    throw new Error(`Failed to get categories: ${error.message}`);
  }
};

/**
 * Get vehicles from HotelBeds API and store in database
 */
const getVehicles = async (params) => {
  try {
    const { fields = 'ALL', language = 'en', codes = '', offset = 0, limit = 10 } = params;
    const url = `${process.env.HOTELBEDS_API_ENDPOINT}/transfer-cache-api/1.0/masters/vehicles?fields=${fields}&language=${language}&codes=${codes}&offset=${offset}&limit=${limit}`;
    
    const response = await fetchHotelBedsData(url, 'Fetch vehicles information successfully', 'Failed to fetch vehicles');
    
    if (!response.success) {
      return response;
    }

    // Update master data with new vehicles
    const masterData = await getOrCreateMasterData();
    masterData.vehicles = response.data.map(item => ({
      code: item.code,
      name: item.name,
      description: item.description,
      capacity: item.capacity
    }));
    masterData.lastUpdated = new Date();
    await masterData.save();

    return {
      success: true,
      message: 'Vehicles retrieved and stored successfully',
      data: masterData.vehicles
    };
  } catch (error) {
    throw new Error(`Failed to get vehicles: ${error.message}`);
  }
};

/**
 * Get transfer types from HotelBeds API and store in database
 */
const getTransferTypes = async (params) => {
  try {
    const { fields = 'ALL', language = 'en', codes = '', offset = 0, limit = 10 } = params;
    const url = `${process.env.HOTELBEDS_API_ENDPOINT}/transfer-cache-api/1.0/masters/transferTypes?fields=${fields}&language=${language}&codes=${codes}&offset=${offset}&limit=${limit}`;
    
    const response = await fetchHotelBedsData(url, 'Fetch transfer types information successfully', 'Failed to fetch transfer types');
    
    if (!response.success) {
      return response;
    }

    // Update master data with new transfer types
    const masterData = await getOrCreateMasterData();
    masterData.transferTypes = response.data.map(item => ({
      code: item.code,
      name: item.name,
      description: item.description
    }));
    masterData.lastUpdated = new Date();
    await masterData.save();

    return {
      success: true,
      message: 'Transfer types retrieved and stored successfully',
      data: masterData.transferTypes
    };
  } catch (error) {
    throw new Error(`Failed to get transfer types: ${error.message}`);
  }
};

/**
 * Get currencies from HotelBeds API and store in database
 */
const getCurrencies = async (params) => {
  try {
    const { fields = 'ALL', language = 'en', codes = '', offset = 0, limit = 10 } = params;
    const url = `${process.env.HOTELBEDS_API_ENDPOINT}/transfer-cache-api/1.0/currencies?fields=${fields}&language=${language}&codes=${codes}&offset=${offset}&limit=${limit}`;
    
    const response = await fetchHotelBedsData(url, 'Fetch currencies information successfully', 'Failed to fetch currencies');
    
    if (!response.success) {
      return response;
    }

    // Update master data with new currencies
    const masterData = await getOrCreateMasterData();
    masterData.currencies = response.data.map(item => ({
      code: item.code,
      name: item.name,
      symbol: item.symbol
    }));
    masterData.lastUpdated = new Date();
    await masterData.save();

    return {
      success: true,
      message: 'Currencies retrieved and stored successfully',
      data: masterData.currencies
    };
  } catch (error) {
    throw new Error(`Failed to get currencies: ${error.message}`);
  }
};

/**
 * Get all master data
 */
const getAllMasterData = async () => {
  try {
    const masterData = await getOrCreateMasterData();
    
    return {
      success: true,
      message: 'Master data retrieved successfully',
      data: {
        categories: masterData.categories,
        vehicles: masterData.vehicles,
        transferTypes: masterData.transferTypes,
        currencies: masterData.currencies,
        lastUpdated: masterData.lastUpdated
      }
    };
  } catch (error) {
    throw new Error(`Failed to get master data: ${error.message}`);
  }
};

/**
 * Get specific master data by type
 */
const getMasterDataByType = async (type) => {
  try {
    const masterData = await getOrCreateMasterData();
    
    let data;
    switch (type) {
      case 'categories':
        data = masterData.categories;
        break;
      case 'vehicles':
        data = masterData.vehicles;
        break;
      case 'transferTypes':
        data = masterData.transferTypes;
        break;
      case 'currencies':
        data = masterData.currencies;
        break;
      default:
        throw new Error('Invalid master data type');
    }
    
    return {
      success: true,
      message: `${type} retrieved successfully`,
      data: data
    };
  } catch (error) {
    throw new Error(`Failed to get ${type}: ${error.message}`);
  }
};

/**
 * Search master data by keyword
 */
const searchMasterData = async (keyword, type = null) => {
  try {
    const masterData = await getOrCreateMasterData();
    
    let searchData = [];
    
    if (!type || type === 'categories') {
      const categories = masterData.categories.filter(item => 
        item.name.toLowerCase().includes(keyword.toLowerCase()) ||
        item.description?.toLowerCase().includes(keyword.toLowerCase())
      );
      searchData.push(...categories.map(item => ({ ...item.toObject(), type: 'category' })));
    }
    
    if (!type || type === 'vehicles') {
      const vehicles = masterData.vehicles.filter(item => 
        item.name.toLowerCase().includes(keyword.toLowerCase()) ||
        item.description?.toLowerCase().includes(keyword.toLowerCase())
      );
      searchData.push(...vehicles.map(item => ({ ...item.toObject(), type: 'vehicle' })));
    }
    
    if (!type || type === 'transferTypes') {
      const transferTypes = masterData.transferTypes.filter(item => 
        item.name.toLowerCase().includes(keyword.toLowerCase()) ||
        item.description?.toLowerCase().includes(keyword.toLowerCase())
      );
      searchData.push(...transferTypes.map(item => ({ ...item.toObject(), type: 'transferType' })));
    }
    
    if (!type || type === 'currencies') {
      const currencies = masterData.currencies.filter(item => 
        item.name.toLowerCase().includes(keyword.toLowerCase()) ||
        item.code.toLowerCase().includes(keyword.toLowerCase())
      );
      searchData.push(...currencies.map(item => ({ ...item.toObject(), type: 'currency' })));
    }
    
    return {
      success: true,
      message: 'Search successful',
      data: searchData
    };
  } catch (error) {
    throw new Error(`Failed to search master data: ${error.message}`);
  }
};

module.exports = {
  getCategories,
  getVehicles,
  getTransferTypes,
  getCurrencies,
  getAllMasterData,
  getMasterDataByType,
  searchMasterData
};
