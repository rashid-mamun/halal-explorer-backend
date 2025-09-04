const jwt = require('jsonwebtoken');
const { sendUnauthorizedResponse, sendForbiddenResponse, sendAccountLockedResponse } = require('../../../shared/utils/responseHandler');
const { MESSAGES } = require('../../../shared/constants');
const { findById } = require('../services/userService');
const { validateToken, validateRefreshToken } = require('../services/authService');

/**
 * Authenticate user by JWT token
 */
const authenticate = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendUnauthorizedResponse(res, 'No token provided');
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    if (!token) {
      return sendUnauthorizedResponse(res, 'No token provided');
    }

    // Validate token and check blacklist
    const decoded = await validateToken(token);
    
    // Find user with populated role and permissions
    const user = await findById(decoded.userId);
    
    if (!user) {
      return sendUnauthorizedResponse(res, MESSAGES.ERROR.USER_NOT_FOUND);
    }

    if (!user.isActive) {
      return sendForbiddenResponse(res, 'User account is deactivated');
    }

    if (user.isLocked) {
      return sendAccountLockedResponse(res);
    }

    // Attach user to request
    req.user = user;
    return true; // Continue to next middleware/controller
    
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return sendUnauthorizedResponse(res, MESSAGES.ERROR.TOKEN_EXPIRED);
    }
    
    if (error.name === 'JsonWebTokenError') {
      return sendUnauthorizedResponse(res, MESSAGES.ERROR.TOKEN_INVALID);
    }
    
    return sendUnauthorizedResponse(res, MESSAGES.ERROR.TOKEN_INVALID);
  }
};

/**
 * Optional authentication - doesn't require token but attaches user if valid
 */
const optionalAuth = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return true; // Continue without user
    }

    const token = authHeader.substring(7);
    
    if (!token) {
      return true; // Continue without user
    }

    // Validate token and check blacklist
    const decoded = await validateToken(token);
    
    // Find user with populated role and permissions
    const user = await findById(decoded.userId);
    
    if (user && user.isActive && !user.isLocked) {
      req.user = user;
    }
    
    return true; // Continue to next middleware/controller
    
  } catch (error) {
    // Ignore token errors for optional auth
    return true; // Continue without user
  }
};

/**
 * Verify refresh token
 */
const verifyRefreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return sendUnauthorizedResponse(res, MESSAGES.ERROR.REFRESH_TOKEN_INVALID);
    }

    // Validate refresh token and check blacklist
    const decoded = await validateRefreshToken(refreshToken);
    
    if (decoded.type !== 'refresh') {
      return sendUnauthorizedResponse(res, MESSAGES.ERROR.REFRESH_TOKEN_INVALID);
    }

    // Find user
    const user = await findById(decoded.userId);
    
    if (!user || !user.isActive || user.isLocked) {
      return sendUnauthorizedResponse(res, MESSAGES.ERROR.USER_NOT_FOUND);
    }

    req.user = user;
    return true; // Continue to next middleware/controller
    
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return sendUnauthorizedResponse(res, MESSAGES.ERROR.REFRESH_TOKEN_EXPIRED);
    }
    
    return sendUnauthorizedResponse(res, MESSAGES.ERROR.REFRESH_TOKEN_INVALID);
  }
};

/**
 * Middleware wrapper for authenticate
 */
const requireAuth = async (req, res, next) => {
  const result = await authenticate(req, res);
  if (result === true) {
    next();
  }
  // If result is not true, response has already been sent
};

/**
 * Middleware wrapper for optionalAuth
 */
const optionalAuthMiddleware = async (req, res, next) => {
  const result = await optionalAuth(req, res);
  if (result === true) {
    next();
  }
  // If result is not true, response has already been sent
};

/**
 * Middleware wrapper for verifyRefreshToken
 */
const requireRefreshToken = async (req, res, next) => {
  const result = await verifyRefreshToken(req, res);
  if (result === true) {
    next();
  }
  // If result is not true, response has already been sent
};

module.exports = {
  authenticate,
  optionalAuth,
  verifyRefreshToken,
  requireAuth,
  optionalAuthMiddleware,
  requireRefreshToken
};
