const { sendSuccessResponse, sendErrorResponse } = require('../../../shared/utils/responseHandler');
const halalRatingService = require('../services/halalRatingService');

// Search halal hotels
const searchHalalHotels = async (req, res) => {
  try {
    const searchParams = req.query;
    const result = await halalRatingService.searchHalalHotels(searchParams);
    
    return sendSuccessResponse(res, result, 'Halal hotels found successfully');
  } catch (error) {
    return sendErrorResponse(res, error.message, 400);
  }
};

// Rate a hotel
const rateHotel = async (req, res) => {
  try {
    const { userId } = req.user;
    const ratingData = {
      ...req.body,
      userId
    };
    
    const rating = await halalRatingService.rateHotel(ratingData);
    
    return sendSuccessResponse(res, { rating }, 'Hotel rated successfully', 201);
  } catch (error) {
    return sendErrorResponse(res, error.message, 400);
  }
};

// Get all halal ratings
const getAllHalalRatings = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const result = await halalRatingService.getAllHalalRatings(parseInt(page), parseInt(limit));
    
    return sendSuccessResponse(res, result, 'Halal ratings retrieved successfully');
  } catch (error) {
    return sendErrorResponse(res, error.message, 400);
  }
};

// Get halal rating by hotel ID
const getHalalRatingByHotelId = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const rating = await halalRatingService.getHalalRatingByHotelId(hotelId);
    
    return sendSuccessResponse(res, { rating }, 'Halal rating found successfully');
  } catch (error) {
    return sendErrorResponse(res, error.message, 404);
  }
};

// Get halal rating structure
const getHalalRatingStructure = async (req, res) => {
  try {
    const structure = await halalRatingService.getHalalRatingStructure();
    
    return sendSuccessResponse(res, { structure }, 'Rating structure retrieved successfully');
  } catch (error) {
    return sendErrorResponse(res, error.message, 400);
  }
};

// Update halal rating structure
const updateHalalRatingStructure = async (req, res) => {
  try {
    const { userId } = req.user;
    const structureData = req.body;
    
    const structure = await halalRatingService.updateHalalRatingStructure(structureData, userId);
    
    return sendSuccessResponse(res, { structure }, 'Rating structure updated successfully');
  } catch (error) {
    return sendErrorResponse(res, error.message, 400);
  }
};

// Verify halal rating
const verifyHalalRating = async (req, res) => {
  try {
    const { userId } = req.user;
    const { hotelId } = req.params;
    
    const rating = await halalRatingService.verifyHalalRating(hotelId, userId);
    
    return sendSuccessResponse(res, { rating }, 'Halal rating verified successfully');
  } catch (error) {
    return sendErrorResponse(res, error.message, 400);
  }
};

module.exports = {
  searchHalalHotels,
  rateHotel,
  getAllHalalRatings,
  getHalalRatingByHotelId,
  getHalalRatingStructure,
  updateHalalRatingStructure,
  verifyHalalRating
};
