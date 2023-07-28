const Joi = require('joi');
const bookingService = require('../services/holiday');

// Define the Joi schema for the request body
const bookingSchema = Joi.object({
    packageId: Joi.string().required(),
    packageName: Joi.string(),
    departureDetails: Joi.object({
        departureDate: Joi.date().iso().required(),
    }).required(),
    passengersDetails: Joi.object({
        adults: Joi.number().integer().min(0).required(),
        single: Joi.number().integer().min(0).required(),
        child: Joi.number().integer().min(0).required(),
        infant: Joi.number().integer().min(0).required(),
    }).required(),
    contractDetails: Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        nationality: Joi.string().required(),
        emirates: Joi.string(),
        address: Joi.string().required(),
    }).required(),
    consultantName: Joi.string(),
    bookingSummary: Joi.object({
        bookingFee: Joi.number().min(0).required(),
        total: Joi.number().min(0).required(),
    }).required(),
});

const createBooking = async (req, res) => {
    try {

        const { error, value } = bookingSchema.validate(req.body, { abortEarly: false });

        if (error) {
            return res.status(400).json({ error: error.details.map((err) => err.message) });
        }
        const {
            packageId,
            packageName,
            departureDetails,
            passengersDetails,
            contractDetails,
            consultantName,
            bookingSummary,
        } = value;

        // Create the booking using the booking service
        const booking = await bookingService.createBooking({
            packageId,
            packageName,
            departureDetails,
            passengersDetails,
            contractDetails,
            consultantName,
            bookingSummary,
        });
        return res.status(201).json(booking);
    } catch (error) {
        console.error('Failed to create booking:', error);
        return res.status(500).json({ error: 'Failed to create booking.' });
    }
};
const getAllBookings = async (req, res) => {
    try {
        const allBookings = await bookingService.getAllBookings();
        return res.status(200).json(allBookings);
    } catch (error) {
        console.error('Failed to fetch bookings:', error);
        return res.status(500).json(
            { error: 'Failed to fetch bookings.' });
    }
};
const getBookingById = async (req, res) => {
    try {
        const bookingId = req.query.bookingId;
        const booking = await bookingService.getBookingById(bookingId);
        return res.status(200).json(booking);
    } catch (error) {
        console.error('Failed to fetch booking by bookingId:', error);
        return res.status(500).json({ error: 'Failed to fetch booking by bookingId.' });
    }
};

module.exports = {
    createBooking,
    getAllBookings,
    getBookingById,
};
