const Joi = require('joi');
const bookingService = require('../services/holiday');

// Define the Joi schema for the request body
const customBookingSchema = Joi.object({
    idInfo: Joi.object().required(),
    departureDetails: Joi.object().required(),
    passengersDetails: Joi.object().required(),
    contractDetails: Joi.object().required(),
    consultantName: Joi.string(),
    bookingSummary: Joi.object().required(),
    paymentDetails: Joi.object().required(),
    orderInfo: Joi.object().required(),

});
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
    paymentDetails: Joi.object().required(),
    orderInfo: Joi.object().required(),

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
            paymentDetails,
            orderInfo
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
            paymentDetails,
            orderInfo
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
const getBookingsByEmail = async (req, res) => {
    const { email } = req.params;

    try {
        console.log("---- Get email book calling ----------", email);
        const matchingBookings = await bookingService.getBookingsByEmail(email);
        res.json(matchingBookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const createCustomBooking = async (req, res) => {
    try {

        const { error, value } = customBookingSchema.validate(req.body, { abortEarly: false });

        if (error) {
            return res.status(400).json({ error: error.details.map((err) => err.message) });
        }
        const booking = await bookingService.createCustomBooking(req.body);
        return res.status(201).json(booking);
    } catch (error) {
        console.error('Failed to create booking:', error);
        return res.status(500).json({ error: 'Failed to create booking.' });
    }
};
const getCustomAllBookings = async (req, res) => {
    try {
        const allBookings = await bookingService.getCustomAllBookings();
        return res.status(200).json(allBookings);
    } catch (error) {
        console.error('Failed to fetch bookings:', error);
        return res.status(500).json(
            { error: 'Failed to fetch bookings.' });
    }
};
const getCustomBookingById = async (req, res) => {
    try {
        const bookingId = req.query.bookingId;
        const booking = await bookingService.getCustomBookingById(bookingId);
        return res.status(200).json(booking);
    } catch (error) {
        console.error('Failed to fetch booking by bookingId:', error);
        return res.status(500).json({ error: 'Failed to fetch booking by bookingId.' });
    }
};
const getCustomBookingsByEmail = async (req, res) => {
    const { email } = req.params;

    try {
        console.log("---- Get email book calling ----------", email);
        const matchingBookings = await bookingService.getCustomBookingsByEmail(email);
        res.json(matchingBookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
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
    getCustomBookingsByEmail
};
