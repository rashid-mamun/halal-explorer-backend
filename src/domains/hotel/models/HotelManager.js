const mongoose = require('mongoose');

const hotelManagerSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  managerName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  hotelId: { type: String, ref: 'Hotel' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes for better query performance
hotelManagerSchema.index({ id: 1 });
hotelManagerSchema.index({ email: 1 });
hotelManagerSchema.index({ hotelId: 1 });
hotelManagerSchema.index({ isActive: 1 });

// Update timestamp on save
hotelManagerSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('HotelManager', hotelManagerSchema);
