const managerService = require('../services/managerService');
const { 
  sendSuccessResponse, 
  sendErrorResponse 
} = require('../../../shared/utils/responseHandler');

async function managerInfo(req, res) {
  try {
    const result = await managerService.saveOrUpdateManagerInfo(req.body);
    
    if (result.success) {
      return sendSuccessResponse(res, result.data, result.message);
    } else {
      return sendErrorResponse(res, result.error, 400);
    }
  } catch (error) {
    console.error('Error in managerInfo:', error);
    return sendErrorResponse(res, 'Internal server error', 500);
  }
}

async function getManagerInfo(req, res) {
  try {
    const result = await managerService.getManagerInfo(req.query);
    
    if (result.success) {
      return sendSuccessResponse(res, result.data, result.message);
    } else {
      return sendErrorResponse(res, result.message, 404);
    }
  } catch (error) {
    console.error('Error in getManagerInfo:', error);
    return sendErrorResponse(res, 'Internal server error', 500);
  }
}

async function managerSearch(req, res) {
  try {
    const { city, hotelName } = req.query;

    if (!city && !hotelName) {
      return sendErrorResponse(res, 'Please provide the city or hotelName parameter.', 400);
    }

    const result = await managerService.searchHalalManagerHotels(req.query);
    
    if (result.success) {
      return sendSuccessResponse(res, result.data, result.message);
    } else {
      return sendErrorResponse(res, result.message, 400);
    }
  } catch (error) {
    console.error('Error in managerSearch:', error);
    return sendErrorResponse(res, 'Internal server error', 500);
  }
}

async function getAllManagerInfo(req, res) {
  try {
    const result = await managerService.getAllManagerInfo(req.query);
    
    if (result.success) {
      return sendSuccessResponse(res, result.data, result.message);
    } else {
      return sendErrorResponse(res, result.message, 400);
    }
  } catch (error) {
    console.error('Error in getAllManagerInfo:', error);
    return sendErrorResponse(res, 'Internal server error', 500);
  }
}

module.exports = {
  managerInfo,
  getManagerInfo,
  managerSearch,
  getAllManagerInfo
};
