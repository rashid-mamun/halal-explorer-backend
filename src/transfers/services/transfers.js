const axios = require('axios');
const crypto = require('crypto');
const { getClient } = require("../../config/database");

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

const fetchData = async (url, successMessage, errorMessage) => {
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

const getPickups = async ({ fields = 'ALL', language = 'en', codes = '', offset = 1, limit = 10 }) => {
  const url = `${process.env.HOTELBEDS_API_ENDPOINT}/transfer-cache-api/1.0/pickups?fields=${fields}&language=${language}&codes=${codes}&offset=${offset}&limit=${limit}`;
  const successMessage = 'Fetch pickups information successfully';
  const errorMessage = 'Failed to fetch pickups';
  return fetchData(url, successMessage, errorMessage);
};

const getHotels = async ({ fields = 'ALL', language = 'en', countryCodes = '', destinationCodes = '', codes = '', giataCodes = '', offset = 1, limit = 10 }) => {
  const url = `${process.env.HOTELBEDS_API_ENDPOINT}/transfer-cache-api/1.0/hotels?fields=${fields}&language=${language}&countryCodes=${countryCodes}&destinationCodes=${destinationCodes}&codes=${codes}&giataCodes=${giataCodes}&offset=${offset}&limit=${limit}`;
  const successMessage = 'Fetch hotels information successfully';
  const errorMessage = 'Failed to fetch hotels';
  return fetchData(url, successMessage, errorMessage);
};

const getCountries = async ({ fields = 'ALL', language = 'en', codes = '', offset = 0, limit = 10 }) => {
  const url = `${process.env.HOTELBEDS_API_ENDPOINT}/transfer-cache-api/1.0/locations/countries?fields=${fields}&language=${language}&codes=${codes}&offset=${offset}&limit=${limit}`;
  const successMessage = 'Fetch countries information successfully';
  const errorMessage = 'Failed to fetch countries';
  return fetchData(url, successMessage, errorMessage);
};

const getDestinations = async ({ fields = 'ALL', language = 'en', countryCode = '', codes = '', offset = 0, limit = 10 }) => {
  const url = `${process.env.HOTELBEDS_API_ENDPOINT}/transfer-cache-api/1.0/locations/destinations?fields=${fields}&language=${language}&countryCode=${countryCode}&codes=${codes}&offset=${offset}&limit=${limit}`;
  const successMessage = 'Fetch destinations information successfully';
  const errorMessage = 'Failed to fetch destinations';
  return fetchData(url, successMessage, errorMessage);
};

const getTerminals = async ({ fields = 'ALL', language = 'en', countryCode = '', codes = '', offset = 0, limit = 10 }) => {
  const client = getClient();
  const db = client.db(process.env.DB_NAME);
  const terminalsCollection = db.collection('transferTerminals');

  const url = `${process.env.HOTELBEDS_API_ENDPOINT}/transfer-cache-api/1.0/locations/terminals?fields=${fields}&language=${language}&countryCode=${countryCode}&codes=${codes}&offset=${offset}&limit=${limit}`;
  const successMessage = 'Fetch terminals information successfully';
  const errorMessage = 'Failed to fetch terminals';
  const response = await fetchData(url, successMessage, errorMessage);

  if (!response.success) {
    return response;
  }

  const modifiedData = response.data.map(item => ({
    code: item.code,
    name: item.content.description,
    content: item.content,
    countryCode: item.countryCode,
    coordinates: item.coordinates,
    language: item.language
  }));

  try {
    const insertedData = [];
    const existingItems = await terminalsCollection.find({ code: { $in: modifiedData.map(item => item.code) } }).toArray();

    for (const item of modifiedData) {
      const existingItem = existingItems.find(existing => existing.code === item.code);

      if (existingItem) {
        insertedData.push(existingItem);
      } else {
        await terminalsCollection.insertOne(item);
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

const searchTerminals = async (keyword, offset = 0, limit = 10) => {
  try {
    const client = getClient();
    const db = client.db(process.env.DB_NAME);
    const terminalsCollection = db.collection('transferTerminals');

    await createNameIndexIfNotExists(terminalsCollection);

    const query = { $text: { $search: keyword } };
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

const getMasterCategories = async ({ fields = 'ALL', language = 'en', codes = '', offset = 0, limit = 10 }) => {
  const url = `${process.env.HOTELBEDS_API_ENDPOINT}/transfer-cache-api/1.0/masters/categories?fields=${fields}&language=${language}&codes=${codes}&offset=${offset}&limit=${limit}`;
  const successMessage = 'Fetch Master Categories information successfully';
  const errorMessage = 'Failed to fetch Master Categories';
  return fetchData(url, successMessage, errorMessage);
};

const getMasterVehicles = async ({ fields = 'ALL', language = 'en', codes = '', offset = 0, limit = 10 }) => {
  const url = `${process.env.HOTELBEDS_API_ENDPOINT}/transfer-cache-api/1.0/masters/vehicles?fields=${fields}&language=${language}&codes=${codes}&offset=${offset}&limit=${limit}`;
  const successMessage = 'Fetch Master vehicles information successfully';
  const errorMessage = 'Failed to fetch Master vehicles';
  return fetchData(url, successMessage, errorMessage);
};

const getMasterTransferTypes = async ({ fields = 'ALL', language = 'en', codes = '', offset = 0, limit = 10 }) => {
  const url = `${process.env.HOTELBEDS_API_ENDPOINT}/transfer-cache-api/1.0/masters/transferTypes?fields=${fields}&language=${language}&codes=${codes}&offset=${offset}&limit=${limit}`;
  const successMessage = 'Fetch Master transferTypes information successfully';
  const errorMessage = 'Failed to fetch Master transferTypes';
  return fetchData(url, successMessage, errorMessage);
};

const getCurrencies = async ({ fields = 'ALL', language = 'en', codes = '', offset = 0, limit = 10 }) => {
  const url = `${process.env.HOTELBEDS_API_ENDPOINT}/transfer-cache-api/1.0/currencies?fields=${fields}&language=${language}&codes=${codes}&offset=${offset}&limit=${limit}`;
  const successMessage = 'Fetch Master currencies information successfully';
  const errorMessage = 'Failed to fetch Master currencies';
  return fetchData(url, successMessage, errorMessage);
};

const getRoutes = async ({ fields = 'ALL', destinationCode, offset = 0, limit = 10 }) => {
  const url = `${process.env.HOTELBEDS_API_ENDPOINT}/transfer-cache-api/1.0/routes?fields=${fields}&destinationCode=${destinationCode}&offset=${offset}&limit=${limit}`;
  const successMessage = 'Fetch routes information successfully';
  const errorMessage = 'Failed to fetch routes';
  return fetchData(url, successMessage, errorMessage);
};

module.exports = {
  getPickups,
  getHotels,
  getCountries,
  getDestinations,
  getTerminals,
  searchTerminals,
  getMasterCategories,
  getMasterVehicles,
  getMasterTransferTypes,
  getCurrencies,
  getRoutes,
};
