const mongoose = require('mongoose');

const halalRatingSchema = new mongoose.Schema({
  hotelId: { type: String, required: true, ref: 'Hotel' },
  ratings: [{
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 0, max: 100 }
  }],
  totalRating: { type: Number, required: true, min: 0, max: 100 },
  isVerified: { type: Boolean, default: false },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  verifiedAt: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes for better query performance
halalRatingSchema.index({ hotelId: 1 });
halalRatingSchema.index({ totalRating: 1 });
halalRatingSchema.index({ isVerified: 1 });

// Update timestamp on save
halalRatingSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('HalalRating', halalRatingSchema);
