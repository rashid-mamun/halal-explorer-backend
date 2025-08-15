const mongoose = require('mongoose');

const activityMasterDataSchema = new mongoose.Schema({
  countries: [{
    code: { type: String, required: true },
    name: { type: String, required: true },
    states: [{ type: String }]
  }],
  destinations: [{
    code: { type: String, required: true },
    name: { type: String, required: true },
    countryCode: { type: String, required: true }
  }],
  currencies: [{
    code: { type: String, required: true },
    name: { type: String, required: true },
    symbol: { type: String }
  }],
  segments: [{
    code: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String }
  }],
  languages: [{
    code: { type: String, required: true },
    name: { type: String, required: true }
  }],
  destinationHotels: [{
    destinationCode: { type: String, required: true },
    hotels: [{
      code: { type: String, required: true },
      name: { type: String, required: true },
      categoryCode: { type: String },
      categoryName: { type: String }
    }]
  }],
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

// Indexes for efficient searching
activityMasterDataSchema.index({ 'countries.code': 1 });
activityMasterDataSchema.index({ 'destinations.code': 1 });
activityMasterDataSchema.index({ 'destinations.countryCode': 1 });
activityMasterDataSchema.index({ 'currencies.code': 1 });
activityMasterDataSchema.index({ 'segments.code': 1 });
activityMasterDataSchema.index({ 'languages.code': 1 });
activityMasterDataSchema.index({ 'destinationHotels.destinationCode': 1 });

module.exports = mongoose.model('ActivityMasterData', activityMasterDataSchema);
