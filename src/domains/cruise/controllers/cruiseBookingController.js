const cruiseBookingService = require('../services/cruiseBookingService');
const { sendSuccessResponse, sendErrorResponse } = require('../../../shared/utils/responseHandler');

/**
 * Create a new cruise booking
 */
const createBooking = async (req, res) => {
  try {
    const booking = await cruiseBookingService.createBooking(req.body);
    sendSuccessResponse(res, 'Cruise booking created successfully', booking);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

/**
 * Get all bookings
 */
const getAllBookings = async (req, res) => {
  try {
    const bookings = await cruiseBookingService.getAllBookings();
    sendSuccessResponse(res, 'Bookings retrieved successfully', bookings);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

/**
 * Get booking by ID
 */
const getBookingById = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await cruiseBookingService.getBookingById(bookingId);
    sendSuccessResponse(res, 'Booking retrieved successfully', booking);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

/**
 * Get bookings by email
 */
const getBookingsByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const bookings = await cruiseBookingService.getBookingsByEmail(email);
    sendSuccessResponse(res, 'Bookings retrieved successfully', bookings);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

/**
 * Get booking by partner order ID
 */
const getBookingByPartnerOrderId = async (req, res) => {
  try {
    const { partnerOrderId } = req.params;
    const booking = await cruiseBookingService.getBookingByPartnerOrderId(partnerOrderId);
    sendSuccessResponse(res, 'Booking retrieved successfully', booking);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

/**
 * Update booking
 */
const updateBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await cruiseBookingService.updateBooking(bookingId, req.body);
    sendSuccessResponse(res, 'Booking updated successfully', booking);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

/**
 * Delete booking
 */
const deleteBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await cruiseBookingService.deleteBooking(bookingId);
    sendSuccessResponse(res, 'Booking deleted successfully', booking);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

/**
 * Search bookings
 */
const searchBookings = async (req, res) => {
  try {
    const criteria = req.query;
    const bookings = await cruiseBookingService.searchBookings(criteria);
    sendSuccessResponse(res, 'Bookings search completed', bookings);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

module.exports = {
  createBooking,
  getAllBookings,
  getBookingById,
  getBookingsByEmail,
  getBookingByPartnerOrderId,
  updateBooking,
  deleteBooking,
  searchBookings
};
