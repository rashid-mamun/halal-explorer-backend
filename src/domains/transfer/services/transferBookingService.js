const TransferBooking = require('../models/TransferBooking');
const axios = require('axios');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

/**
 * Create HotelBeds API headers
 */
const createHeaders = () => {
  const apiKey = process.env.HOTELBEDS_TRANSFER_API_KEY;
  const secret = process.env.HOTELBEDS_TRANSFER_SECRET;
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signature = crypto
    .createHash('sha256')
    .update(apiKey + secret + timestamp)
    .digest('hex');

  return {
    Accept: 'application/json',
    'Api-key': apiKey,
    'X-Signature': signature,
    'Accept-Encoding': 'gzip',
    'Content-Type': 'application/json',
  };
};

/**
 * Fetch data from HotelBeds API
 */
const fetchHotelBedsData = async (url, method, data, successMessage, errorMessage) => {
  const headers = createHeaders();

  try {
    const config = {
      method,
      url,
      headers,
      ...(data && { data })
    };

    const response = await axios(config);

    if (response.status === 204) {
      return {
        success: false,
        error: "No content available.",
      };
    }

    if (response.status !== 200) {
      return {
        success: false,
        error: `Request failed with status code ${response.status}`,
      };
    }

    if (!response.data) {
      return {
        success: false,
        error: "Unable to fetch the requested data. Please try again later.",
      };
    }
    
    return {
      success: true,
      message: successMessage,
      data: response.data,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: errorMessage,
    };
  }
};

/**
 * Generate unique booking ID
 */
const generateBookingId = () => {
  return `TRANSFER_BOOK_${uuidv4().replace(/-/g, '').substring(0, 16).toUpperCase()}`;
};

/**
 * Generate partner order ID
 */
const generatePartnerOrderId = () => {
  return `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

/**
 * Create transfer booking
 */
const createBooking = async (bookingData) => {
  try {
    const {
      availabilityRequestId,
      routeId,
      passengerDetails,
      selectedVehicle,
      pickupDetails,
      dropoffDetails,
      pricing,
      customerInfo
    } = bookingData;

    // Generate unique IDs
    const bookingId = generateBookingId();
    const partnerOrderId = generatePartnerOrderId();

    // Create booking record
    const booking = new TransferBooking({
      bookingId,
      partnerOrderId,
      availabilityRequestId,
      routeId,
      passengerDetails,
      selectedVehicle,
      pickupDetails,
      dropoffDetails,
      pricing,
      customerInfo,
      status: 'pending'
    });

    await booking.save();

    // Prepare booking payload for HotelBeds API
    const payload = {
      partnerOrderId,
      availabilityRequestId,
      routeId,
      passengerDetails,
      selectedVehicle,
      pickupDetails,
      dropoffDetails,
      pricing,
      customerInfo
    };

    // Call HotelBeds API to confirm booking
    const url = `${process.env.HOTELBEDS_API_ENDPOINT}/transfer-api/1.0/bookings`;
    const response = await fetchHotelBedsData(
      url,
      'POST',
      payload,
      'Booking created successfully',
      'Failed to create booking'
    );

    // Update booking with HotelBeds response
    booking.hotelBedsData = response.data;
    if (response.success) {
      booking.hotelBedsReference = response.data.reference || response.data.bookingId;
      booking.status = 'confirmed';
    } else {
      booking.status = 'failed';
    }
    await booking.save();

    if (!response.success) {
      return response;
    }

    return {
      success: true,
      message: 'Booking created successfully',
      data: {
        bookingId,
        partnerOrderId,
        hotelBedsReference: booking.hotelBedsReference,
        status: booking.status,
        booking: booking
      }
    };
  } catch (error) {
    throw new Error(`Failed to create booking: ${error.message}`);
  }
};

/**
 * Get booking by ID
 */
const getBookingById = async (bookingId) => {
  try {
    const booking = await TransferBooking.findOne({ bookingId });
    
    if (!booking) {
      throw new Error('Booking not found');
    }

    return {
      success: true,
      message: 'Booking retrieved successfully',
      data: booking
    };
  } catch (error) {
    throw new Error(`Failed to get booking: ${error.message}`);
  }
};

/**
 * Get booking by HotelBeds reference
 */
const getBookingByHotelBedsReference = async (hotelBedsReference) => {
  try {
    const booking = await TransferBooking.findOne({ hotelBedsReference });
    
    if (!booking) {
      throw new Error('Booking not found');
    }

    return {
      success: true,
      message: 'Booking retrieved successfully',
      data: booking
    };
  } catch (error) {
    throw new Error(`Failed to get booking: ${error.message}`);
  }
};

/**
 * Get all bookings with pagination
 */
const getAllBookings = async (limit = 10, offset = 0, status = null) => {
  try {
    const query = {};
    if (status) {
      query.status = status;
    }

    const bookings = await TransferBooking.find(query)
      .select('bookingId partnerOrderId hotelBedsReference status customerInfo createdAt')
      .limit(limit)
      .skip(offset)
      .sort({ createdAt: -1 });

    const total = await TransferBooking.countDocuments(query);

    return {
      success: true,
      message: 'Bookings retrieved successfully',
      data: {
        bookings,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total
        }
      }
    };
  } catch (error) {
    throw new Error(`Failed to get bookings: ${error.message}`);
  }
};

/**
 * Get bookings by customer email
 */
const getBookingsByEmail = async (email, limit = 10, offset = 0) => {
  try {
    const bookings = await TransferBooking.find({ 'customerInfo.email': email })
      .select('bookingId partnerOrderId hotelBedsReference status pickupDetails dropoffDetails pricing createdAt')
      .limit(limit)
      .skip(offset)
      .sort({ createdAt: -1 });

    const total = await TransferBooking.countDocuments({ 'customerInfo.email': email });

    return {
      success: true,
      message: 'Customer bookings retrieved successfully',
      data: {
        bookings,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total
        }
      }
    };
  } catch (error) {
    throw new Error(`Failed to get customer bookings: ${error.message}`);
  }
};

/**
 * Update booking status
 */
const updateBookingStatus = async (bookingId, status) => {
  try {
    const booking = await TransferBooking.findOneAndUpdate(
      { bookingId },
      { status },
      { new: true }
    );
    
    if (!booking) {
      throw new Error('Booking not found');
    }

    return {
      success: true,
      message: 'Booking status updated successfully',
      data: booking
    };
  } catch (error) {
    throw new Error(`Failed to update booking status: ${error.message}`);
  }
};

/**
 * Cancel booking
 */
const cancelBooking = async (bookingId) => {
  try {
    const booking = await TransferBooking.findOne({ bookingId });
    
    if (!booking) {
      throw new Error('Booking not found');
    }

    if (booking.status === 'cancelled') {
      throw new Error('Booking is already cancelled');
    }

    // Call HotelBeds API to cancel booking
    if (booking.hotelBedsReference) {
      const url = `${process.env.HOTELBEDS_API_ENDPOINT}/transfer-api/1.0/bookings/${booking.hotelBedsReference}/cancellation`;
      const response = await fetchHotelBedsData(
        url,
        'POST',
        null,
        'Booking cancelled successfully',
        'Failed to cancel booking'
      );

      if (response.success) {
        booking.status = 'cancelled';
        booking.hotelBedsData = { ...booking.hotelBedsData, cancellation: response.data };
        await booking.save();
      } else {
        return response;
      }
    } else {
      booking.status = 'cancelled';
      await booking.save();
    }

    return {
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    };
  } catch (error) {
    throw new Error(`Failed to cancel booking: ${error.message}`);
  }
};

/**
 * Get booking statistics
 */
const getBookingStatistics = async () => {
  try {
    const stats = await TransferBooking.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const total = await TransferBooking.countDocuments();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayCount = await TransferBooking.countDocuments({
      createdAt: { $gte: today }
    });

    const totalRevenue = await TransferBooking.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$pricing.total' }
        }
      }
    ]);

    return {
      success: true,
      message: 'Statistics retrieved successfully',
      data: {
        total,
        today: todayCount,
        totalRevenue: totalRevenue[0]?.total || 0,
        byStatus: stats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {})
      }
    };
  } catch (error) {
    throw new Error(`Failed to get statistics: ${error.message}`);
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
