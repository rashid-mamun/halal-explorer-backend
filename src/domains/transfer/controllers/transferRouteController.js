const transferRouteService = require('../services/transferRouteService');
const { sendSuccessResponse, sendErrorResponse } = require('../../../shared/utils/responseHandler');

/**
 * Get routes
 */
const getRoutes = async (req, res) => {
  try {
    const result = await transferRouteService.getRoutes(req.query);
    
    if (!result.success) {
      return sendErrorResponse(res, 400, result.error);
    }
    
    return sendSuccessResponse(res, 200, result.message, result.data);
  } catch (error) {
    return sendErrorResponse(res, 500, error.message);
  }
};

/**
 * Get route by ID
 */
const getRouteById = async (req, res) => {
  try {
    const { routeId } = req.params;
    
    const result = await transferRouteService.getRouteById(routeId);
    
    if (!result.success) {
      return sendErrorResponse(res, 404, result.error);
    }
    
    return sendSuccessResponse(res, 200, result.message, result.data);
  } catch (error) {
    return sendErrorResponse(res, 500, error.message);
  }
};

/**
 * Get routes by destination
 */
const getRoutesByDestination = async (req, res) => {
  try {
    const { destinationCode } = req.params;
    const { limit = 10, offset = 0 } = req.query;
    
    const result = await transferRouteService.getRoutesByDestination(destinationCode, parseInt(limit), parseInt(offset));
    
    if (!result.success) {
      return sendErrorResponse(res, 400, result.error);
    }
    
    return sendSuccessResponse(res, 200, result.message, result.data);
  } catch (error) {
    return sendErrorResponse(res, 500, error.message);
  }
};

/**
 * Search routes by location
 */
const searchRoutesByLocation = async (req, res) => {
  try {
    const { locationCode } = req.params;
    const { locationType = 'from', limit = 10 } = req.query;
    
    const result = await transferRouteService.searchRoutesByLocation(locationCode, locationType, parseInt(limit));
    
    if (!result.success) {
      return sendErrorResponse(res, 400, result.error);
    }
    
    return sendSuccessResponse(res, 200, result.message, result.data);
  } catch (error) {
    return sendErrorResponse(res, 500, error.message);
  }
};

/**
 * Get all routes
 */
const getAllRoutes = async (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query;
    
    const result = await transferRouteService.getAllRoutes(parseInt(limit), parseInt(offset));
    
    if (!result.success) {
      return sendErrorResponse(res, 400, result.error);
    }
    
    return sendSuccessResponse(res, 200, result.message, result.data);
  } catch (error) {
    return sendErrorResponse(res, 500, error.message);
  }
};

/**
 * Delete route
 */
const deleteRoute = async (req, res) => {
  try {
    const { routeId } = req.params;
    
    const result = await transferRouteService.deleteRoute(routeId);
    
    if (!result.success) {
      return sendErrorResponse(res, 404, result.error);
    }
    
    return sendSuccessResponse(res, 200, result.message, result.data);
  } catch (error) {
    return sendErrorResponse(res, 500, error.message);
  }
};

/**
 * Update route timestamp
 */
const updateRouteTimestamp = async (req, res) => {
  try {
    const { routeId } = req.params;
    
    const result = await transferRouteService.updateRouteTimestamp(routeId);
    
    if (!result.success) {
      return sendErrorResponse(res, 404, result.error);
    }
    
    return sendSuccessResponse(res, 200, result.message, result.data);
  } catch (error) {
    return sendErrorResponse(res, 500, error.message);
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
