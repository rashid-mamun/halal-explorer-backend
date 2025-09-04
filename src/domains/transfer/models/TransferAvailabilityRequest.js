const mongoose = require('mongoose');

const transferAvailabilityRequestSchema = new mongoose.Schema({
  requestId: { type: String, required: true, unique: true },
  language: { type: String, required: true },
  passengers: {
    adults: { type: Number, required: true, min: 1 },
    children: { type: Number, required: true, min: 0 },
    infants: { type: Number, required: true, min: 0 }
  },
  availabilityData: [{
    id: { type: String, required: true },
    dateTime: { type: Date, required: true }
  }],
  hotelBedsResponse: { type: mongoose.Schema.Types.Mixed }, // API response
  status: { 
    type: String, 
    enum: ['pending', 'success', 'failed'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Index for efficient searching
transferAvailabilityRequestSchema.index({ requestId: 1 });
transferAvailabilityRequestSchema.index({ status: 1 });
transferAvailabilityRequestSchema.index({ createdAt: -1 });

module.exports = mongoose.model('TransferAvailabilityRequest', transferAvailabilityRequestSchema);
