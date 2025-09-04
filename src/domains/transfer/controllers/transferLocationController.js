const transferLocationService = require('../services/transferLocationService');
const { sendSuccessResponse, sendErrorResponse } = require('../../../shared/utils/responseHandler');

/**
 * Get countries
 */
const getCountries = async (req, res) => {
  try {
    const result = await transferLocationService.getCountries(req.query);
    
    if (!result.success) {
      return sendErrorResponse(res, 400, result.error);
    }
    
    return sendSuccessResponse(res, 200, result.message, result.data);
  } catch (error) {
    return sendErrorResponse(res, 500, error.message);
  }
};

/**
 * Get destinations
 */
const getDestinations = async (req, res) => {
  try {
    const result = await transferLocationService.getDestinations(req.query);
    
    if (!result.success) {
      return sendErrorResponse(res, 400, result.error);
    }
    
    return sendSuccessResponse(res, 200, result.message, result.data);
  } catch (error) {
    return sendErrorResponse(res, 500, error.message);
  }
};

/**
 * Get terminals
 */
const getTerminals = async (req, res) => {
  try {
    const result = await transferLocationService.getTerminals(req.query);
    
    if (!result.success) {
      return sendErrorResponse(res, 400, result.error);
    }
    
    return sendSuccessResponse(res, 200, result.message, result.data);
  } catch (error) {
    return sendErrorResponse(res, 500, error.message);
  }
};

/**
 * Get hotels
 */
const getHotels = async (req, res) => {
  try {
    const result = await transferLocationService.getHotels(req.query);
    
    if (!result.success) {
      return sendErrorResponse(res, 400, result.error);
    }
    
    return sendSuccessResponse(res, 200, result.message, result.data);
  } catch (error) {
    return sendErrorResponse(res, 500, error.message);
  }
};

/**
 * Get pickups
 */
const getPickups = async (req, res) => {
  try {
    const result = await transferLocationService.getPickups(req.query);
    
    if (!result.success) {
      return sendErrorResponse(res, 400, result.error);
    }
    
    return sendSuccessResponse(res, 200, result.message, result.data);
  } catch (error) {
    return sendErrorResponse(res, 500, error.message);
  }
};

/**
 * Search locations
 */
const searchLocations = async (req, res) => {
  try {
    const { keyword, type, limit = 10 } = req.query;
    
    if (!keyword) {
      return sendErrorResponse(res, 400, 'Keyword is required');
    }
    
    const result = await transferLocationService.searchLocations(keyword, type, parseInt(limit));
    
    if (!result.success) {
      return sendErrorResponse(res, 400, result.error);
    }
    
    return sendSuccessResponse(res, 200, result.message, result.data);
  } catch (error) {
    return sendErrorResponse(res, 500, error.message);
  }
};

/**
 * Get locations by type
 */
const getLocationsByType = async (req, res) => {
  try {
    const { type } = req.params;
    const { limit = 10, offset = 0 } = req.query;
    
    const result = await transferLocationService.getLocationsByType(type, parseInt(limit), parseInt(offset));
    
    if (!result.success) {
      return sendErrorResponse(res, 400, result.error);
    }
    
    return sendSuccessResponse(res, 200, result.message, result.data);
  } catch (error) {
    return sendErrorResponse(res, 500, error.message);
  }
};

/**
 * Get location by code
 */
const getLocationByCode = async (req, res) => {
  try {
    const { code, type } = req.params;
    
    const result = await transferLocationService.getLocationByCode(code, type);
    
    if (!result.success) {
      return sendErrorResponse(res, 404, result.error);
    }
    
    return sendSuccessResponse(res, 200, result.message, result.data);
  } catch (error) {
    return sendErrorResponse(res, 500, error.message);
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
