const insuranceBookingService = require('../services/insuranceBookingService');
const { sendSuccessResponse, sendErrorResponse } = require('../../../shared/utils/responseHandler');

/**
 * Create a new insurance booking
 */
const createBooking = async (req, res) => {
  try {
    const booking = await insuranceBookingService.createBooking(req.body);
    sendSuccessResponse(res, 'Insurance booking created successfully', booking);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

/**
 * Get all bookings
 */
const getAllBookings = async (req, res) => {
  try {
    const bookings = await insuranceBookingService.getAllBookings();
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
    const { id } = req.params;
    const booking = await insuranceBookingService.getBookingById(id);
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
    const bookings = await insuranceBookingService.getBookingsByEmail(email);
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
    const booking = await insuranceBookingService.getBookingByPartnerOrderId(partnerOrderId);
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
    const { id } = req.params;
    const booking = await insuranceBookingService.updateBooking(id, req.body);
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
    const { id } = req.params;
    const booking = await insuranceBookingService.deleteBooking(id);
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
    const bookings = await insuranceBookingService.searchBookings(criteria);
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
