const mongoose = require('mongoose');

const halalActivityRatingSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  ratings: [{
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 0, max: 100 }
  }],
  starRating: { type: Number, required: true, min: 0, max: 100 },
  isStructure: { type: Boolean, default: false }, // true for rating structure, false for activity rating
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

// Indexes for efficient searching
halalActivityRatingSchema.index({ code: 1 });
halalActivityRatingSchema.index({ isStructure: 1 });
halalActivityRatingSchema.index({ starRating: 1 });

module.exports = mongoose.model('HalalActivityRating', halalActivityRatingSchema);
