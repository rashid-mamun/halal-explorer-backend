const mongoose = require('mongoose');

const activityBookingSchema = new mongoose.Schema({
  bookingId: { type: String, required: true, unique: true },
  hotelBedsReference: { type: String }, // HotelBeds booking reference
  availabilityRequestId: { type: String, required: true },
  activityCode: { type: String, required: true },
  language: { type: String, required: true },
  clientReference: { type: String, required: true },
  holder: {
    name: { type: String, required: true },
    title: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    zipCode: { type: String, required: true },
    mailing: { type: Boolean, required: true },
    mailUpdDate: { type: Date, required: true },
    country: { type: String, required: true },
    surname: { type: String, required: true },
    telephones: [{ type: String }]
  },
  activities: [{
    preferedLanguage: { type: String, required: true },
    serviceLanguage: { type: String, required: true },
    rateKey: { type: String, required: true },
    from: { type: Date, required: true },
    to: { type: Date, required: true },
    paxes: [{
      age: { type: Number, required: true },
      name: { type: String, required: true },
      type: { type: String, enum: ['ADULT', 'CHILD'], required: true },
      surname: { type: String, required: true }
    }]
  }],
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  hotelBedsData: { type: mongoose.Schema.Types.Mixed }, // Full API response
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Indexes for efficient searching
activityBookingSchema.index({ bookingId: 1 });
activityBookingSchema.index({ hotelBedsReference: 1 });
activityBookingSchema.index({ availabilityRequestId: 1 });
activityBookingSchema.index({ activityCode: 1 });
activityBookingSchema.index({ status: 1 });
activityBookingSchema.index({ 'holder.email': 1 });
activityBookingSchema.index({ createdAt: -1 });

module.exports = mongoose.model('ActivityBooking', activityBookingSchema);
