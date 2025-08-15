const transferMasterDataService = require('../services/transferMasterDataService');
const { sendSuccessResponse, sendErrorResponse } = require('../../../shared/utils/responseHandler');

/**
 * Get categories
 */
const getCategories = async (req, res) => {
  try {
    const result = await transferMasterDataService.getCategories(req.query);
    
    if (!result.success) {
      return sendErrorResponse(res, 400, result.error);
    }
    
    return sendSuccessResponse(res, 200, result.message, result.data);
  } catch (error) {
    return sendErrorResponse(res, 500, error.message);
  }
};

/**
 * Get vehicles
 */
const getVehicles = async (req, res) => {
  try {
    const result = await transferMasterDataService.getVehicles(req.query);
    
    if (!result.success) {
      return sendErrorResponse(res, 400, result.error);
    }
    
    return sendSuccessResponse(res, 200, result.message, result.data);
  } catch (error) {
    return sendErrorResponse(res, 500, error.message);
  }
};

/**
 * Get transfer types
 */
const getTransferTypes = async (req, res) => {
  try {
    const result = await transferMasterDataService.getTransferTypes(req.query);
    
    if (!result.success) {
      return sendErrorResponse(res, 400, result.error);
    }
    
    return sendSuccessResponse(res, 200, result.message, result.data);
  } catch (error) {
    return sendErrorResponse(res, 500, error.message);
  }
};

/**
 * Get currencies
 */
const getCurrencies = async (req, res) => {
  try {
    const result = await transferMasterDataService.getCurrencies(req.query);
    
    if (!result.success) {
      return sendErrorResponse(res, 400, result.error);
    }
    
    return sendSuccessResponse(res, 200, result.message, result.data);
  } catch (error) {
    return sendErrorResponse(res, 500, error.message);
  }
};

/**
 * Get all master data
 */
const getAllMasterData = async (req, res) => {
  try {
    const result = await transferMasterDataService.getAllMasterData();
    
    if (!result.success) {
      return sendErrorResponse(res, 400, result.error);
    }
    
    return sendSuccessResponse(res, 200, result.message, result.data);
  } catch (error) {
    return sendErrorResponse(res, 500, error.message);
  }
};

/**
 * Get master data by type
 */
const getMasterDataByType = async (req, res) => {
  try {
    const { type } = req.params;
    
    const result = await transferMasterDataService.getMasterDataByType(type);
    
    if (!result.success) {
      return sendErrorResponse(res, 400, result.error);
    }
    
    return sendSuccessResponse(res, 200, result.message, result.data);
  } catch (error) {
    return sendErrorResponse(res, 500, error.message);
  }
};

/**
 * Search master data
 */
const searchMasterData = async (req, res) => {
  try {
    const { keyword, type } = req.query;
    
    if (!keyword) {
      return sendErrorResponse(res, 400, 'Keyword is required');
    }
    
    const result = await transferMasterDataService.searchMasterData(keyword, type);
    
    if (!result.success) {
      return sendErrorResponse(res, 400, result.error);
    }
    
    return sendSuccessResponse(res, 200, result.message, result.data);
  } catch (error) {
    return sendErrorResponse(res, 500, error.message);
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
