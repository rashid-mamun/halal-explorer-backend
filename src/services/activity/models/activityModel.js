const mongoose = require('mongoose');
const { Schema } = mongoose;

const activitySchema = new Schema({
    activityCode: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    name: { type: String },
    contentId: { type: String },
    location: {
        latitude: { type: Number },
        longitude: { type: Number },
    },
    halalRatings: [{
        name: { type: String, required: true },
        rating: { type: Number, required: true },
    }],
    star_rating: { type: Number, default: 0 },
}, { timestamps: true });

activitySchema.index({ address: 'text', activityCode: 'text' });

module.exports = mongoose.model('Activity', activitySchema);