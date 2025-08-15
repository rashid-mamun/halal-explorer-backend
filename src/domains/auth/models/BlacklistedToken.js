const mongoose = require('mongoose');

const blacklistedTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  blacklistedAt: {
    type: Date,
    default: Date.now,
    expires: 7 * 24 * 60 * 60 // Auto-delete after 7 days (matches refresh token expiry)
  },
  reason: {
    type: String,
    enum: ['logout', 'security_breach', 'token_refresh', 'admin_revoke'],
    default: 'logout'
  }
}, {
  timestamps: true
});

// Index for faster lookups
blacklistedTokenSchema.index({ token: 1 });
blacklistedTokenSchema.index({ userId: 1 });
blacklistedTokenSchema.index({ blacklistedAt: 1 });

const BlacklistedToken = mongoose.model('BlacklistedToken', blacklistedTokenSchema);

module.exports = BlacklistedToken;
