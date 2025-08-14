const mongoose = require('mongoose');

const cruiseBookingSchema = new mongoose.Schema({
    packageId: { type: String, required: true },
    packageName: { type: String },
    partnerOrderId: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    departureDetails: {
        departureDate: { type: Date, required: true },
        cabinType: { type: String, required: true },
    },
    passengersDetails: {
        adults: { type: Number, required: true, min: 0 },
        child: { type: Number, required: true, min: 0 },
        infant: { type: Number, required: true, min: 0 },
    },
    contractDetails: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        nationality: { type: String, required: true },
        address: { type: String, required: true },
    },
    consultantName: { type: String },
    bookingSummary: {
        bookingFee: { type: Number, required: true, min: 0 },
        total: { type: Number, required: true, min: 0 },
    },
    paymentDetails: { type: mongoose.Schema.Types.Mixed, required: true },
    orderInfo: { type: mongoose.Schema.Types.Mixed, required: true },
}, { timestamps: true });

module.exports = mongoose.model('CruiseBooking', cruiseBookingSchema);