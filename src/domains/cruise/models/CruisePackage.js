const mongoose = require('mongoose');

const cruisePackageSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  destination: { type: String, required: true },
  cruiseLine: { type: String, required: true },
  ship: { type: String },
  sailingDates: [{ type: Date, required: true }],
  length: { type: String, required: true },
  commentForLength: { type: String },
  itinerary: [{
    key: { type: String, required: true },
    value: { type: String, required: true }
  }],
  shipFacts: [{
    key: { type: String, required: true },
    value: { type: String, required: true }
  }],
  shipInfo: [{
    key: { type: String, required: true },
    value: { type: String, required: true }
  }],
  policies: [{
    key: { type: String, required: true },
    value: { type: String, required: true }
  }],
  roomTypes: [{
    key: { type: String, required: true },
    value: { type: String, required: true }
  }],
  price: {
    startsFrom: { type: String, required: true }
  },
  gallery: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('CruisePackage', cruisePackageSchema);
