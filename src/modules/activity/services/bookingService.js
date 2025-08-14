const axios = require('axios');
const crypto = require('crypto');
const AppError = require('../../../utils/appError');
const { validateBookActivity } = require('../validators/activity.validator');

const createHeaders = (apiKey = process.env.HOTELBEDS_API_KEY, secret = process.env.HOTELBEDS_SECRET) => {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const signature = crypto.createHash('sha256').update(apiKey + secret + timestamp).digest('hex');
    return {
        Accept: 'application/json',
        'Api-key': apiKey,
        'X-Signature': signature,
        'Accept-Encoding': 'gzip',
    };
};

const confirmBooking = async (bookingData) => {
    validateBookActivity(bookingData);
    const url = `${process.env.HOTELBEDS_API_ENDPOINT}/activity-api/3.0/bookings`;
    const headers = createHeaders();
    try {
        const response = await axios.put(url, bookingData, { headers });
        if (response.status !== 200) {
            throw new AppError(response.data?.error_message || 'Booking confirmation failed', response.status || 400);
        }
        return response.data;
    } catch (error) {
        throw new AppError(error.response?.data?.error_message || 'Failed to confirm booking', error.response?.status || 500);
    }
};

module.exports = { confirmBooking };