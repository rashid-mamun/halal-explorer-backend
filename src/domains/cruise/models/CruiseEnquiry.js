const mongoose = require('mongoose');

const cruiseEnquirySchema = new mongoose.Schema({
  enquiryId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  cruiseId: { type: String, required: true },
  email: { type: String, required: true },
  contactNumber: { type: String, required: true },
  guest: {
    adult: { type: Number, required: true, min: 1 },
    child: { type: Number, required: true, min: 0 }
  },
  tickBox: { type: Boolean, required: true },
  guestResidency: { type: String, required: true },
  preferredStateroom: [{ type: String }],
  preferredDate: { type: String, required: true },
  preferredDeparturePort: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('CruiseEnquiry', cruiseEnquirySchema);
