const mongoose = require('mongoose');
const Booking = require('../models/booking');
const CustomBooking = require('../models/customBooking');
const HolidayPackage = require('../models/holidayPackage');
const { generateBookingCode } = require('../../../utils/generateBookingCode');

const createBooking = async (bookingData) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { packageId } = bookingData;
        const holidayPackage = await HolidayPackage.findById(packageId).session(session);
        if (!holidayPackage) {
            throw new Error('Holiday package not found');
        }

        const booking = new Booking({
            ...bookingData,
            partnerOrderId: `HFL${generateBookingCode()}`,
            email: bookingData.contractDetails.email,
        });
        await booking.save({ session });
        await session.commitTransaction();
        return { success: true, data: booking, message: 'Booking created successfully' };
    } catch (error) {
        await session.abortTransaction();
        return { success: false, error: error.message };
    } finally {
        session.endSession();
    }
};

const getAllBookings = async () => {
    try {
        const bookings = await Booking.find({});
        return { success: true, data: bookings, message: bookings.length === 0 ? 'No bookings found' : undefined };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

const getBookingById = async (id) => {
    try {
        if (!mongoose.isValidObjectId(id)) {
            return { success: false, error: 'Invalid booking ID' };
        }
        const booking = await Booking.findById(id);
        if (!booking) {
            return { success: false, error: 'Booking not found' };
        }
        return { success: true, data: booking };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

const getBookingsByEmail = async (email) => {
    try {
        const bookings = await Booking.find({ email });
        return { success: true, data: bookings, message: bookings.length === 0 ? 'No bookings found for the provided email' : undefined };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

const createCustomBooking = async (customBookingData) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const customBooking = new CustomBooking({
            ...customBookingData,
            partnerOrderId: `HFL${generateBookingCode()}`,
            email: customBookingData.contractDetails.email,
        });
        await customBooking.save({ session });
        await session.commitTransaction();
        return { success: true, data: customBooking, message: 'Custom booking created successfully' };
    } catch (error) {
        await session.abortTransaction();
        return { success: false, error: error.message };
    } finally {
        session.endSession();
    }
};

const getCustomAllBookings = async () => {
    try {
        const bookings = await CustomBooking.find({});
        return { success: true, data: bookings, message: bookings.length === 0 ? 'No custom bookings found' : undefined };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

const getCustomBookingById = async (id) => {
    try {
        if (!mongoose.isValidObjectId(id)) {
            return { success: false, error: 'Invalid custom booking ID' };
        }
        const booking = await CustomBooking.findById(id);
        if (!booking) {
            return { success: false, error: 'Custom booking not found' };
        }
        return { success: true, data: booking };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

const getCustomBookingsByEmail = async (email) => {
    try {
        const bookings = await CustomBooking.find({ email });
        return { success: true, data: bookings, message: bookings.length === 0 ? 'No custom bookings found for the provided email' : undefined };
    } catch (error) {
        return { success: false, error: error.message };
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