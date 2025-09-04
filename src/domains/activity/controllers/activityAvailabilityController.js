const activityAvailabilityService = require('../services/activityAvailabilityService');
const { sendSuccessResponse, sendErrorResponse } = require('../../../shared/utils/responseHandler');

const searchActivities = async (req, res) => {
  try {
    const { destination, adult, child, departure, arrival, page, pageSize } = req.query;
    const result = await activityAvailabilityService.searchActivities(
      destination, 
      adult, 
      child, 
      departure, 
      arrival, 
      { page, pageSize }
    );
    
    if (result.success) {
      return sendSuccessResponse(res, 'Activities search completed successfully', result);
    } else {
      return sendErrorResponse(res, result.error, 400);
    }
  } catch (error) {
    return sendErrorResponse(res, `Failed to search activities: ${error.message}`, 500);
  }
};

const searchFilterActivities = async (req, res) => {
  try {
    const result = await activityAvailabilityService.searchFilterActivities(req.query);
    
    if (result.success) {
      return sendSuccessResponse(res, 'Activities filter completed successfully', result);
    } else {
      return sendErrorResponse(res, result.message || result.error, 400);
    }
  } catch (error) {
    return sendErrorResponse(res, `Failed to filter activities: ${error.message}`, 500);
  }
};

const searchActivitiesDetails = async (req, res) => {
  try {
    const { code, adult, child, departure, arrival } = req.query;
    const result = await activityAvailabilityService.searchActivitiesDetails(
      code, 
      adult, 
      child, 
      departure, 
      arrival, 
      req.query
    );
    
    if (result.success) {
      return sendSuccessResponse(res, result.message, result);
    } else {
      return sendErrorResponse(res, result.message || result.error, 400);
    }
  } catch (error) {
    return sendErrorResponse(res, `Failed to get activity details: ${error.message}`, 500);
  }
};

const getAvailabilityRequestById = async (req, res) => {
  try {
    const { requestId } = req.params;
    const result = await activityAvailabilityService.getAvailabilityRequestById(requestId);
    
    if (result) {
      return sendSuccessResponse(res, 'Availability request retrieved successfully', result);
    } else {
      return sendErrorResponse(res, 'Availability request not found', 404);
    }
  } catch (error) {
    return sendErrorResponse(res, `Failed to get availability request: ${error.message}`, 500);
  }
};

const getAllAvailabilityRequests = async (req, res) => {
  try {
    const { page, pageSize } = req.query;
    const result = await activityAvailabilityService.getAllAvailabilityRequests(page, pageSize);
    
    return sendSuccessResponse(res, 'Availability requests retrieved successfully', result);
  } catch (error) {
    return sendErrorResponse(res, `Failed to get availability requests: ${error.message}`, 500);
  }
};

const updateAvailabilityRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;
    const result = await activityAvailabilityService.updateAvailabilityRequestStatus(requestId, status);
    
    if (result) {
      return sendSuccessResponse(res, 'Availability request status updated successfully', result);
    } else {
      return sendErrorResponse(res, 'Availability request not found', 404);
    }
  } catch (error) {
    return sendErrorResponse(res, `Failed to update availability request status: ${error.message}`, 500);
  }
};

const deleteAvailabilityRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const result = await activityAvailabilityService.deleteAvailabilityRequest(requestId);
    
    if (result) {
      return sendSuccessResponse(res, 'Availability request deleted successfully');
    } else {
      return sendErrorResponse(res, 'Availability request not found', 404);
    }
  } catch (error) {
    return sendErrorResponse(res, `Failed to delete availability request: ${error.message}`, 500);
  }
};

module.exports = {
  searchActivities,
  searchFilterActivities,
  searchActivitiesDetails,
  getAvailabilityRequestById,
  getAllAvailabilityRequests,
  updateAvailabilityRequestStatus,
  deleteAvailabilityRequest
};
