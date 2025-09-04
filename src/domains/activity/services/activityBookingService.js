const ActivityBooking = require('../models/ActivityBooking');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const crypto = require('crypto');

const createHeaders = () => {
  const apiKey = process.env.HOTELBEDS_ACTIVITY_API_KEY;
  const secret = process.env.HOTELBEDS_ACTIVITY_SECRET;
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
  };
};

const generateBookingId = () => {
  return `ACT-${uuidv4().replace(/-/g, '').substring(0, 12).toUpperCase()}`;
};

const createActivityBooking = async (bookingData) => {
  try {
    const bookingId = generateBookingId();
    const activityBooking = new ActivityBooking({
      bookingId,
      ...bookingData,
      status: 'pending'
    });
    await activityBooking.save();
    return activityBooking;
  } catch (error) {
    throw new Error(`Failed to create activity booking: ${error.message}`);
  }
};

const getActivityBookingById = async (bookingId) => {
  try {
    const activityBooking = await ActivityBooking.findOne({ bookingId });
    return activityBooking;
  } catch (error) {
    throw new Error(`Failed to get activity booking: ${error.message}`);
  }
};

const getAllActivityBookings = async (page = 1, pageSize = 100) => {
  try {
    const skip = (page - 1) * pageSize;
    const activityBookings = await ActivityBooking.find()
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 });

    const total = await ActivityBooking.countDocuments();

    return {
      data: activityBookings,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  } catch (error) {
    throw new Error(`Failed to get all activity bookings: ${error.message}`);
  }
};

const updateActivityBooking = async (bookingId, updateData) => {
  try {
    const activityBooking = await ActivityBooking.findOneAndUpdate(
      { bookingId },
      updateData,
      { new: true }
    );
    return activityBooking;
  } catch (error) {
    throw new Error(`Failed to update activity booking: ${error.message}`);
  }
};

const deleteActivityBooking = async (bookingId) => {
  try {
    const activityBooking = await ActivityBooking.findOneAndDelete({ bookingId });
    return activityBooking;
  } catch (error) {
    throw new Error(`Failed to delete activity booking: ${error.message}`);
  }
};

const searchActivityBookings = async (searchParams) => {
  try {
    const {
      activityCode,
      status,
      email,
      dateFrom,
      dateTo,
      page = 1,
      pageSize = 100
    } = searchParams;
    const skip = (page - 1) * pageSize;

    let query = {};

    if (activityCode) {
      query.activityCode = activityCode;
    }

    if (status) {
      query.status = status;
    }

    if (email) {
      query['holder.email'] = { $regex: email, $options: 'i' };
    }

    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) {
        query.createdAt.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        query.createdAt.$lte = new Date(dateTo);
      }
    }

    const activityBookings = await ActivityBooking.find(query)
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 });

    const total = await ActivityBooking.countDocuments(query);

    return {
      data: activityBookings,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  } catch (error) {
    throw new Error(`Failed to search activity bookings: ${error.message}`);
  }
};

const confirmBooking = async (bookingData) => {
  try {
    const confirmUrl = `${process.env.HOTELBEDS_API_ENDPOINT}activity-api/3.0/bookings`;
    const headers = createHeaders();

    const response = await axios.put(confirmUrl, bookingData, { headers });
    console.log(response);

    if (response.status === 200) {
      const bookingConfirmation = response.data;

      // Update booking status in database
      if (bookingData.bookingId) {
        await updateActivityBooking(bookingData.bookingId, {
          status: 'confirmed',
          hotelBedsReference: bookingConfirmation.reference,
          hotelBedsData: bookingConfirmation
        });
      }

      return {
        success: true,
        message: 'Booking Confirmed',
        bookingConfirmation
      };
    } else {
      const errorMessage = response.data && response.data.error_message
        ? response.data.error_message
        : 'Booking Confirmation Failed';

      return {
        success: false,
        message: errorMessage,
        error: response.data,
      };
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'Internal Server Error'
    };
  }
};

const cancelBooking = async (bookingId, cancellationData) => {
  try {
    const cancelUrl = `${process.env.HOTELBEDS_API_ENDPOINT}activity-api/3.0/bookings/${bookingId}`;
    const headers = createHeaders();

    const response = await axios.delete(cancelUrl, {
      headers,
      data: cancellationData
    });

    if (response.status === 200) {
      // Update booking status in database
      await updateActivityBooking(bookingId, {
        status: 'cancelled',
        hotelBedsData: response.data
      });

      return {
        success: true,
        message: 'Booking Cancelled Successfully',
        data: response.data
      };
    } else {
      return {
        success: false,
        message: 'Booking Cancellation Failed',
        error: response.data,
      };
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'Internal Server Error'
    };
  }
};

const getBookingStatistics = async () => {
  try {
    const totalBookings = await ActivityBooking.countDocuments();
    const confirmedBookings = await ActivityBooking.countDocuments({ status: 'confirmed' });
    const pendingBookings = await ActivityBooking.countDocuments({ status: 'pending' });
    const cancelledBookings = await ActivityBooking.countDocuments({ status: 'cancelled' });
    const completedBookings = await ActivityBooking.countDocuments({ status: 'completed' });

    // Get recent bookings (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentBookings = await ActivityBooking.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    return {
      success: true,
      data: {
        total: totalBookings,
        confirmed: confirmedBookings,
        pending: pendingBookings,
        cancelled: cancelledBookings,
        completed: completedBookings,
        recent: recentBookings
      }
    };
  } catch (error) {
    throw new Error(`Failed to get booking statistics: ${error.message}`);
  }
};

module.exports = {
  createActivityBooking,
  getActivityBookingById,
  getAllActivityBookings,
  updateActivityBooking,
  deleteActivityBooking,
  searchActivityBookings,
  confirmBooking,
  cancelBooking,
  getBookingStatistics
};
