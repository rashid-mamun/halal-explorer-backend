const { successResponse } = require('../../../utils/response.util');
const { confirmBooking } = require('../services/booking.service');

const activityBookHandler = async (req, res, next) => {
    try {
        const booking = await confirmBooking(req.body);
        successResponse(res, booking, 'Booking confirmed successfully');
    } catch (err) {
        next(err);
    }
};

module.exports = { activityBook: activityBookHandler };