const { getClient } = require("../../config/database");
const axios = require('axios');
const btoa = require('btoa');
const { v4: uuidv4 } = require('uuid');

function generateUniqueSearchId() {
    return uuidv4();
}
const bookInsurance = async (data) => {
  try {
      if (data.userInfo && data.priceDetails && data.paymentDetails && data.orderInfo) {
          const partnerOrderId = 'HFL' + generateUniqueSearchId();
          const client = getClient();
          const db = client.db(process.env.DB_NAME);

          const dbEntry = {
              email: data.userInfo.email,
              partnerOrderId,
              userInfo: data.userInfo,
              priceDetails: data.priceDetails,
              paymentDetails: data.paymentDetails,
              orderInfo: data.orderInfo,
          };

          console.log('DbEntry:\n', JSON.stringify(dbEntry));
          const collection = db.collection('insuranceBookingHistory');
          const bookingCollection = db.collection('bookingHistory');

          const result = await collection.insertOne(dbEntry);
          const result2 = await bookingCollection.insertOne(dbEntry);

          return {
              success: true,
              message: 'Insurance Booked!',
          };
      } else {
          return {
              success: false,
              error: 'Incomplete data provided.',
          };
      }
  } catch (err) {
      console.error(err);
      return {
          success: false,
          error: 'Internal server error',
      };
  }
};

const getAllBookings = async () => {
    try {
        const client = getClient();
        const db = client.db(process.env.DB_NAME);
        const collection = db.collection('insuranceBookingHistory');
        const allBookings = await collection.find({}).toArray();

        if (allBookings.length === 0) {
            return {
                success: true,
                data: [],
                message: 'No bookings found.',
            };
        }

        return {
            success: true,
            data: allBookings,
        };
    } catch (error) {
        console.error('Error fetching all bookings:', error);
        return {
            success: false,
            error: 'Internal server error',
        };
    }
}

const getBookingsByEmail = async (email) => {
    try {
        const client = getClient();
        const db = client.db(process.env.DB_NAME);
        const collection = db.collection('insuranceBookingHistory');
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
    bookInsurance,
    getAllBookings,
    getBookingsByEmail
};
