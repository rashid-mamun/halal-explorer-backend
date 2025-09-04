const halalActivityRatingService = require('../services/halalActivityRatingService');
const { sendSuccessResponse, sendErrorResponse } = require('../../../shared/utils/responseHandler');

const createHalalActivityRating = async (req, res) => {
  try {
    const result = await halalActivityRatingService.createHalalActivityRating(req.body);
    return sendSuccessResponse(res, 'Halal activity rating created successfully', result);
  } catch (error) {
    return sendErrorResponse(res, `Failed to create halal activity rating: ${error.message}`, 500);
  }
};

const getHalalActivityRatingByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const result = await halalActivityRatingService.getHalalActivityRatingByCode(code);
    
    if (result) {
      return sendSuccessResponse(res, 'Halal activity rating retrieved successfully', result);
    } else {
      return sendErrorResponse(res, 'Halal activity rating not found', 404);
    }
  } catch (error) {
    return sendErrorResponse(res, `Failed to get halal activity rating: ${error.message}`, 500);
  }
};

const getAllHalalActivityRatings = async (req, res) => {
  try {
    const { page, pageSize } = req.query;
    const result = await halalActivityRatingService.getAllHalalActivityRatings(page, pageSize);
    
    return sendSuccessResponse(res, 'Halal activity ratings retrieved successfully', result);
  } catch (error) {
    return sendErrorResponse(res, `Failed to get halal activity ratings: ${error.message}`, 500);
  }
};

const updateHalalActivityRating = async (req, res) => {
  try {
    const { code } = req.params;
    const result = await halalActivityRatingService.updateHalalActivityRating(code, req.body);
    
    if (result) {
      return sendSuccessResponse(res, 'Halal activity rating updated successfully', result);
    } else {
      return sendErrorResponse(res, 'Halal activity rating not found', 404);
    }
  } catch (error) {
    return sendErrorResponse(res, `Failed to update halal activity rating: ${error.message}`, 500);
  }
};

const deleteHalalActivityRating = async (req, res) => {
  try {
    const { code } = req.params;
    const result = await halalActivityRatingService.deleteHalalActivityRating(code);
    
    if (result) {
      return sendSuccessResponse(res, 'Halal activity rating deleted successfully');
    } else {
      return sendErrorResponse(res, 'Halal activity rating not found', 404);
    }
  } catch (error) {
    return sendErrorResponse(res, `Failed to delete halal activity rating: ${error.message}`, 500);
  }
};

const searchHalalActivityRatings = async (req, res) => {
  try {
    const result = await halalActivityRatingService.searchHalalActivityRatings(req.query);
    
    return sendSuccessResponse(res, 'Halal activity ratings search completed successfully', result);
  } catch (error) {
    return sendErrorResponse(res, `Failed to search halal activity ratings: ${error.message}`, 500);
  }
};

const createRatingStructure = async (req, res) => {
  try {
    const result = await halalActivityRatingService.createRatingStructure(req.body);
    return sendSuccessResponse(res, 'Rating structure created successfully', result);
  } catch (error) {
    return sendErrorResponse(res, `Failed to create rating structure: ${error.message}`, 500);
  }
};

const getRatingStructure = async (req, res) => {
  try {
    const result = await halalActivityRatingService.getRatingStructure();
    
    if (result) {
      return sendSuccessResponse(res, 'Rating structure retrieved successfully', result);
    } else {
      return sendErrorResponse(res, 'Rating structure not found', 404);
    }
  } catch (error) {
    return sendErrorResponse(res, `Failed to get rating structure: ${error.message}`, 500);
  }
};

const updateRatingStructure = async (req, res) => {
  try {
    const result = await halalActivityRatingService.updateRatingStructure(req.body);
    return sendSuccessResponse(res, 'Rating structure updated successfully', result);
  } catch (error) {
    return sendErrorResponse(res, `Failed to update rating structure: ${error.message}`, 500);
  }
};

const deleteRatingStructure = async (req, res) => {
  try {
    const result = await halalActivityRatingService.deleteRatingStructure();
    
    if (result) {
      return sendSuccessResponse(res, 'Rating structure deleted successfully');
    } else {
      return sendErrorResponse(res, 'Rating structure not found', 404);
    }
  } catch (error) {
    return sendErrorResponse(res, `Failed to delete rating structure: ${error.message}`, 500);
  }
};

const getRatingStatistics = async (req, res) => {
  try {
    const result = await halalActivityRatingService.getRatingStatistics();
    
    return sendSuccessResponse(res, 'Rating statistics retrieved successfully', result.data);
  } catch (error) {
    return sendErrorResponse(res, `Failed to get rating statistics: ${error.message}`, 500);
  }
};

module.exports = {
  createHalalActivityRating,
  getHalalActivityRatingByCode,
  getAllHalalActivityRatings,
  updateHalalActivityRating,
  deleteHalalActivityRating,
  searchHalalActivityRatings,
  createRatingStructure,
  getRatingStructure,
  updateRatingStructure,
  deleteRatingStructure,
  getRatingStatistics
};
