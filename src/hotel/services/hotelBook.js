const { getClient } = require("../../config/database");
const axios = require('axios');
const btoa = require('btoa');
const { v4: uuidv4 } = require('uuid');

function generateUniqueSearchId() {
    return uuidv4();
}
const bookHotel = async (data) => {
    try {
        const partnerOrderId = 'HFL' + generateUniqueSearchId();
        const client = getClient();
        const db = client.db(process.env.DB_NAME);

        // Prepare the order booking request body
        const orderBookingRequestBody = prepareOrderBookingRequestBody(data, partnerOrderId);

        // Make a request to get the order form data
        const formResponse = await makeOrderFormRequest(orderBookingRequestBody);
        console.log("formResponse", formResponse);

        if (formResponse.status === 'ok') {
            const bookingRequestBody = prepareBookingRequestBody(data, partnerOrderId, formResponse.data);
            const finishResponse = await makeOrderFinishRequest(bookingRequestBody);

            if (finishResponse.status === 'ok') {
                const dbEntry = {
                    email: data.userInfo.email,
                    partnerOrderId,
                    userInfo: data.userInfo,
                    priceDetails: data.priceDetails,
                    paymentDetails: data.paymentDetails,
                    orderInfo: data.orderInfo,
                    ratehawkRes: formResponse.data,
                };

                console.log('DbEntry:\n', JSON.stringify(dbEntry));
                const collection = db.collection('hotelBookingHistory');
                const bookingCollection = db.collection('bookingHistory');
                const result = await collection.insertOne(dbEntry);
                const result2 = await bookingCollection.insertOne(dbEntry);
                // console.log(`Inserted ${result.insertedCount} document into the database`);

                return {
                    success: true,
                    message: 'Hotel Booked!',
                };
            } else {
                return {
                    success: false,
                    data: finishResponse,
                };
            }
        } else {
            return {
                success: false,
                data: formResponse,
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
        const collection = db.collection('hotelBookingHistory');
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
        const collection = db.collection('hotelBookingHistory');
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

const prepareOrderBookingRequestBody = (data, partnerOrderId) => ({
    partner_order_id: partnerOrderId,
    book_hash: data.book_hash,
    language: "en",
    user_ip: '82.29.0.86'
});
const prepareBookingRequestBody = (data, partnerOrderId, formRes) => {
    return {
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
        rooms: [
            {
                'guests': data.guests
            }
        ],
        upsell_data: formRes.upsell_data,
        payment_type: formRes.payment_types[0],
    };
};
const makeOrderFinishRequest = async (data) => {

    const authHeader = `Basic ${btoa(`${process.env.RATEHAWK_USERNAME}:${process.env.RATEHAWK_PASSWORD}`)}`;
    const apiUrl = 'https://api.worldota.net/api/b2b/v3/hotel/order/booking/finish/';
    console.log('makeOrderFinishRequest\n', JSON.stringify(data));
    try {
        const response = await axios.post(apiUrl, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader
            },
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            error: 'Internal server error'
        }
    }
};
const makeOrderFormRequest = async (data) => {

    const authHeader = `Basic ${btoa(`${process.env.RATEHAWK_USERNAME}:${process.env.RATEHAWK_PASSWORD}`)}`;
    const apiUrl = 'https://api.worldota.net/api/b2b/v3/hotel/order/booking/form/';
    console.log('makeOrderFormRequest\n', JSON.stringify(data));
    try {
        const response = await axios.post(apiUrl, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader
            },
        });
        // console.log(response.data);
        return response.data;
    } catch (error) {
        // console.error(error);
        return {
            success: false,
            error: 'Internal server error'
        }
    }
};
module.exports = {
    bookHotel,
    getAllBookings,
    getBookingsByEmail
};
