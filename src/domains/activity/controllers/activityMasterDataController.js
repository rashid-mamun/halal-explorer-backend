const activityMasterDataService = require('../services/activityMasterDataService');
const { sendSuccessResponse, sendErrorResponse } = require('../../../shared/utils/responseHandler');

const fetchCountries = async (req, res) => {
  try {
    const result = await activityMasterDataService.fetchCountries();
    
    if (result.success) {
      return sendSuccessResponse(res, result.message, result.data);
    } else {
      return sendErrorResponse(res, result.error, 400);
    }
  } catch (error) {
    return sendErrorResponse(res, `Failed to fetch countries: ${error.message}`, 500);
  }
};

const fetchDestinations = async (req, res) => {
  try {
    const { countryCode } = req.params;
    const result = await activityMasterDataService.fetchDestinations(countryCode);
    
    if (result.success) {
      return sendSuccessResponse(res, result.message, result.data);
    } else {
      return sendErrorResponse(res, result.error, 400);
    }
  } catch (error) {
    return sendErrorResponse(res, `Failed to fetch destinations: ${error.message}`, 500);
  }
};

const fetchCurrencies = async (req, res) => {
  try {
    const result = await activityMasterDataService.fetchCurrencies();
    
    if (result.success) {
      return sendSuccessResponse(res, result.message, result.data);
    } else {
      return sendErrorResponse(res, result.error, 400);
    }
  } catch (error) {
    return sendErrorResponse(res, `Failed to fetch currencies: ${error.message}`, 500);
  }
};

const fetchSegments = async (req, res) => {
  try {
    const result = await activityMasterDataService.fetchSegments();
    
    if (result.success) {
      return sendSuccessResponse(res, result.message, result.data);
    } else {
      return sendErrorResponse(res, result.error, 400);
    }
  } catch (error) {
    return sendErrorResponse(res, `Failed to fetch segments: ${error.message}`, 500);
  }
};

const fetchLanguages = async (req, res) => {
  try {
    const result = await activityMasterDataService.fetchLanguages();
    
    if (result.success) {
      return sendSuccessResponse(res, result.message, result.data);
    } else {
      return sendErrorResponse(res, result.error, 400);
    }
  } catch (error) {
    return sendErrorResponse(res, `Failed to fetch languages: ${error.message}`, 500);
  }
};

const fetchDestinationHotels = async (req, res) => {
  try {
    const { destinationCode } = req.params;
    const result = await activityMasterDataService.fetchDestinationHotels(destinationCode);
    
    if (result.success) {
      return sendSuccessResponse(res, result.message, result.data);
    } else {
      return sendErrorResponse(res, result.error, 400);
    }
  } catch (error) {
    return sendErrorResponse(res, `Failed to fetch destination hotels: ${error.message}`, 500);
  }
};

const searchDestinations = async (req, res) => {
  try {
    const { keyword, offset, limit } = req.query;
    const result = await activityMasterDataService.searchDestinations(keyword, offset, limit);
    
    return sendSuccessResponse(res, result.message, result.data);
  } catch (error) {
    return sendErrorResponse(res, `Failed to search destinations: ${error.message}`, 500);
  }
};

const getAllMasterData = async (req, res) => {
  try {
    const result = await activityMasterDataService.getAllMasterData();
    
    return sendSuccessResponse(res, result.message, result.data);
  } catch (error) {
    return sendErrorResponse(res, `Failed to get master data: ${error.message}`, 500);
  }
};

const syncAllMasterData = async (req, res) => {
  try {
    const result = await activityMasterDataService.syncAllMasterData();
    
    return sendSuccessResponse(res, result.message);
  } catch (error) {
    return sendErrorResponse(res, `Failed to sync master data: ${error.message}`, 500);
  }
};

module.exports = {
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
