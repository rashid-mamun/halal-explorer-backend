const mongoose = require('mongoose');

const transferMasterDataSchema = new mongoose.Schema({
  categories: [{
    code: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String }
  }],
  vehicles: [{
    code: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },
    capacity: { type: Number }
  }],
  transferTypes: [{
    code: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String }
  }],
  currencies: [{
    code: { type: String, required: true },
    name: { type: String, required: true },
    symbol: { type: String }
  }],
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

// Index for efficient searching
transferMasterDataSchema.index({ 'categories.code': 1 });
transferMasterDataSchema.index({ 'vehicles.code': 1 });
transferMasterDataSchema.index({ 'transferTypes.code': 1 });
transferMasterDataSchema.index({ 'currencies.code': 1 });

module.exports = mongoose.model('TransferMasterData', transferMasterDataSchema);
