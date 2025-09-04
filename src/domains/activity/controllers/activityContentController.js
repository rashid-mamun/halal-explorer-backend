const activityContentService = require('../services/activityContentService');
const { sendSuccessResponse, sendErrorResponse } = require('../../../shared/utils/responseHandler');

const createActivityContent = async (req, res) => {
  try {
    const result = await activityContentService.createActivityContent(req.body);
    return sendSuccessResponse(res, 'Activity content created successfully', result);
  } catch (error) {
    return sendErrorResponse(res, `Failed to create activity content: ${error.message}`, 500);
  }
};

const getActivityContentByCode = async (req, res) => {
  try {
    const { activityCode } = req.params;
    const result = await activityContentService.getActivityContentByCode(activityCode);
    
    if (result) {
      return sendSuccessResponse(res, 'Activity content retrieved successfully', result);
    } else {
      return sendErrorResponse(res, 'Activity content not found', 404);
    }
  } catch (error) {
    return sendErrorResponse(res, `Failed to get activity content: ${error.message}`, 500);
  }
};

const getAllActivityContent = async (req, res) => {
  try {
    const { page, pageSize } = req.query;
    const result = await activityContentService.getAllActivityContent(page, pageSize);
    
    return sendSuccessResponse(res, 'Activity content retrieved successfully', result);
  } catch (error) {
    return sendErrorResponse(res, `Failed to get activity content: ${error.message}`, 500);
  }
};

const updateActivityContent = async (req, res) => {
  try {
    const { activityCode } = req.params;
    const result = await activityContentService.updateActivityContent(activityCode, req.body);
    
    return sendSuccessResponse(res, 'Activity content updated successfully', result);
  } catch (error) {
    return sendErrorResponse(res, `Failed to update activity content: ${error.message}`, 500);
  }
};

const deleteActivityContent = async (req, res) => {
  try {
    const { activityCode } = req.params;
    const result = await activityContentService.deleteActivityContent(activityCode);
    
    if (result) {
      return sendSuccessResponse(res, 'Activity content deleted successfully');
    } else {
      return sendErrorResponse(res, 'Activity content not found', 404);
    }
  } catch (error) {
    return sendErrorResponse(res, `Failed to delete activity content: ${error.message}`, 500);
  }
};

const searchActivityContent = async (req, res) => {
  try {
    const result = await activityContentService.searchActivityContent(req.query);
    
    return sendSuccessResponse(res, 'Activity content search completed successfully', result);
  } catch (error) {
    return sendErrorResponse(res, `Failed to search activity content: ${error.message}`, 500);
  }
};

const fetchActivityContentFromHotelBeds = async (req, res) => {
  try {
    const { activityCodes, address } = req.body;
    const result = await activityContentService.fetchActivityContentFromHotelBeds(activityCodes, address);
    
    if (result.success) {
      return sendSuccessResponse(res, result.message, result.data);
    } else {
      return sendErrorResponse(res, result.error, 400);
    }
  } catch (error) {
    return sendErrorResponse(res, `Failed to fetch activity content: ${error.message}`, 500);
  }
};

const getPortfolioData = async (req, res) => {
  try {
    const { destination, offset, limit } = req.query;
    const result = await activityContentService.getPortfolioData(destination, offset, limit);
    
    if (result.success) {
      return sendSuccessResponse(res, result.message, result.data);
    } else {
      return sendErrorResponse(res, result.error, 400);
    }
  } catch (error) {
    return sendErrorResponse(res, `Failed to get portfolio data: ${error.message}`, 500);
  }
};

const getPortfolioAvailability = async (req, res) => {
  try {
    const { destination, offset, limit } = req.query;
    const result = await activityContentService.getPortfolioAvailability(destination, offset, limit);
    
    if (result.success) {
      return sendSuccessResponse(res, result.message, result.data);
    } else {
      return sendErrorResponse(res, result.error, 400);
    }
  } catch (error) {
    return sendErrorResponse(res, `Failed to get portfolio availability: ${error.message}`, 500);
  }
};

module.exports = {
  createActivityContent,
  getActivityContentByCode,
  getAllActivityContent,
  updateActivityContent,
  deleteActivityContent,
  searchActivityContent,
  fetchActivityContentFromHotelBeds,
  getPortfolioData,
  getPortfolioAvailability
};
