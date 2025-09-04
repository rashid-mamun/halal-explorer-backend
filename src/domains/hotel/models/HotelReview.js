const mongoose = require('mongoose');

const hotelReviewSchema = new mongoose.Schema({
  hotelId: { type: String, required: true, ref: 'Hotel' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  detailedRatings: {
    cleanliness: { type: Number, min: 1, max: 5 },
    service: { type: Number, min: 1, max: 5 },
    location: { type: Number, min: 1, max: 5 },
    value: { type: Number, min: 1, max: 5 }
  },
  reviews: [{
    author: String,
    content: String,
    rating: Number,
    date: { type: Date, default: Date.now }
  }],
  totalReviews: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes for better query performance
hotelReviewSchema.index({ hotelId: 1 });
hotelReviewSchema.index({ rating: 1 });
hotelReviewSchema.index({ averageRating: 1 });

// Update timestamp on save
hotelReviewSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('HotelReview', hotelReviewSchema);
