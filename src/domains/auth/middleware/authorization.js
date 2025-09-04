const { sendForbiddenResponse } = require('../../../shared/utils/responseHandler');
const { MESSAGES } = require('../../../shared/constants');
const { 
  hasPermission, 
  hasResourcePermission, 
  hasAnyPermission, 
  hasAllPermissions, 
  hasRole, 
  hasServiceAccess, 
  canAccessResource 
} = require('../services/authService');

/**
 * Require specific permission
 */
const requirePermission = (permissionName) => {
  return async (req, res) => {
    if (!req.user) {
      return sendForbiddenResponse(res, MESSAGES.ERROR.ACCESS_DENIED);
    }

    if (!hasPermission(req.user, permissionName)) {
      return sendForbiddenResponse(res, MESSAGES.ERROR.INSUFFICIENT_PERMISSIONS);
    }

    return true; // Continue to next middleware/controller
  };
};

/**
 * Require resource permission
 */
const requireResourcePermission = (resource, action) => {
  return async (req, res) => {
    if (!req.user) {
      return sendForbiddenResponse(res, MESSAGES.ERROR.ACCESS_DENIED);
    }

    if (!hasResourcePermission(req.user, resource, action)) {
      return sendForbiddenResponse(res, MESSAGES.ERROR.INSUFFICIENT_PERMISSIONS);
    }

    return true; // Continue to next middleware/controller
  };
};

/**
 * Require any of the specified permissions
 */
const requireAnyPermission = (permissions) => {
  return async (req, res) => {
    if (!req.user) {
      return sendForbiddenResponse(res, MESSAGES.ERROR.ACCESS_DENIED);
    }

    if (!hasAnyPermission(req.user, permissions)) {
      return sendForbiddenResponse(res, MESSAGES.ERROR.INSUFFICIENT_PERMISSIONS);
    }

    return true; // Continue to next middleware/controller
  };
};

/**
 * Require all of the specified permissions
 */
const requireAllPermissions = (permissions) => {
  return async (req, res) => {
    if (!req.user) {
      return sendForbiddenResponse(res, MESSAGES.ERROR.ACCESS_DENIED);
    }

    if (!hasAllPermissions(req.user, permissions)) {
      return sendForbiddenResponse(res, MESSAGES.ERROR.INSUFFICIENT_PERMISSIONS);
    }

    return true; // Continue to next middleware/controller
  };
};

/**
 * Require specific role
 */
const requireRole = (roles) => {
  return async (req, res) => {
    if (!req.user) {
      return sendForbiddenResponse(res, MESSAGES.ERROR.ACCESS_DENIED);
    }

    if (!hasRole(req.user, roles)) {
      return sendForbiddenResponse(res, MESSAGES.ERROR.INSUFFICIENT_PERMISSIONS);
    }

    return true; // Continue to next middleware/controller
  };
};

/**
 * Require ownership or permission
 */
const requireOwnershipOrPermission = (permission) => {
  return async (req, res) => {
    if (!req.user) {
      return sendForbiddenResponse(res, MESSAGES.ERROR.ACCESS_DENIED);
    }

    const resourceId = req.params.id || req.params.userId || req.body.userId;
    
    if (!canAccessResource(req.user, resourceId, permission)) {
      return sendForbiddenResponse(res, MESSAGES.ERROR.INSUFFICIENT_PERMISSIONS);
    }

    return true; // Continue to next middleware/controller
  };
};

/**
 * Require service access
 */
const requireServiceAccess = (service) => {
  return async (req, res) => {
    if (!req.user) {
      return sendForbiddenResponse(res, MESSAGES.ERROR.ACCESS_DENIED);
    }

    if (!hasServiceAccess(req.user, service)) {
      return sendForbiddenResponse(res, MESSAGES.ERROR.INSUFFICIENT_PERMISSIONS);
    }

    return true; // Continue to next middleware/controller
  };
};

/**
 * Middleware wrapper for requirePermission
 */
const requirePermissionMiddleware = (permissionName) => {
  return async (req, res, next) => {
    const result = await requirePermission(permissionName)(req, res);
    if (result === true) {
      next();
    }
    // If result is not true, response has already been sent
  };
};

/**
 * Middleware wrapper for requireResourcePermission
 */
const requireResourcePermissionMiddleware = (resource, action) => {
  return async (req, res, next) => {
    const result = await requireResourcePermission(resource, action)(req, res);
    if (result === true) {
      next();
    }
    // If result is not true, response has already been sent
  };
};

/**
 * Middleware wrapper for requireAnyPermission
 */
const requireAnyPermissionMiddleware = (permissions) => {
  return async (req, res, next) => {
    const result = await requireAnyPermission(permissions)(req, res);
    if (result === true) {
      next();
    }
    // If result is not true, response has already been sent
  };
};

/**
 * Middleware wrapper for requireAllPermissions
 */
const requireAllPermissionsMiddleware = (permissions) => {
  return async (req, res, next) => {
    const result = await requireAllPermissions(permissions)(req, res);
    if (result === true) {
      next();
    }
    // If result is not true, response has already been sent
  };
};

/**
 * Middleware wrapper for requireRole
 */
const requireRoleMiddleware = (roles) => {
  return async (req, res, next) => {
    const result = await requireRole(roles)(req, res);
    if (result === true) {
      next();
    }
    // If result is not true, response has already been sent
  };
};

/**
 * Middleware wrapper for requireOwnershipOrPermission
 */
const requireOwnershipOrPermissionMiddleware = (permission) => {
  return async (req, res, next) => {
    const result = await requireOwnershipOrPermission(permission)(req, res);
    if (result === true) {
      next();
    }
    // If result is not true, response has already been sent
  };
};

/**
 * Middleware wrapper for requireServiceAccess
 */
const requireServiceAccessMiddleware = (service) => {
  return async (req, res, next) => {
    const result = await requireServiceAccess(service)(req, res);
    if (result === true) {
      next();
    }
    // If result is not true, response has already been sent
  };
};

module.exports = {
  // Direct authorization functions
  requirePermission,
  requireResourcePermission,
  requireAnyPermission,
  requireAllPermissions,
  requireRole,
  requireOwnershipOrPermission,
  requireServiceAccess,
  
  // Middleware wrappers
  requirePermissionMiddleware,
  requireResourcePermissionMiddleware,
  requireAnyPermissionMiddleware,
  requireAllPermissionsMiddleware,
  requireRoleMiddleware,
  requireOwnershipOrPermissionMiddleware,
  requireServiceAccessMiddleware
};
