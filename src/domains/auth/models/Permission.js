const mongoose = require('mongoose');
const { RESOURCES, ACTIONS } = require('../../../shared/constants');

const permissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  resource: {
    type: String,
    required: true,
    enum: Object.values(RESOURCES)
  },
  action: {
    type: String,
    required: true,
    enum: Object.values(ACTIONS)
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for efficient queries
permissionSchema.index({ resource: 1, action: 1 });
permissionSchema.index({ name: 1 });
permissionSchema.index({ isActive: 1 });

// Virtual for full permission string
permissionSchema.virtual('fullPermission').get(function() {
  return `${this.resource}:${this.action}`;
});

module.exports = mongoose.model('Permission', permissionSchema);
