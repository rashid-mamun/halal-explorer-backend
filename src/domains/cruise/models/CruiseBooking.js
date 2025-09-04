const mongoose = require('mongoose');

const cruiseBookingSchema = new mongoose.Schema({
  bookingId: { type: String, required: true, unique: true },
  partnerOrderId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  userInfo: { type: mongoose.Schema.Types.Mixed, required: true },
  priceDetails: { type: mongoose.Schema.Types.Mixed, required: true },
  paymentDetails: { type: mongoose.Schema.Types.Mixed, required: true },
  orderInfo: { type: mongoose.Schema.Types.Mixed, required: true }
}, { timestamps: true });

module.exports = mongoose.model('CruiseBooking', cruiseBookingSchema);
