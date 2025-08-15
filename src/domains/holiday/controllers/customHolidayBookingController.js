const customHolidayBookingService = require('../services/customHolidayBookingService');
const { sendSuccessResponse, sendErrorResponse } = require('../../../shared/utils/responseHandler');

/**
 * Create a new custom holiday booking
 */
const createCustomBooking = async (req, res) => {
  try {
    const booking = await customHolidayBookingService.createCustomBooking(req.body);
    sendSuccessResponse(res, 'Custom holiday booking created successfully', booking);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

/**
 * Get all custom bookings
 */
const getAllCustomBookings = async (req, res) => {
  try {
    const bookings = await customHolidayBookingService.getAllCustomBookings();
    sendSuccessResponse(res, 'Custom bookings retrieved successfully', bookings);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

/**
 * Get custom booking by ID
 */
const getCustomBookingById = async (req, res) => {
  try {
    const { bookingId } = req.query;
    const booking = await customHolidayBookingService.getCustomBookingById(bookingId);
    sendSuccessResponse(res, 'Custom booking retrieved successfully', booking);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

/**
 * Get custom bookings by email
 */
const getCustomBookingsByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const bookings = await customHolidayBookingService.getCustomBookingsByEmail(email);
    sendSuccessResponse(res, 'Custom bookings retrieved successfully', bookings);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

/**
 * Get custom booking by partner order ID
 */
const getCustomBookingByPartnerOrderId = async (req, res) => {
  try {
    const { partnerOrderId } = req.params;
    const booking = await customHolidayBookingService.getCustomBookingByPartnerOrderId(partnerOrderId);
    sendSuccessResponse(res, 'Custom booking retrieved successfully', booking);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

/**
 * Update custom booking
 */
const updateCustomBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await customHolidayBookingService.updateCustomBooking(bookingId, req.body);
    sendSuccessResponse(res, 'Custom booking updated successfully', booking);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

/**
 * Delete custom booking
 */
const deleteCustomBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await customHolidayBookingService.deleteCustomBooking(bookingId);
    sendSuccessResponse(res, 'Custom booking deleted successfully', booking);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

/**
 * Search custom bookings
 */
const searchCustomBookings = async (req, res) => {
  try {
    const criteria = req.query;
    const bookings = await customHolidayBookingService.searchCustomBookings(criteria);
    sendSuccessResponse(res, 'Custom bookings search completed', bookings);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

module.exports = {
  createCustomBooking,
  getAllCustomBookings,
  getCustomBookingById,
  getCustomBookingsByEmail,
  getCustomBookingByPartnerOrderId,
  updateCustomBooking,
  deleteCustomBooking,
  searchCustomBookings
};
