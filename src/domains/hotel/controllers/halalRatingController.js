const halalRatingService = require('../services/halalRatingService');
const { 
  sendSuccessResponse, 
  sendErrorResponse 
} = require('../../../shared/utils/responseHandler');

async function halalSearch(req, res) {
  try {
    const { city } = req.query;

    if (!city) {
      return sendErrorResponse(res, 'Please provide the city parameter.', 400);
    }

    const result = await halalRatingService.searchHalalHotels(req.query);
    
    if (result.success) {
      return sendSuccessResponse(res, result.data, result.message);
    } else {
      return sendErrorResponse(res, result.message, 400);
    }
  } catch (error) {
    console.error('Error in halalSearch:', error);
    return sendErrorResponse(res, 'Internal server error', 500);
  }
}

async function rateHotel(req, res) {
  try {
    const result = await halalRatingService.saveOrUpdateHotelInfo(req.body);
    
    if (result.success) {
      return sendSuccessResponse(res, result.data, result.message);
    } else {
      return sendErrorResponse(res, result.error, 400);
    }
  } catch (error) {
    console.error('Error in rateHotel:', error);
    return sendErrorResponse(res, 'Internal server error', 500);
  }
}

async function halalRatingStructure(req, res) {
  try {
    const result = await halalRatingService.saveOrUpdateStructure(req.body);
    
    if (result.success) {
      return sendSuccessResponse(res, result.data, result.message);
    } else {
      return sendErrorResponse(res, result.error, 400);
    }
  } catch (error) {
    console.error('Error in halalRatingStructure:', error);
    return sendErrorResponse(res, 'Internal server error', 500);
  }
}

async function getHalalRatingStructure(req, res) {
  try {
    const result = await halalRatingService.getHalalRatingStructure();
    
    if (result.success) {
      return sendSuccessResponse(res, result.data, result.message);
    } else {
      return sendErrorResponse(res, result.message, 404);
    }
  } catch (error) {
    console.error('Error in getHalalRatingStructure:', error);
    return sendErrorResponse(res, 'Internal server error', 500);
  }
}

async function getHalalHotel(req, res) {
  try {
    const { id } = req.query;
    const result = await halalRatingService.getHalalHotelInfo(id);
    
    if (result.success) {
      return sendSuccessResponse(res, result.data, result.message);
    } else {
      return sendErrorResponse(res, result.message, 404);
    }
  } catch (error) {
    console.error('Error in getHalalHotel:', error);
    return sendErrorResponse(res, 'Internal server error', 500);
  }
}

async function getAllHalalHotel(req, res) {
  try {
    const result = await halalRatingService.getAllHalalHotelInfo(req.query);
    
    if (result.success) {
      return sendSuccessResponse(res, result.data, result.message);
    } else {
      return sendErrorResponse(res, result.message, 400);
    }
  } catch (error) {
    console.error('Error in getAllHalalHotel:', error);
    return sendErrorResponse(res, 'Internal server error', 500);
  }
}

module.exports = {
  halalSearch,
  rateHotel,
  halalRatingStructure,
  getHalalRatingStructure,
  getHalalHotel,
  getAllHalalHotel
};
