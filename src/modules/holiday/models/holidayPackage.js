const mongoose = require('mongoose');

const holidayPackageSchema = new mongoose.Schema({
    packageName: { type: String, required: true },
    address: { type: String, required: true },
    duration: {
        days: { type: Number, required: true, min: 1 },
        nights: { type: Number, required: true, min: 1 },
    },
    startingPrice: { type: Number, required: true, min: 0 },
    description: { type: String, required: true },
    whatsIncluded: [{ type: String, required: true }],
    geoLocation: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
    },
    coverImage: { type: String },
    gallery: [{ type: String }],
    durationDescription: [{
        titles: { type: String, required: true },
        food: { type: String, required: true },
        des: { type: String, required: true },
    }],
    paxWisePrice: {
        adult: { type: Number, required: true, min: 0 },
        child: { type: Number, required: true, min: 0 },
        infant: { type: Number, required: true, min: 0 },
        single: { type: Number, required: true, min: 0 },
    },
    departureDates: [{ type: Date, required: true }],
    seats: { type: Number, required: true, min: 0 },
    optionalTours: [{
        title: { type: String, required: true },
        description: [{ type: String, required: true }],
    }],
}, { timestamps: true });

module.exports = mongoose.model('HolidayPackage', holidayPackageSchema);