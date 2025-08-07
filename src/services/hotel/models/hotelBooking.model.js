const mongoose = require('mongoose');
const { Schema } = mongoose;

const hotelBookingSchema = new Schema({
    email: { type: String, required: true },
    partnerOrderId: { type: String, required: true, unique: true },
    userInfo: { type: Schema.Types.Mixed, required: true },
    priceDetails: { type: Schema.Types.Mixed, required: true },
    paymentDetails: { type: Schema.Types.Mixed, required: true },
    orderInfo: { type: Schema.Types.Mixed, required: true },
    ratehawkRes: { type: Schema.Types.Mixed, required: true },
}, { timestamps: true });

module.exports = mongoose.model('HotelBooking', hotelBookingSchema);