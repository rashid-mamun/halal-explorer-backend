const mongoose = require('mongoose');

const transferLocationSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { 
    type: String, 
    required: true, 
    enum: ['country', 'destination', 'terminal', 'hotel', 'pickup'] 
  },
  countryCode: { type: String },
  destinationCode: { type: String },
  coordinates: {
    latitude: { type: Number },
    longitude: { type: Number }
  },
  content: { type: mongoose.Schema.Types.Mixed }, // HotelBeds API response
  language: { type: String, default: 'en' },
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

// Index for efficient searching
transferLocationSchema.index({ code: 1, type: 1 });
transferLocationSchema.index({ countryCode: 1, destinationCode: 1 });
transferLocationSchema.index({ name: 'text' });

module.exports = mongoose.model('TransferLocation', transferLocationSchema);
