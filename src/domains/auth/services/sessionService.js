const crypto = require('crypto');
const BlacklistedToken = require('../models/BlacklistedToken');
const UserSession = require('../models/UserSession');
const { HTTP_STATUS } = require('../../../shared/constants');

/**
 * Generate a unique session ID
 */
const generateSessionId = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Create a new user session
 */
const createSession = async (userId, accessToken, refreshToken, deviceInfo = {}) => {
  try {
    const sessionId = generateSessionId();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const session = new UserSession({
      userId,
      sessionId,
      accessToken,
      refreshToken,
      deviceInfo,
      expiresAt
    });

    await session.save();
    return session;
  } catch (error) {
    throw new Error(`Failed to create session: ${error.message}`);
  }
};

/**
 * Validate if a token is blacklisted
 */
const isTokenBlacklisted = async (token) => {
  try {
    const blacklistedToken = await BlacklistedToken.findOne({ token });
    return !!blacklistedToken;
  } catch (error) {
    throw new Error(`Failed to check token blacklist: ${error.message}`);
  }
};

/**
 * Blacklist a token
 */
const blacklistToken = async (token, userId, reason = 'logout') => {
  try {
    // Check if token is already blacklisted
    const existingBlacklist = await BlacklistedToken.findOne({ token });
    if (existingBlacklist) {
      return existingBlacklist;
    }

    const blacklistedToken = new BlacklistedToken({
      token,
      userId,
      reason
    });

    await blacklistedToken.save();
    return blacklistedToken;
  } catch (error) {
    throw new Error(`Failed to blacklist token: ${error.message}`);
  }
};

/**
 * Validate session and update last activity
 */
const validateSession = async (sessionId, accessToken) => {
  try {
    const session = await UserSession.findOne({
      sessionId,
      accessToken,
      isActive: true,
      expiresAt: { $gt: new Date() }
    });

    if (!session) {
      return null;
    }

    // Update last activity
    session.lastActivity = new Date();
    await session.save();

    return session;
  } catch (error) {
    throw new Error(`Failed to validate session: ${error.message}`);
  }
};

/**
 * Get active sessions for a user
 */
const getUserSessions = async (userId) => {
  try {
    const sessions = await UserSession.find({
      userId,
      isActive: true,
      expiresAt: { $gt: new Date() }
    }).sort({ lastActivity: -1 });

    return sessions;
  } catch (error) {
    throw new Error(`Failed to get user sessions: ${error.message}`);
  }
};

/**
 * Revoke a specific session
 */
const revokeSession = async (sessionId, userId) => {
  try {
    const session = await UserSession.findOne({
      sessionId,
      userId,
      isActive: true
    });

    if (!session) {
      throw new Error('Session not found');
    }

    // Blacklist both tokens
    await blacklistToken(session.accessToken, userId, 'admin_revoke');
    await blacklistToken(session.refreshToken, userId, 'admin_revoke');

    // Deactivate session
    session.isActive = false;
    await session.save();

    return session;
  } catch (error) {
    throw new Error(`Failed to revoke session: ${error.message}`);
  }
};

/**
 * Revoke all sessions for a user (except current session)
 */
const revokeAllUserSessions = async (userId, excludeSessionId = null) => {
  try {
    const query = {
      userId,
      isActive: true
    };

    if (excludeSessionId) {
      query.sessionId = { $ne: excludeSessionId };
    }

    const sessions = await UserSession.find(query);

    // Blacklist all tokens
    for (const session of sessions) {
      await blacklistToken(session.accessToken, userId, 'security_breach');
      await blacklistToken(session.refreshToken, userId, 'security_breach');
      
      session.isActive = false;
      await session.save();
    }

    return sessions.length;
  } catch (error) {
    throw new Error(`Failed to revoke all sessions: ${error.message}`);
  }
};

/**
 * Clean up expired sessions and blacklisted tokens
 */
const cleanupExpiredSessions = async () => {
  try {
    const now = new Date();
    
    // Deactivate expired sessions
    const expiredSessions = await UserSession.find({
      isActive: true,
      expiresAt: { $lt: now }
    });

    for (const session of expiredSessions) {
      session.isActive = false;
      await session.save();
    }

    return expiredSessions.length;
  } catch (error) {
    throw new Error(`Failed to cleanup expired sessions: ${error.message}`);
  }
};

/**
 * Get device info from request
 */
const getDeviceInfo = (req) => {
  return {
    userAgent: req.headers['user-agent'] || 'Unknown',
    ipAddress: req.ip || req.connection.remoteAddress || 'Unknown',
    deviceType: getDeviceType(req.headers['user-agent'])
  };
};

/**
 * Determine device type from user agent
 */
const getDeviceType = (userAgent) => {
  if (!userAgent) return 'Unknown';
  
  const ua = userAgent.toLowerCase();
  
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
    return 'Mobile';
  } else if (ua.includes('tablet') || ua.includes('ipad')) {
    return 'Tablet';
  } else if (ua.includes('desktop') || ua.includes('windows') || ua.includes('mac')) {
    return 'Desktop';
  }
  
  return 'Unknown';
};

/**
 * Check if user has too many active sessions
 */
const checkSessionLimit = async (userId, maxSessions = 5) => {
  try {
    const activeSessions = await UserSession.countDocuments({
      userId,
      isActive: true,
      expiresAt: { $gt: new Date() }
    });

    return activeSessions >= maxSessions;
  } catch (error) {
    throw new Error(`Failed to check session limit: ${error.message}`);
  }
};

module.exports = {
  generateSessionId,
  createSession,
  isTokenBlacklisted,
  blacklistToken,
  validateSession,
  getUserSessions,
  revokeSession,
  revokeAllUserSessions,
  cleanupExpiredSessions,
  getDeviceInfo,
  getDeviceType,
  checkSessionLimit
};
