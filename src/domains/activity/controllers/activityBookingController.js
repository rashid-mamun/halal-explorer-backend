const activityBookingService = require('../services/activityBookingService');
const { sendSuccessResponse, sendErrorResponse } = require('../../../shared/utils/responseHandler');

const createActivityBooking = async (req, res) => {
  try {
    const result = await activityBookingService.createActivityBooking(req.body);
    return sendSuccessResponse(res, 'Activity booking created successfully', result);
  } catch (error) {
    return sendErrorResponse(res, `Failed to create activity booking: ${error.message}`, 500);
  }
};

const getActivityBookingById = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const result = await activityBookingService.getActivityBookingById(bookingId);
    
    if (result) {
      return sendSuccessResponse(res, 'Activity booking retrieved successfully', result);
    } else {
      return sendErrorResponse(res, 'Activity booking not found', 404);
    }
  } catch (error) {
    return sendErrorResponse(res, `Failed to get activity booking: ${error.message}`, 500);
  }
};

const getAllActivityBookings = async (req, res) => {
  try {
    const { page, pageSize } = req.query;
    const result = await activityBookingService.getAllActivityBookings(page, pageSize);
    
    return sendSuccessResponse(res, 'Activity bookings retrieved successfully', result);
  } catch (error) {
    return sendErrorResponse(res, `Failed to get activity bookings: ${error.message}`, 500);
  }
};

const updateActivityBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const result = await activityBookingService.updateActivityBooking(bookingId, req.body);
    
    if (result) {
      return sendSuccessResponse(res, 'Activity booking updated successfully', result);
    } else {
      return sendErrorResponse(res, 'Activity booking not found', 404);
    }
  } catch (error) {
    return sendErrorResponse(res, `Failed to update activity booking: ${error.message}`, 500);
  }
};

const deleteActivityBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const result = await activityBookingService.deleteActivityBooking(bookingId);
    
    if (result) {
      return sendSuccessResponse(res, 'Activity booking deleted successfully');
    } else {
      return sendErrorResponse(res, 'Activity booking not found', 404);
    }
  } catch (error) {
    return sendErrorResponse(res, `Failed to delete activity booking: ${error.message}`, 500);
  }
};

const searchActivityBookings = async (req, res) => {
  try {
    const result = await activityBookingService.searchActivityBookings(req.query);
    
    return sendSuccessResponse(res, 'Activity bookings search completed successfully', result);
  } catch (error) {
    return sendErrorResponse(res, `Failed to search activity bookings: ${error.message}`, 500);
  }
};

const confirmBooking = async (req, res) => {
  try {
    const result = await activityBookingService.confirmBooking(req.body);
    
    if (result.success) {
      return sendSuccessResponse(res, result.message, result.bookingConfirmation);
    } else {
      return sendErrorResponse(res, result.message, 400);
    }
  } catch (error) {
    return sendErrorResponse(res, `Failed to confirm booking: ${error.message}`, 500);
  }
};

const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { cancellationData } = req.body;
    const result = await activityBookingService.cancelBooking(bookingId, cancellationData);
    
    if (result.success) {
      return sendSuccessResponse(res, result.message, result.data);
    } else {
      return sendErrorResponse(res, result.message, 400);
    }
  } catch (error) {
    return sendErrorResponse(res, `Failed to cancel booking: ${error.message}`, 500);
  }
};

const getBookingStatistics = async (req, res) => {
  try {
    const result = await activityBookingService.getBookingStatistics();
    
    return sendSuccessResponse(res, 'Booking statistics retrieved successfully', result.data);
  } catch (error) {
    return sendErrorResponse(res, `Failed to get booking statistics: ${error.message}`, 500);
  }
};

module.exports = {
  createActivityBooking,
  getActivityBookingById,
  getAllActivityBookings,
  updateActivityBooking,
  deleteActivityBooking,
  searchActivityBookings,
  confirmBooking,
  cancelBooking,
  getBookingStatistics
};
