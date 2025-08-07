const mongoose = require('mongoose');
const { Schema } = mongoose;

const halalHotelStructureSchema = new Schema({
    id: { type: String, required: true, unique: true },
    ratings: [{
        name: { type: String, required: true },
        rating: { type: Number, required: true },
    }],
    star_rating: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('HalalHotelStructure', halalHotelStructureSchema);