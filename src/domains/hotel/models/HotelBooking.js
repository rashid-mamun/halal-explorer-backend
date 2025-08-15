const mongoose = require('mongoose');

const hotelBookingSchema = new mongoose.Schema({
  bookingId: { type: String, required: true, unique: true },
  hotelId: { type: String, required: true, ref: 'Hotel' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  email: { type: String, required: true },
  partnerOrderId: { type: String, required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  guests: [{
    firstName: { type: String, required: true },
    lastName: { type: String, required: true }
  }],
  priceDetails: {
    totalAmount: { type: Number, required: true },
    currency: { type: String, required: true },
    breakdown: mongoose.Schema.Types.Mixed
  },
  paymentDetails: mongoose.Schema.Types.Mixed,
  orderInfo: mongoose.Schema.Types.Mixed,
  userInfo: mongoose.Schema.Types.Mixed,
  ratehawkResponse: mongoose.Schema.Types.Mixed,
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'cancelled', 'completed'], 
    default: 'pending' 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes for better query performance
hotelBookingSchema.index({ bookingId: 1 });
hotelBookingSchema.index({ hotelId: 1 });
hotelBookingSchema.index({ userId: 1 });
hotelBookingSchema.index({ email: 1 });
hotelBookingSchema.index({ partnerOrderId: 1 });
hotelBookingSchema.index({ status: 1 });
hotelBookingSchema.index({ createdAt: 1 });

// Update timestamp on save
hotelBookingSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('HotelBooking', hotelBookingSchema);
