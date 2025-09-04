const sessionService = require('./sessionService');

/**
 * Clean up expired sessions and blacklisted tokens
 * This should be run periodically (e.g., daily via cron job)
 */
const cleanupExpiredData = async () => {
  try {
    console.log('Starting cleanup of expired sessions and tokens...');
    
    // Clean up expired sessions
    const expiredSessionsCount = await sessionService.cleanupExpiredSessions();
    console.log(`Cleaned up ${expiredSessionsCount} expired sessions`);
    
    // Note: Blacklisted tokens are automatically cleaned up by MongoDB TTL index
    // after 7 days (matching refresh token expiry)
    
    console.log('Cleanup completed successfully');
    return {
      expiredSessionsCount
    };
  } catch (error) {
    console.error('Cleanup failed:', error.message);
    throw error;
  }
};

/**
 * Get cleanup statistics
 */
const getCleanupStats = async () => {
  try {
    const UserSession = require('../models/UserSession');
    const BlacklistedToken = require('../models/BlacklistedToken');
    
    const now = new Date();
    
    // Count active sessions
    const activeSessionsCount = await UserSession.countDocuments({
      isActive: true,
      expiresAt: { $gt: now }
    });
    
    // Count expired sessions
    const expiredSessionsCount = await UserSession.countDocuments({
      isActive: true,
      expiresAt: { $lt: now }
    });
    
    // Count blacklisted tokens
    const blacklistedTokensCount = await BlacklistedToken.countDocuments();
    
    return {
      activeSessionsCount,
      expiredSessionsCount,
      blacklistedTokensCount,
      lastCleanup: new Date()
    };
  } catch (error) {
    throw new Error(`Failed to get cleanup stats: ${error.message}`);
  }
};

module.exports = {
  cleanupExpiredData,
  getCleanupStats
};
