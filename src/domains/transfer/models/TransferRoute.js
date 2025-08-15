const mongoose = require('mongoose');

const transferRouteSchema = new mongoose.Schema({
  routeId: { type: String, required: true, unique: true },
  destinationCode: { type: String, required: true },
  fromLocation: {
    code: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, required: true }
  },
  toLocation: {
    code: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, required: true }
  },
  hotelBedsData: { type: mongoose.Schema.Types.Mixed }, // Original API response
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

// Index for efficient searching
transferRouteSchema.index({ routeId: 1 });
transferRouteSchema.index({ destinationCode: 1 });
transferRouteSchema.index({ 'fromLocation.code': 1, 'toLocation.code': 1 });

module.exports = mongoose.model('TransferRoute', transferRouteSchema);
