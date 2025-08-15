const InsuranceBooking = require('../models/InsuranceBooking');
const { v4: uuidv4 } = require('uuid');

/**
 * Generate unique partner order ID
 */
const generatePartnerOrderId = () => {
  return 'HFL' + uuidv4().replace(/-/g, '').substring(0, 16);
};

/**
 * Create a new insurance booking
 */
const createBooking = async (bookingData) => {
  try {
    const partnerOrderId = generatePartnerOrderId();
    
    const booking = new InsuranceBooking({
      ...bookingData,
      partnerOrderId
    });
    
    await booking.save();
    return booking;
  } catch (error) {
    throw new Error(`Failed to create insurance booking: ${error.message}`);
  }
};

/**
 * Get all bookings
 */
const getAllBookings = async () => {
  try {
    const bookings = await InsuranceBooking.find().sort({ createdAt: -1 });
    return bookings;
  } catch (error) {
    throw new Error(`Failed to retrieve bookings: ${error.message}`);
  }
};

/**
 * Get booking by ID
 */
const getBookingById = async (id) => {
  try {
    const booking = await InsuranceBooking.findById(id);
    
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
    const bookings = await InsuranceBooking.find({ email }).sort({ createdAt: -1 });
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
    const booking = await InsuranceBooking.findOne({ partnerOrderId });
    
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
const updateBooking = async (id, updateData) => {
  try {
    const booking = await InsuranceBooking.findByIdAndUpdate(
      id,
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
const deleteBooking = async (id) => {
  try {
    const booking = await InsuranceBooking.findByIdAndDelete(id);
    
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
    if (criteria.policyId) query.policyId = criteria.policyId;
    if (criteria.startDate) query['coverageDetails.startDate'] = { $gte: new Date(criteria.startDate) };
    if (criteria.endDate) query['coverageDetails.endDate'] = { $lte: new Date(criteria.endDate) };
    if (criteria.country) query['coverageDetails.country'] = criteria.country;
    if (criteria.minTotal) query['bookingSummary.total'] = { $gte: criteria.minTotal };
    if (criteria.maxTotal) {
      query['bookingSummary.total'] = query['bookingSummary.total'] || {};
      query['bookingSummary.total'].$lte = criteria.maxTotal;
    }
    
    const bookings = await InsuranceBooking.find(query).sort({ createdAt: -1 });
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
  generatePartnerOrderId
};
