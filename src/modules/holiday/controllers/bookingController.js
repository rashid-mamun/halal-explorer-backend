const { validateBooking, validateCustomBooking } = require('../../../utils/validation');
const bookingService = require('../services/bookingService');

const createBooking = async (req, res) => {
    try {
        const { error, value } = validateBooking(req.body);
        if (error) {
            return res.status(400).json({ error: error.details.map(err => err.message).join(', ') });
        }
        const result = await bookingService.createBooking(value);
        return result.success
            ? res.status(201).json(result)
            : res.status(400).json({ error: result.error });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create booking' });
    }
};

const getAllBookings = async (req, res) => {
    try {
        const result = await bookingService.getAllBookings();
        return result.success
            ? res.status(200).json(result.data)
            : res.status(500).json({ error: result.error });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch bookings' });
    }
};

const getBookingById = async (req, res) => {
    try {
        const result = await bookingService.getBookingById(req.query.id);
        return result.success
            ? res.status(200).json(result.data)
            : res.status(404).json({ error: result.error });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch booking' });
    }
};

const getBookingsByEmail = async (req, res) => {
    try {
        const result = await bookingService.getBookingsByEmail(req.params.userEmail);
        return result.success
            ? res.status(200).json(result.data)
            : res.status(500).json({ error: result.error });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch bookings by email' });
    }
};

const createCustomBooking = async (req, res) => {
    try {
        const { error, value } = validateCustomBooking(req.body);
        if (error) {
            return res.status(400).json({ error: error.details.map(err => err.message).join(', ') });
        }
        const result = await bookingService.createCustomBooking(value);
        return result.success
            ? res.status(201).json(result)
            : res.status(400).json({ error: result.error });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create custom booking' });
    }
};

const getCustomAllBookings = async (req, res) => {
    try {
        const result = await bookingService.getCustomAllBookings();
        return result.success
            ? res.status(200).json(result.data)
            : res.status(500).json({ error: result.error });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch custom bookings' });
    }
};

const getCustomBookingById = async (req, res) => {
    try {
        const result = await bookingService.getCustomBookingById(req.query.id);
        return result.success
            ? res.status(200).json(result.data)
            : res.status(404).json({ error: result.error });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch custom booking' });
    }
};

const getCustomBookingsByEmail = async (req, res) => {
    try {
        const result = await bookingService.getCustomBookingsByEmail(req.params.userEmail);
        return result.success
            ? res.status(200).json(result.data)
            : res.status(500).json({ error: result.error });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch custom bookings by email' });
    }
};

module.exports = {
    createBooking,
    getAllBookings,
    getBookingById,
    getBookingsByEmail,
    createCustomBooking,
    getCustomAllBookings,
    getCustomBookingById,
    getCustomBookingsByEmail,
};