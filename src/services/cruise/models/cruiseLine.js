const mongoose = require('mongoose');

const cruiseLineSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    logo: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('CruiseLine', cruiseLineSchema);