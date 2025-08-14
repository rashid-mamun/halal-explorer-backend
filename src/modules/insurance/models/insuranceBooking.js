const mongoose = require('mongoose');

const insuranceBookingSchema = new mongoose.Schema({
    policyId: { type: String, required: true },
    policyName: { type: String },
    partnerOrderId: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    travellerDetails: {
        travellerType: { type: String, required: true },
        ageGroup: { type: String, required: true },
        count: { type: Number, required: true, min: 1 },
    },
    coverageDetails: {
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        country: { type: String, required: true },
    },
    contractDetails: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        nationality: { type: String, required: true },
        address: { type: String, required: true },
    },
    bookingSummary: {
        premium: { type: Number, required: true, min: 0 },
        total: { type: Number, required: true, min: 0 },
    },
    paymentDetails: { type: mongoose.Schema.Types.Mixed, required: true },
    orderInfo: { type: mongoose.Schema.Types.Mixed, required: true },
}, { timestamps: true });

module.exports = mongoose.model('InsuranceBooking', insuranceBookingSchema);