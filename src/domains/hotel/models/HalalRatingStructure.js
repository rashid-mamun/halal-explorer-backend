const mongoose = require('mongoose');

const halalRatingStructureSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, default: 'structure' },
  ratings: [{
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 0, max: 100 }
  }],
  totalRating: { type: Number, required: true, min: 0, max: 100 },
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes for better query performance
halalRatingStructureSchema.index({ id: 1 });
halalRatingStructureSchema.index({ isActive: 1 });

// Update timestamp on save
halalRatingStructureSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('HalalRatingStructure', halalRatingStructureSchema);
