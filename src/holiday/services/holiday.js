const { v4: uuidv4 } = require('uuid');
const { getClient } = require("../../config/database");

const generateBookingCode = () => {
    const length = 6; // You can adjust the length of the code as needed
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters.charAt(randomIndex);
    }
    return code;
};

const createBooking = async (bookingData) => {
    try {
        const client = await getClient();
        const db = client.db(process.env.DB_NAME);
        const collection = db.collection('holiday_packages_booking');
        const bookingId = uuidv4();
        const partnerOrderId = 'HFL' + generateBookingCode();
        const email = bookingData.contractDetails.email;
        const { passengersDetails, packageId } = bookingData;
        const bookingWithIds = {
            ...bookingData,
            bookingId,
            partnerOrderId,
            email
        };


        const holidayPackageCollection = db.collection('holiday_packages');
        const holidayPackage = await holidayPackageCollection.findOne({ id: packageId });
        if (!holidayPackage) {
            return {
                success: false,
                message: 'Booking failed because the requested package not available.',
            };
        }
        const requestedSeats = passengersDetails.single + passengersDetails.adults + passengersDetails.child + passengersDetails.infant;
        if (holidayPackage.seats < requestedSeats) {
            return {
                success: false,
                message: 'Booking failed because the requested number of seats exceeds available seats.',
            };
        }

        const bookingCollection = db.collection('bookingHistory');
        const result2 = await bookingCollection.insertOne(bookingWithIds);
        const result = await collection.insertOne(bookingWithIds);
        if (result.insertedId) {
            const updatedSeats = holidayPackage.seats - requestedSeats;
            const holidayPackageUpdate = await holidayPackageCollection.updateOne(
                { id: packageId },
                { $set: { seats: updatedSeats } },
                { returnOriginal: false }
            );
            if (holidayPackageUpdate.matchedCount === 0) {
                console.error('Holiday package not found or no changes applied.');
                return {
                    success: true,
                    message: 'Booking created successfully.But Holiday package not found or no changes applied.'
                };
            }
        }

        const createdBooking = { _id: result.insertedId, ...bookingWithIds };
        return {
            success: true,
            message: 'Booking created successfully.',
            data: createdBooking
        };
    } catch (error) {
        console.error('Failed to create booking:', error);
        return {
            success: false,
            message: 'Failed to create booking.'
        }
    }
};
const getAllBookings = async () => {
    try {
        const client = await getClient();
        const db = client.db(process.env.DB_NAME);
        const collection = db.collection('holiday_packages_booking');
        const allBookings = await collection.find({}).toArray();
        return {
            success: true,
            data: allBookings
        }

    } catch (error) {
        console.error('Failed to fetch bookings:', error);
        return {
            success: false,
            message: 'Failed to fetch bookings.'
        }
    }
};
const getBookingById = async (bookingId) => {
    try {
        const client = await getClient();
        const db = client.db(process.env.DB_NAME);
        const collection = db.collection('holiday_packages_booking');
        const booking = await collection.findOne({ bookingId });
        if (!booking) {
            return {
                success: false,
                message: 'Booking not found.'
            }
        }
        return {
            success: true,
            data: booking
        };
    } catch (error) {
        console.error('Failed to fetch booking by bookingId:', error);
        return {
            success: false,
            message: 'Failed to fetch booking by bookingId'
        }
    }
};
const getBookingsByEmail = async (email) => {
    try {
        const client = getClient();
        const db = client.db(process.env.DB_NAME);
        const collection = db.collection('holiday_packages_booking');
        const matchingBookings = await collection.find({ email }).toArray();

        if (matchingBookings.length === 0) {
            return {
                success: true,
                data: [],
                message: 'No bookings found for the provided email.',
            };
        }

        return {
            success: true,
            data: matchingBookings,
        };
    } catch (error) {
        console.error('Error fetching bookings by email:', error);
        return {
            success: false,
            error: 'Internal server error',
        };
    }
}

const createCustomBooking = async (bookingData) => {
    try {
        const client = await getClient();
        const db = client.db(process.env.DB_NAME);
        const collection = db.collection('custom_holiday_packages_booking');
        const bookingId = uuidv4();
        const partnerOrderId = 'HFL' + generateBookingCode();
        const email = bookingData.contractDetails.email;
        const bookingWithIds = {
            ...bookingData,
            bookingId,
            partnerOrderId,
            email
        };
        const bookingCollection = db.collection('bookingHistory');
        const result2 = await bookingCollection.insertOne(bookingWithIds);
        const result = await collection.insertOne(bookingWithIds);
        const createdBooking = { _id: result.insertedId, ...bookingWithIds };
        return {
            success: true,
            message: 'Booking created successfully.',
            data: createdBooking
        };
    } catch (error) {
        console.error('Failed to create booking:', error);
        return {
            success: false,
            message: 'Failed to create booking.'
        }
    }
};
const getCustomAllBookings = async () => {
    try {
        const client = await getClient();
        const db = client.db(process.env.DB_NAME);
        const collection = db.collection('custom_holiday_packages_booking');
        const allBookings = await collection.find({}).toArray();
        return {
            success: true,
            data: allBookings
        }

    } catch (error) {
        console.error('Failed to fetch bookings:', error);
        return {
            success: false,
            message: 'Failed to fetch bookings.'
        }
    }
};
const getCustomBookingById = async (bookingId) => {
    try {
        const client = await getClient();
        const db = client.db(process.env.DB_NAME);
        const collection = db.collection('custom_holiday_packages_booking');
        const booking = await collection.findOne({ bookingId });
        if (!booking) {
            return {
                success: false,
                message: 'Booking not found.'
            }
        }
        return {
            success: true,
            data: booking
        };
    } catch (error) {
        console.error('Failed to fetch booking by bookingId:', error);
        return {
            success: false,
            message: 'Failed to fetch booking by bookingId'
        }
    }
};
const getCustomBookingsByEmail = async (email) => {
    try {
        const client = getClient();
        const db = client.db(process.env.DB_NAME);
        const collection = db.collection('custom_holiday_packages_booking');
        const matchingBookings = await collection.find({ email }).toArray();

        if (matchingBookings.length === 0) {
            return {
                success: true,
                data: [],
                message: 'No bookings found for the provided email.',
            };
        }

        return {
            success: true,
            data: matchingBookings,
        };
    } catch (error) {
        console.error('Error fetching bookings by email:', error);
        return {
            success: false,
            error: 'Internal server error',
        };
    }
}
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
