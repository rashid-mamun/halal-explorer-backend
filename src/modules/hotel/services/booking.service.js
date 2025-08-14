const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const HotelBooking = require('../models/hotelBooking.model');
const AppError = require('../../../utils/appError');
const { validateHotelBook } = require('../validators/hotel.validator');

const createAuthHeader = () => {
    const auth = Buffer.from(`${process.env.RATEHAWK_USERNAME}:${process.env.RATEHAWK_PASSWORD}`).toString('base64');
    return `Basic ${auth}`;
};

const makeOrderFormRequest = async (data) => {
    const apiUrl = 'https://api.worldota.net/api/b2b/v3/hotel/order/booking/form/';
    try {
        const response = await axios.post(apiUrl, data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: createAuthHeader(),
            },
        });
        return response.data;
    } catch (error) {
        throw new AppError(error.response?.data?.error || 'Failed to fetch order form from RateHawk API', error.response?.status || 500);
    }
};

const makeOrderFinishRequest = async (data) => {
    const apiUrl = 'https://api.worldota.net/api/b2b/v3/hotel/order/booking/finish/';
    try {
        const response = await axios.post(apiUrl, data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: createAuthHeader(),
            },
        });
        return response.data;
    } catch (error) {
        throw new AppError(error.response?.data?.error || 'Failed to confirm booking with RateHawk API', error.response?.status || 500);
    }
};

const prepareOrderBookingRequestBody = (data, partnerOrderId) => ({
    partner_order_id: partnerOrderId,
    book_hash: data.book_hash,
    language: 'en',
    user_ip: '82.29.0.86',
});

const prepareBookingRequestBody = (data, partnerOrderId, formRes) => ({
    user: {
        email: data.userInfo.email,
        comment: data.userInfo.comment,
        phone: data.userInfo.phone,
    },
    supplier_data: {
        first_name_original: 'test',
        last_name_original: 'test',
        phone: '123123',
        email: 'test@example.com',
    },
    partner: {
        partner_order_id: partnerOrderId,
        comment: 'partner_comment',
        amount_sell_b2b2c: '6',
    },
    language: 'en',
    rooms: [{ guests: data.guests }],
    upsell_data: formRes.upsell_data,
    payment_type: formRes.payment_types[0],
});

const bookHotel = async (data) => {
    validateHotelBook(data);
    const partnerOrderId = 'HFL' + uuidv4();

    const orderBookingRequestBody = prepareOrderBookingRequestBody(data, partnerOrderId);
    const formResponse = await makeOrderFormRequest(orderBookingRequestBody);

    if (formResponse.status !== 'ok') {
        throw new AppError('Failed to fetch order form', 400);
    }

    const bookingRequestBody = prepareBookingRequestBody(data, partnerOrderId, formResponse.data);
    const finishResponse = await makeOrderFinishRequest(bookingRequestBody);

    if (finishResponse.status !== 'ok') {
        throw new AppError('Booking confirmation failed', 400);
    }

    const dbEntry = {
        email: data.userInfo.email,
        partnerOrderId,
        userInfo: data.userInfo,
        priceDetails: data.priceDetails,
        paymentDetails: data.paymentDetails,
        orderInfo: data.orderInfo,
        ratehawkRes: formResponse.data,
    };

    await HotelBooking.create(dbEntry);
    return { success: true, message: 'Hotel booked successfully' };
};

const getAllBookings = async () => {
    const bookings = await HotelBooking.find().lean();
    return {
        success: true,
        data: bookings,
        message: bookings.length === 0 ? 'No bookings found' : 'Bookings fetched successfully',
    };
};

const getBookingsByEmail = async (email) => {
    const bookings = await HotelBooking.find({ email }).lean();
    return {
        success: true,
        data: bookings,
        message: bookings.length === 0 ? 'No bookings found for the provided email' : 'Bookings fetched successfully',
    };
};

module.exports = {
    bookHotel,
    getAllBookings,
    getBookingsByEmail,
};