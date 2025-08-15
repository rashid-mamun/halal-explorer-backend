const holidayBookingService = require('../services/holidayBookingService');
const holidayPackageService = require('../services/holidayPackageService');
const { sendSuccessResponse, sendErrorResponse } = require('../../../shared/utils/responseHandler');

/**
 * Create a new holiday booking
 */
const createBooking = async (req, res) => {
  try {
    const bookingData = req.body;
    
    // Check if package exists and has enough seats
    const package = await holidayPackageService.getHolidayPackageById(bookingData.packageId);
    const requestedSeats = bookingData.passengersDetails.single + 
                          bookingData.passengersDetails.adults + 
                          bookingData.passengersDetails.child + 
                          bookingData.passengersDetails.infant;
    
    if (package.seats < requestedSeats) {
      return sendErrorResponse(res, 'Requested seats exceed available seats');
    }
    
    // Create booking
    const booking = await holidayBookingService.createBooking(bookingData);
    
    // Update package seats
    await holidayPackageService.updatePackageSeats(bookingData.packageId, requestedSeats);
    
    sendSuccessResponse(res, 'Holiday booking created successfully', booking);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

/**
 * Get all bookings
 */
const getAllBookings = async (req, res) => {
  try {
    const bookings = await holidayBookingService.getAllBookings();
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
    const { bookingId } = req.query;
    const booking = await holidayBookingService.getBookingById(bookingId);
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
    const bookings = await holidayBookingService.getBookingsByEmail(email);
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
    const booking = await holidayBookingService.getBookingByPartnerOrderId(partnerOrderId);
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
    const booking = await holidayBookingService.updateBooking(bookingId, req.body);
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
    const booking = await holidayBookingService.deleteBooking(bookingId);
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
    const bookings = await holidayBookingService.searchBookings(criteria);
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
