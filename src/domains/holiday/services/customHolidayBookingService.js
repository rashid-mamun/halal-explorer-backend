const CustomHolidayBooking = require('../models/CustomHolidayBooking');
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
 * Create a new custom holiday booking
 */
const createCustomBooking = async (bookingData) => {
  try {
    const bookingId = uuidv4();
    const partnerOrderId = 'HFL' + generateBookingCode();
    const email = bookingData.contractDetails.email;
    
    const booking = new CustomHolidayBooking({
      ...bookingData,
      bookingId,
      partnerOrderId,
      email
    });
    
    await booking.save();
    return booking;
  } catch (error) {
    throw new Error(`Failed to create custom holiday booking: ${error.message}`);
  }
};

/**
 * Get all custom bookings
 */
const getAllCustomBookings = async () => {
  try {
    const bookings = await CustomHolidayBooking.find().sort({ createdAt: -1 });
    return bookings;
  } catch (error) {
    throw new Error(`Failed to retrieve custom bookings: ${error.message}`);
  }
};

/**
 * Get custom booking by ID
 */
const getCustomBookingById = async (bookingId) => {
  try {
    const booking = await CustomHolidayBooking.findOne({ bookingId });
    
    if (!booking) {
      throw new Error('Custom booking not found');
    }
    
    return booking;
  } catch (error) {
    throw new Error(`Failed to retrieve custom booking: ${error.message}`);
  }
};

/**
 * Get custom bookings by email
 */
const getCustomBookingsByEmail = async (email) => {
  try {
    const bookings = await CustomHolidayBooking.find({ email }).sort({ createdAt: -1 });
    return bookings;
  } catch (error) {
    throw new Error(`Failed to retrieve custom bookings by email: ${error.message}`);
  }
};

/**
 * Get custom booking by partner order ID
 */
const getCustomBookingByPartnerOrderId = async (partnerOrderId) => {
  try {
    const booking = await CustomHolidayBooking.findOne({ partnerOrderId });
    
    if (!booking) {
      throw new Error('Custom booking not found');
    }
    
    return booking;
  } catch (error) {
    throw new Error(`Failed to retrieve custom booking: ${error.message}`);
  }
};

/**
 * Update custom booking
 */
const updateCustomBooking = async (bookingId, updateData) => {
  try {
    const booking = await CustomHolidayBooking.findOneAndUpdate(
      { bookingId },
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!booking) {
      throw new Error('Custom booking not found');
    }
    
    return booking;
  } catch (error) {
    throw new Error(`Failed to update custom booking: ${error.message}`);
  }
};

/**
 * Delete custom booking
 */
const deleteCustomBooking = async (bookingId) => {
  try {
    const booking = await CustomHolidayBooking.findOneAndDelete({ bookingId });
    
    if (!booking) {
      throw new Error('Custom booking not found');
    }
    
    return booking;
  } catch (error) {
    throw new Error(`Failed to delete custom booking: ${error.message}`);
  }
};

/**
 * Search custom bookings by criteria
 */
const searchCustomBookings = async (criteria) => {
  try {
    const query = {};
    
    if (criteria.email) query.email = criteria.email;
    if (criteria.startDate) query.createdAt = { $gte: new Date(criteria.startDate) };
    if (criteria.endDate) query.createdAt = { $lte: new Date(criteria.endDate) };
    
    const bookings = await CustomHolidayBooking.find(query).sort({ createdAt: -1 });
    return bookings;
  } catch (error) {
    throw new Error(`Failed to search custom bookings: ${error.message}`);
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
  searchCustomBookings,
  generateBookingCode
};
