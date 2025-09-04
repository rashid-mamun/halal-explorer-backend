const mongoose = require('mongoose');
const { ROLES } = require('../../../shared/constants');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    enum: Object.values(ROLES)
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  permissions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Permission',
    required: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isSystem: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
roleSchema.index({ name: 1 });
roleSchema.index({ isActive: 1 });
roleSchema.index({ isSystem: 1 });

// Virtual for permission names
roleSchema.virtual('permissionNames').get(function() {
  return this.permissions.map(p => p.name);
});

module.exports = mongoose.model('Role', roleSchema);
