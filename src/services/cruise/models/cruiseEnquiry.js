const mongoose = require('mongoose');

const cruiseEnquirySchema = new mongoose.Schema({
    packageId: { type: String },
    email: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String },
    departureDate: { type: Date },
    message: { type: String, required: true },
    status: { type: String, enum: ['pending', 'responded', 'closed'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('CruiseEnquiry', cruiseEnquirySchema);