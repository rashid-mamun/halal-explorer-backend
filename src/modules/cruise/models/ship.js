const mongoose = require('mongoose');

const shipSchema = new mongoose.Schema({
    name: { type: String, required: true },
    cruiseLineId: { type: mongoose.Schema.Types.ObjectId, ref: 'CruiseLine', required: true },
    capacity: { type: Number, required: true, min: 1 },
    description: { type: String },
    image: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Ship', shipSchema);