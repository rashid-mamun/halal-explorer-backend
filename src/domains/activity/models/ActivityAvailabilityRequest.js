const mongoose = require('mongoose');

const activityAvailabilityRequestSchema = new mongoose.Schema({
  requestId: { type: String, required: true, unique: true },
  destination: { type: String, required: true },
  passengers: {
    adults: { type: Number, required: true, min: 1 },
    children: { type: Number, required: true, min: 0 }
  },
  dates: {
    from: { type: Date, required: true },
    to: { type: Date, required: true }
  },
  language: { type: String, default: 'en' },
  filters: [{
    type: { type: String },
    value: { type: String }
  }],
  hotelBedsResponse: { type: mongoose.Schema.Types.Mixed }, // API response
  status: { 
    type: String, 
    enum: ['pending', 'success', 'failed'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Indexes for efficient searching
activityAvailabilityRequestSchema.index({ requestId: 1 });
activityAvailabilityRequestSchema.index({ destination: 1 });
activityAvailabilityRequestSchema.index({ status: 1 });
activityAvailabilityRequestSchema.index({ createdAt: -1 });

module.exports = mongoose.model('ActivityAvailabilityRequest', activityAvailabilityRequestSchema);
