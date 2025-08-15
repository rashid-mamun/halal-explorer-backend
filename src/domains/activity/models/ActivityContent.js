const mongoose = require('mongoose');

const activityContentSchema = new mongoose.Schema({
  activityCode: { type: String, required: true, unique: true },
  contentId: { type: String, required: true },
  name: { type: String, required: true },
  address: { type: String },
  location: {
    latitude: { type: Number },
    longitude: { type: Number }
  },
  description: { type: String },
  images: [{
    url: { type: String },
    type: { type: String }
  }],
  categories: [{
    code: { type: String },
    name: { type: String }
  }],
  segments: [{
    code: { type: String },
    name: { type: String }
  }],
  hotelBedsData: { type: mongoose.Schema.Types.Mixed }, // Original API response
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

// Indexes for efficient searching
activityContentSchema.index({ activityCode: 1 });
activityContentSchema.index({ contentId: 1 });
activityContentSchema.index({ name: 'text' });
activityContentSchema.index({ address: 'text' });
activityContentSchema.index({ 'categories.code': 1 });
activityContentSchema.index({ 'segments.code': 1 });

module.exports = mongoose.model('ActivityContent', activityContentSchema);
