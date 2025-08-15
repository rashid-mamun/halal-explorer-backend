const mongoose = require('mongoose');

const cruiseMasterDataSchema = new mongoose.Schema({
  cruiseLines: [{
    name: { type: String, required: true },
    description: { type: String }
  }],
  ships: [{
    cruiseLine: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String }
  }]
}, { timestamps: true });

module.exports = mongoose.model('CruiseMasterData', cruiseMasterDataSchema);
