const insuranceBookingService = require('../services/insuranceBookingService');
const { sendSuccessResponse, sendErrorResponse } = require('../../../shared/utils/responseHandler');

/**
 * Create a new insurance booking
 */
const createBooking = async (req, res) => {
  try {
    const booking = await insuranceBookingService.createBooking(req.body);
    sendSuccessResponse(res, booking, 'Insurance booking created successfully');
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
    sendSuccessResponse(res, bookings, 'Bookings retrieved successfully');
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
    sendSuccessResponse(res, booking, 'Booking retrieved successfully');
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
    sendSuccessResponse(res, bookings, 'Bookings retrieved successfully');
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
    sendSuccessResponse(res, booking, 'Booking retrieved successfully');
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
    sendSuccessResponse(res, booking, 'Booking updated successfully');
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
    sendSuccessResponse(res, booking, 'Booking deleted successfully');
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
    sendSuccessResponse(res, bookings, 'Bookings search completed');
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
