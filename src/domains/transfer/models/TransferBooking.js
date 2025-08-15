const mongoose = require('mongoose');

const transferBookingSchema = new mongoose.Schema({
  bookingId: { type: String, required: true, unique: true },
  hotelBedsReference: { type: String }, // HotelBeds booking reference
  availabilityRequestId: { type: String, required: true },
  routeId: { type: String, required: true },
  passengerDetails: {
    adults: { type: Number, required: true, min: 1 },
    children: { type: Number, required: true, min: 0 },
    infants: { type: Number, required: true, min: 0 }
  },
  selectedVehicle: {
    vehicleCode: { type: String, required: true },
    vehicleName: { type: String, required: true },
    category: { type: String, required: true },
    transferType: { type: String, required: true }
  },
  pickupDetails: {
    location: { type: String, required: true },
    dateTime: { type: Date, required: true },
    flightNumber: { type: String },
    remarks: { type: String }
  },
  dropoffDetails: {
    location: { type: String, required: true },
    dateTime: { type: Date, required: true },
    remarks: { type: String }
  },
  pricing: {
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    total: { type: Number, required: true }
  },
  customerInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    nationality: { type: String }
  },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  hotelBedsData: { type: mongoose.Schema.Types.Mixed }, // Full API response
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Index for efficient searching
transferBookingSchema.index({ bookingId: 1 });
transferBookingSchema.index({ hotelBedsReference: 1 });
transferBookingSchema.index({ availabilityRequestId: 1 });
transferBookingSchema.index({ routeId: 1 });
transferBookingSchema.index({ status: 1 });
transferBookingSchema.index({ 'customerInfo.email': 1 });
transferBookingSchema.index({ createdAt: -1 });

module.exports = mongoose.model('TransferBooking', transferBookingSchema);
