const { successResponse } = require('../../../utils/response.util');
const { bookHotel, getAllBookings, getBookingsByEmail } = require('../services/booking.service');

const hotelBookHandler = async (req, res, next) => {
    try {
        const result = await bookHotel(req.body);
        successResponse(res, result, result.message);
    } catch (err) {
        next(err);
    }
};

const getAllBookingsHandler = async (req, res, next) => {
    try {
        const result = await getAllBookings();
        successResponse(res, result, result.message);
    } catch (err) {
        next(err);
    }
};

const getBookingsByEmailHandler = async (req, res, next) => {
    try {
        const result = await getBookingsByEmail(req.params.userEmail);
        successResponse(res, result, result.message);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    hotelBook: hotelBookHandler,
    getAllBookings: getAllBookingsHandler,
    getBookingsByEmail: getBookingsByEmailHandler,
};