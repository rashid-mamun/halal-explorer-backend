const mongoose = require('mongoose');

const insuranceConfigSchema = new mongoose.Schema({
    travellerTypes: [{
        name: { type: String, required: true },
        description: { type: String },
    }],
    policyTypes: [{
        name: { type: String, required: true },
        description: { type: String },
    }],
    areas: [{
        name: { type: String, required: true },
        description: { type: String },
    }],
    restTypes: [{
        name: { type: String, required: true },
        description: { type: String },
    }],
    productNames: [{
        name: { type: String, required: true },
        description: { type: String },
    }],
    ageGroups: [{
        name: { type: String, required: true },
        minAge: { type: Number, required: true, min: 0 },
        maxAge: { type: Number, required: true, min: 0 },
    }],
    countries: [{
        name: { type: String, required: true },
        code: { type: String, required: true },
    }],
    durations: [{
        name: { type: String, required: true },
        days: { type: Number, required: true, min: 1 },
    }],
}, { timestamps: true });

module.exports = mongoose.model('InsuranceConfig', insuranceConfigSchema);