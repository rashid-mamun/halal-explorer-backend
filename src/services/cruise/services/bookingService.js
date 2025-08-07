const mongoose = require('mongoose');
const CruiseBooking = require('../models/cruiseBooking');
const CruiseEnquiry = require('../models/cruiseEnquiry');
const CruisePackage = require('../models/cruisePackage');
const { generateBookingCode } = require('../../../utils/generateBookingCode');

const createBooking = async (bookingData) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { packageId } = bookingData;
        const cruisePackage = await CruisePackage.findById(packageId).session(session);
        if (!cruisePackage) {
            throw new Error('Cruise package not found');
        }

        const booking = new CruiseBooking({
            ...bookingData,
            partnerOrderId: `CR${generateBookingCode()}`,
            email: bookingData.contractDetails.email,
        });
        await booking.save({ session });
        await session.commitTransaction();
        return { success: true, data: booking, message: 'Cruise booking created successfully' };
    } catch (error) {
        await session.abortTransaction();
        return { success: false, error: error.message };
    } finally {
        session.endSession();
    }
};

const getAllBookings = async () => {
    try {
        const bookings = await CruiseBooking.find({});
        return { success: true, data: bookings, message: bookings.length === 0 ? 'No cruise bookings found' : undefined };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

const getBookingById = async (id) => {
    try {
        if (!mongoose.isValidObjectId(id)) {
            return { success: false, error: 'Invalid cruise booking ID' };
        }
        const booking = await CruiseBooking.findById(id);
        if (!booking) {
            return { success: false, error: 'Cruise booking not found' };
        }
        return { success: true, data: booking };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

const getBookingsByEmail = async (email) => {
    try {
        const bookings = await CruiseBooking.find({ email });
        return { success: true, data: bookings, message: bookings.length === 0 ? 'No cruise bookings found for the provided email' : undefined };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

const createEnquiry = async (enquiryData) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const enquiry = new CruiseEnquiry(enquiryData);
        await enquiry.save({ session });
        await session.commitTransaction();
        return { success: true, data: enquiry, message: 'Cruise enquiry created successfully' };
    } catch (error) {
        await session.abortTransaction();
        return { success: false, error: error.message };
    } finally {
        session.endSession();
    }
};

const getAllEnquiries = async () => {
    try {
        const enquiries = await CruiseEnquiry.find({});
        return { success: true, data: enquiries, message: enquiries.length === 0 ? 'No cruise enquiries found' : undefined };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

const getEnquiryById = async (id) => {
    try {
        if (!mongoose.isValidObjectId(id)) {
            return { success: false, error: 'Invalid cruise enquiry ID' };
        }
        const enquiry = await CruiseEnquiry.findById(id);
        if (!enquiry) {
            return { success: false, error: 'Cruise enquiry not found' };
        }
        return { success: true, data: enquiry };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

module.exports = {
    createBooking,
    getAllBookings,
    getBookingById,
    getBookingsByEmail,
    createEnquiry,
    getAllEnquiries,
    getEnquiryById,
};