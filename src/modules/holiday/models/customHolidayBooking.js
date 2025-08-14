const mongoose = require('mongoose');

const customBookingSchema = new mongoose.Schema({
    partnerOrderId: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    idInfo: { type: mongoose.Schema.Types.Mixed, required: true },
    departureDetails: { type: mongoose.Schema.Types.Mixed, required: true },
    passengersDetails: { type: mongoose.Schema.Types.Mixed, required: true },
    contractDetails: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        nationality: { type: String, required: true },
        emirates: { type: String },
        address: { type: String, required: true },
    },
    consultantName: { type: String },
    bookingSummary: { type: mongoose.Schema.Types.Mixed, required: true },
    paymentDetails: { type: mongoose.Schema.Types.Mixed, required: true },
    orderInfo: { type: mongoose.Schema.Types.Mixed, required: true },
}, { timestamps: true });

module.exports = mongoose.model('CustomHolidayBooking', customBookingSchema);