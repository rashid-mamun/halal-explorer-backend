const CruiseBooking = require('../models/CruiseBooking');
const { v4: uuidv4 } = require('uuid');

/**
 * Generate unique booking code
 */
const generateBookingCode = () => {
  const length = 6;
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }
  return code;
};

/**
 * Create a new cruise booking
 */
const createBooking = async (bookingData) => {
  try {
    const bookingId = uuidv4();
    const partnerOrderId = 'HFL' + generateBookingCode();
    const email = bookingData.userInfo.email;
    
    const booking = new CruiseBooking({
      ...bookingData,
      bookingId,
      partnerOrderId,
      email
    });
    
    await booking.save();
    return booking;
  } catch (error) {
    throw new Error(`Failed to create cruise booking: ${error.message}`);
  }
};

/**
 * Get all bookings
 */
const getAllBookings = async () => {
  try {
    const bookings = await CruiseBooking.find().sort({ createdAt: -1 });
    return bookings;
  } catch (error) {
    throw new Error(`Failed to retrieve bookings: ${error.message}`);
  }
};

/**
 * Get booking by ID
 */
const getBookingById = async (bookingId) => {
  try {
    const booking = await CruiseBooking.findOne({ bookingId });
    
    if (!booking) {
      throw new Error('Booking not found');
    }
    
    return booking;
  } catch (error) {
    throw new Error(`Failed to retrieve booking: ${error.message}`);
  }
};

/**
 * Get bookings by email
 */
const getBookingsByEmail = async (email) => {
  try {
    const bookings = await CruiseBooking.find({ email }).sort({ createdAt: -1 });
    return bookings;
  } catch (error) {
    throw new Error(`Failed to retrieve bookings by email: ${error.message}`);
  }
};

/**
 * Get booking by partner order ID
 */
const getBookingByPartnerOrderId = async (partnerOrderId) => {
  try {
    const booking = await CruiseBooking.findOne({ partnerOrderId });
    
    if (!booking) {
      throw new Error('Booking not found');
    }
    
    return booking;
  } catch (error) {
    throw new Error(`Failed to retrieve booking: ${error.message}`);
  }
};

/**
 * Update booking
 */
const updateBooking = async (bookingId, updateData) => {
  try {
    const booking = await CruiseBooking.findOneAndUpdate(
      { bookingId },
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!booking) {
      throw new Error('Booking not found');
    }
    
    return booking;
  } catch (error) {
    throw new Error(`Failed to update booking: ${error.message}`);
  }
};

/**
 * Delete booking
 */
const deleteBooking = async (bookingId) => {
  try {
    const booking = await CruiseBooking.findOneAndDelete({ bookingId });
    
    if (!booking) {
      throw new Error('Booking not found');
    }
    
    return booking;
  } catch (error) {
    throw new Error(`Failed to delete booking: ${error.message}`);
  }
};

/**
 * Search bookings by criteria
 */
const searchBookings = async (criteria) => {
  try {
    const query = {};
    
    if (criteria.email) query.email = criteria.email;
    if (criteria.startDate) query.createdAt = { $gte: new Date(criteria.startDate) };
    if (criteria.endDate) query.createdAt = { $lte: new Date(criteria.endDate) };
    
    const bookings = await CruiseBooking.find(query).sort({ createdAt: -1 });
    return bookings;
  } catch (error) {
    throw new Error(`Failed to search bookings: ${error.message}`);
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
  searchBookings,
  generateBookingCode
};
