const transferBookingService = require('../services/transferBookingService');
const { sendSuccessResponse, sendErrorResponse } = require('../../../shared/utils/responseHandler');

/**
 * Create booking
 */
const createBooking = async (req, res) => {
  try {
    const result = await transferBookingService.createBooking(req.body);
    
    if (!result.success) {
      return sendErrorResponse(res, 400, result.error);
    }
    
    return sendSuccessResponse(res, 201, result.message, result.data);
  } catch (error) {
    return sendErrorResponse(res, 500, error.message);
  }
};

/**
 * Get booking by ID
 */
const getBookingById = async (req, res) => {
  try {
    const { bookingId } = req.params;
    
    const result = await transferBookingService.getBookingById(bookingId);
    
    if (!result.success) {
      return sendErrorResponse(res, 404, result.error);
    }
    
    return sendSuccessResponse(res, 200, result.message, result.data);
  } catch (error) {
    return sendErrorResponse(res, 500, error.message);
  }
};

/**
 * Get booking by HotelBeds reference
 */
const getBookingByHotelBedsReference = async (req, res) => {
  try {
    const { hotelBedsReference } = req.params;
    
    const result = await transferBookingService.getBookingByHotelBedsReference(hotelBedsReference);
    
    if (!result.success) {
      return sendErrorResponse(res, 404, result.error);
    }
    
    return sendSuccessResponse(res, 200, result.message, result.data);
  } catch (error) {
    return sendErrorResponse(res, 500, error.message);
  }
};

/**
 * Get all bookings
 */
const getAllBookings = async (req, res) => {
  try {
    const { limit = 10, offset = 0, status } = req.query;
    
    const result = await transferBookingService.getAllBookings(parseInt(limit), parseInt(offset), status);
    
    if (!result.success) {
      return sendErrorResponse(res, 400, result.error);
    }
    
    return sendSuccessResponse(res, 200, result.message, result.data);
  } catch (error) {
    return sendErrorResponse(res, 500, error.message);
  }
};

/**
 * Get bookings by customer email
 */
const getBookingsByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const { limit = 10, offset = 0 } = req.query;
    
    const result = await transferBookingService.getBookingsByEmail(email, parseInt(limit), parseInt(offset));
    
    if (!result.success) {
      return sendErrorResponse(res, 400, result.error);
    }
    
    return sendSuccessResponse(res, 200, result.message, result.data);
  } catch (error) {
    return sendErrorResponse(res, 500, error.message);
  }
};

/**
 * Update booking status
 */
const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return sendErrorResponse(res, 400, 'Status is required');
    }
    
    const result = await transferBookingService.updateBookingStatus(bookingId, status);
    
    if (!result.success) {
      return sendErrorResponse(res, 404, result.error);
    }
    
    return sendSuccessResponse(res, 200, result.message, result.data);
  } catch (error) {
    return sendErrorResponse(res, 500, error.message);
  }
};

/**
 * Cancel booking
 */
const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    
    const result = await transferBookingService.cancelBooking(bookingId);
    
    if (!result.success) {
      return sendErrorResponse(res, 400, result.error);
    }
    
    return sendSuccessResponse(res, 200, result.message, result.data);
  } catch (error) {
    return sendErrorResponse(res, 500, error.message);
  }
};

/**
 * Get booking statistics
 */
const getBookingStatistics = async (req, res) => {
  try {
    const result = await transferBookingService.getBookingStatistics();
    
    if (!result.success) {
      return sendErrorResponse(res, 400, result.error);
    }
    
    return sendSuccessResponse(res, 200, result.message, result.data);
  } catch (error) {
    return sendErrorResponse(res, 500, error.message);
  }
};

module.exports = {
  createBooking,
  getBookingById,
  getBookingByHotelBedsReference,
  getAllBookings,
  getBookingsByEmail,
  updateBookingStatus,
  cancelBooking,
  getBookingStatistics
};
