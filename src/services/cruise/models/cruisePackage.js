const mongoose = require('mongoose');

const cruisePackageSchema = new mongoose.Schema({
    packageName: { type: String, required: true },
    cruiseLineId: { type: mongoose.Schema.Types.ObjectId, ref: 'CruiseLine', required: true },
    shipId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ship', required: true },
    itinerary: [{
        port: { type: String, required: true },
        arrival: { type: Date },
        departure: { type: Date },
    }],
    startingPrice: { type: Number, required: true, min: 0 },
    description: { type: String, required: true },
    whatsIncluded: [{ type: String, required: true }],
    coverImage: { type: String },
    gallery: [{ type: String }],
    cabinTypes: [{
        type: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        capacity: { type: Number, required: true, min: 1 },
    }],
    departureDates: [{ type: Date, required: true }],
    seats: { type: Number, required: true, min: 0 },
}, { timestamps: true });

module.exports = mongoose.model('CruisePackage', cruisePackageSchema);