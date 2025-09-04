const transferAvailabilityService = require('../services/transferAvailabilityService');
const { sendSuccessResponse, sendErrorResponse } = require('../../../shared/utils/responseHandler');

/**
 * Check availability
 */
const checkAvailability = async (req, res) => {
  try {
    const result = await transferAvailabilityService.checkAvailability(req.body);
    
    if (!result.success) {
      return sendErrorResponse(res, 400, result.error);
    }
    
    return sendSuccessResponse(res, 200, result.message, result.data);
  } catch (error) {
    return sendErrorResponse(res, 500, error.message);
  }
};

/**
 * Get availability request by ID
 */
const getAvailabilityRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    
    const result = await transferAvailabilityService.getAvailabilityRequest(requestId);
    
    if (!result.success) {
      return sendErrorResponse(res, 404, result.error);
    }
    
    return sendSuccessResponse(res, 200, result.message, result.data);
  } catch (error) {
    return sendErrorResponse(res, 500, error.message);
  }
};

/**
 * Get all availability requests
 */
const getAllAvailabilityRequests = async (req, res) => {
  try {
    const { limit = 10, offset = 0, status } = req.query;
    
    const result = await transferAvailabilityService.getAllAvailabilityRequests(parseInt(limit), parseInt(offset), status);
    
    if (!result.success) {
      return sendErrorResponse(res, 400, result.error);
    }
    
    return sendSuccessResponse(res, 200, result.message, result.data);
  } catch (error) {
    return sendErrorResponse(res, 500, error.message);
  }
};

/**
 * Delete availability request
 */
const deleteAvailabilityRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    
    const result = await transferAvailabilityService.deleteAvailabilityRequest(requestId);
    
    if (!result.success) {
      return sendErrorResponse(res, 404, result.error);
    }
    
    return sendSuccessResponse(res, 200, result.message, result.data);
  } catch (error) {
    return sendErrorResponse(res, 500, error.message);
  }
};

/**
 * Get availability statistics
 */
const getAvailabilityStatistics = async (req, res) => {
  try {
    const result = await transferAvailabilityService.getAvailabilityStatistics();
    
    if (!result.success) {
      return sendErrorResponse(res, 400, result.error);
    }
    
    return sendSuccessResponse(res, 200, result.message, result.data);
  } catch (error) {
    return sendErrorResponse(res, 500, error.message);
  }
};

module.exports = {
  checkAvailability,
  getAvailabilityRequest,
  getAllAvailabilityRequests,
  deleteAvailabilityRequest,
  getAvailabilityStatistics
};
