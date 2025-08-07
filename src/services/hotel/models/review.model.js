const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewSchema = new Schema({
    id: { type: String, required: true, unique: true },
    rating: { type: Number, required: true },
    detailed_ratings: { type: Schema.Types.Mixed, required: true },
    reviews: [{ type: Schema.Types.Mixed }],
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);