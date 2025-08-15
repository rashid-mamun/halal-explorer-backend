const mongoose = require('mongoose');

const customHolidayBookingSchema = new mongoose.Schema({
  bookingId: { type: String, required: true, unique: true },
  partnerOrderId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  idInfo: { type: mongoose.Schema.Types.Mixed, required: true },
  departureDetails: { type: mongoose.Schema.Types.Mixed, required: true },
  passengersDetails: { type: mongoose.Schema.Types.Mixed, required: true },
  contractDetails: { type: mongoose.Schema.Types.Mixed, required: true },
  consultantName: { type: String },
  bookingSummary: { type: mongoose.Schema.Types.Mixed, required: true },
  paymentDetails: { type: mongoose.Schema.Types.Mixed, required: true },
  orderInfo: { type: mongoose.Schema.Types.Mixed, required: true }
}, { timestamps: true });

module.exports = mongoose.model('CustomHolidayBooking', customHolidayBookingSchema);
