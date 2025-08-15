const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const sessionService = require('./sessionService');
const { AUTH_CONSTANTS } = require('../../../shared/constants');

/**
 * Generate JWT access token
 */
const generateAccessToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      role: user.role.name,
      permissions: user.role.permissions.map(p => p.name)
    },
    process.env.JWT_SECRET,
    {
      expiresIn: AUTH_CONSTANTS.JWT_EXPIRES_IN
    }
  );
};

/**
 * Generate JWT refresh token
 */
const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      type: 'refresh'
    },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    {
      expiresIn: AUTH_CONSTANTS.JWT_REFRESH_EXPIRES_IN
    }
  );
};

/**
 * Compare password with hashed password
 */
const comparePassword = async (candidatePassword, hashedPassword) => {
  return await bcrypt.compare(candidatePassword, hashedPassword);
};

/**
 * Generate email verification token
 */
const generateEmailVerificationToken = () => {
  const token = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const expires = Date.now() + AUTH_CONSTANTS.EMAIL_VERIFICATION_EXPIRES;
  
  return { token, hashedToken, expires };
};

/**
 * Generate password reset token
 */
const generatePasswordResetToken = () => {
  const token = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const expires = Date.now() + AUTH_CONSTANTS.PASSWORD_RESET_EXPIRES;
  
  return { token, hashedToken, expires };
};

/**
 * Check if user has specific permission
 */
const hasPermission = (user, permissionName) => {
  if (!user.role || !user.role.permissions) return false;
  return user.role.permissions.some(permission => 
    permission.name === permissionName || permission.name === 'admin:manage'
  );
};

/**
 * Check if user has resource permission
 */
const hasResourcePermission = (user, resource, action) => {
  if (!user.role || !user.role.permissions) return false;
  return user.role.permissions.some(permission => 
    (permission.resource === resource && permission.action === action) ||
    permission.name === 'admin:manage'
  );
};

/**
 * Check if user has any of the specified permissions
 */
const hasAnyPermission = (user, permissions) => {
  if (!user.role || !user.role.permissions) return false;
  return permissions.some(permission => 
    user.role.permissions.some(p => p.name === permission)
  ) || user.role.permissions.some(p => p.name === 'admin:manage');
};

/**
 * Check if user has all of the specified permissions
 */
const hasAllPermissions = (user, permissions) => {
  if (!user.role || !user.role.permissions) return false;
  return permissions.every(permission => 
    user.role.permissions.some(p => p.name === permission)
  ) || user.role.permissions.some(p => p.name === 'admin:manage');
};

/**
 * Check if user has specific role
 */
const hasRole = (user, roles) => {
  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  return allowedRoles.includes(user.role.name);
};

/**
 * Check if user has access to specific service
 */
const hasServiceAccess = (user, service) => {
  // Admin has access to all services
  if (user.role.name === 'admin') {
    return true;
  }

  // Check if user has access to the specific service
  return user.allowedServices && user.allowedServices.includes(service);
};

/**
 * Check if user is accessing their own resource or has permission
 */
const canAccessResource = (user, resourceId, permission) => {
  // Allow if user is accessing their own resource
  if (resourceId === user._id.toString()) {
    return true;
  }

  // Check if user has the required permission
  if (hasPermission(user, permission)) {
    return true;
  }

  // Check if user has admin permission
  if (hasPermission(user, 'admin:manage')) {
    return true;
  }

  return false;
};

/**
 * Create user session with tokens
 */
const createUserSession = async (user, accessToken, refreshToken, req) => {
  try {
    const deviceInfo = sessionService.getDeviceInfo(req);
    
    // Check session limit
    const hasReachedLimit = await sessionService.checkSessionLimit(user._id);
    if (hasReachedLimit) {
      // Revoke oldest session
      const sessions = await sessionService.getUserSessions(user._id);
      if (sessions.length > 0) {
        await sessionService.revokeSession(sessions[sessions.length - 1].sessionId, user._id);
      }
    }
    
    const session = await sessionService.createSession(
      user._id,
      accessToken,
      refreshToken,
      deviceInfo
    );
    
    return session;
  } catch (error) {
    throw new Error(`Failed to create user session: ${error.message}`);
  }
};

/**
 * Validate token and check blacklist
 */
const validateToken = async (token) => {
  try {
    // Check if token is blacklisted
    const isBlacklisted = await sessionService.isTokenBlacklisted(token);
    if (isBlacklisted) {
      throw new Error('Token is blacklisted');
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error(`Token validation failed: ${error.message}`);
  }
};

/**
 * Validate refresh token and check blacklist
 */
const validateRefreshToken = async (refreshToken) => {
  try {
    // Check if token is blacklisted
    const isBlacklisted = await sessionService.isTokenBlacklisted(refreshToken);
    if (isBlacklisted) {
      throw new Error('Refresh token is blacklisted');
    }
    
    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken, 
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
    );
    return decoded;
  } catch (error) {
    throw new Error(`Refresh token validation failed: ${error.message}`);
  }
};

/**
 * Logout user and blacklist tokens
 */
const logoutUser = async (userId, accessToken, refreshToken) => {
  try {
    // Blacklist both tokens
    await sessionService.blacklistToken(accessToken, userId, 'logout');
    await sessionService.blacklistToken(refreshToken, userId, 'logout');
    
    return true;
  } catch (error) {
    throw new Error(`Logout failed: ${error.message}`);
  }
};

/**
 * Revoke all user sessions
 */
const revokeAllUserSessions = async (userId, excludeSessionId = null) => {
  try {
    return await sessionService.revokeAllUserSessions(userId, excludeSessionId);
  } catch (error) {
    throw new Error(`Failed to revoke all sessions: ${error.message}`);
  }
};

/**
 * Get user sessions
 */
const getUserSessions = async (userId) => {
  return await sessionService.getUserSessions(userId);
};

/**
 * Revoke specific session
 */
const revokeSession = async (sessionId, userId) => {
  return await sessionService.revokeSession(sessionId, userId);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  comparePassword,
  generateEmailVerificationToken,
  generatePasswordResetToken,
  hasPermission,
  hasResourcePermission,
  hasAnyPermission,
  hasAllPermissions,
  hasRole,
  hasServiceAccess,
  canAccessResource,
  createUserSession,
  validateToken,
  validateRefreshToken,
  logoutUser,
  revokeAllUserSessions,
  getUserSessions,
  revokeSession
};
