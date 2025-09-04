const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  starRating: { type: Number, min: 1, max: 5 },
  amenities: [{ type: String }],
  description: String,
  images: [{ type: String }],
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  contactInfo: {
    phone: String,
    email: String,
    website: String
  },
  ratehawkData: mongoose.Schema.Types.Mixed, // Store RateHawk API response
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes for better query performance
hotelSchema.index({ id: 1 });
hotelSchema.index({ city: 1 });
hotelSchema.index({ country: 1 });
hotelSchema.index({ name: 'text', address: 'text', city: 'text' }, { 
  weights: {
    name: 10,
    address: 5,
    city: 3
  }
});

// Update timestamp on save
hotelSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Hotel', hotelSchema);
