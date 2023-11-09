
const axios = require('axios');
const crypto = require('crypto');

const createHeaders = () => {
    const apiKey = process.env.HOTELBEDS_API_KEY;
    const secret = process.env.HOTELBEDS_SECRET;
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

async function confirmBooking(bookingData) {
    try {
        const confirmUrl = `${process.env.HOTELBEDS_API_ENDPOINT}activity-api/3.0/bookings`;
        const headers = createHeaders();
        const response = await axios.put(confirmUrl, bookingData, { headers });
        console.log(response);
        if (response.status === 200) {
            const bookingConfirmation = response.data;
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
}
module.exports = {
    confirmBooking,
}
