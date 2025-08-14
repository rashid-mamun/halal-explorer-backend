const mongoose = require('mongoose');

const insuranceSchema = new mongoose.Schema({
    policyName: { type: String, required: true },
    travellerType: { type: String, required: true },
    policyType: { type: String, required: true },
    area: { type: String, required: true },
    restType: { type: String, required: true },
    productName: { type: String, required: true },
    ageGroup: { type: String, required: true },
    country: { type: String, required: true },
    duration: { type: String, required: true },
    premium: { type: Number, required: true, min: 0 },
    coverageDetails: { type: String, required: true },
    termsAndConditions: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Insurance', insuranceSchema);