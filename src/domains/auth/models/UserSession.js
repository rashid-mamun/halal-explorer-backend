const mongoose = require('mongoose');

const userSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  accessToken: {
    type: String,
    required: true
  },
  refreshToken: {
    type: String,
    required: true
  },
  deviceInfo: {
    userAgent: String,
    ipAddress: String,
    deviceType: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

// Indexes for faster lookups
userSessionSchema.index({ userId: 1 });
userSessionSchema.index({ sessionId: 1 });
userSessionSchema.index({ accessToken: 1 });
userSessionSchema.index({ refreshToken: 1 });
userSessionSchema.index({ isActive: 1 });
userSessionSchema.index({ expiresAt: 1 });

// Auto-delete expired sessions
userSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const UserSession = mongoose.model('UserSession', userSessionSchema);

module.exports = UserSession;
