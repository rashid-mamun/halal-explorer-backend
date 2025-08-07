const express = require('express');
const router = express.Router();
const authController = require('./controllers/authController');
const userController = require('./controllers/userController');
const { authenticateRequest } = require('./middleware/authGuard');
const {
    authorizeByRoles,
    authorizeByPermissions,
    authorizeByServices,
    authorizeByRolesAndPermissions,
    authorizeByRoleHierarchy
} = require('./middleware/authGuard');
const {
    USER_ROLES,
    PERMISSIONS,
    SERVICES
} = require('../utils/constants');

// ============================================================================
// PUBLIC AUTHENTICATION ENDPOINTS (No authentication required)
// ============================================================================

/**
 * GET /auth/health
 * Health check endpoint
 */
router.get('/health', authController.healthCheck);

/**
 * POST /auth/login
 * Authenticate user with email and password
 */
router.post('/login', authController.login);

/**
 * POST /auth/register
 * Register new user account
 */
router.post('/register', authController.register);

// ============================================================================
// PROTECTED AUTHENTICATION ENDPOINTS (Authentication required)
// ============================================================================

/**
 * POST /auth/logout
 * Logout user and invalidate session
 */
router.post('/logout', authenticateRequest, authController.logout);

/**
 * POST /auth/refresh-token
 * Refresh access token using refresh token
 */
router.post('/refresh-token', authenticateRequest, authController.refreshToken);

/**
 * GET /auth/profile
 * Get current user profile
 */
router.get('/profile', authenticateRequest, authController.getProfile);

/**
 * PUT /auth/profile
 * Update current user profile
 */
router.put('/profile', authenticateRequest, authController.updateProfile);

/**
 * PUT /auth/change-password
 * Change user password
 */
router.put('/change-password', authenticateRequest, authController.changePassword);

// ============================================================================
// USER MANAGEMENT ENDPOINTS (Admin/Manager only)
// ============================================================================

/**
 * GET /auth/users
 * Get all users (Admin/Manager only)
 */
router.get('/users',
    authenticateRequest,
    authorizeByRolesAndPermissions(
        [USER_ROLES.ADMINISTRATOR, USER_ROLES.MANAGER],
        [PERMISSIONS.READ_USER_ACCOUNT]
    ),
    userController.getAllUsers
);

/**
 * GET /auth/users/:userId
 * Get specific user by ID (Admin/Manager only)
 */
router.get('/users/:userId',
    authenticateRequest,
    authorizeByPermissions([PERMISSIONS.READ_USER_ACCOUNT]),
    userController.getUserById
);

/**
 * PUT /auth/users/:userId
 * Update user by ID (Admin/Manager only)
 */
router.put('/users/:userId',
    authenticateRequest,
    authorizeByRolesAndPermissions(
        [USER_ROLES.ADMINISTRATOR, USER_ROLES.MANAGER],
        [PERMISSIONS.UPDATE_USER_ACCOUNT]
    ),
    userController.updateUserById
);

/**
 * DELETE /auth/users/:userId
 * Delete user by ID (Admin only)
 */
router.delete('/users/:userId',
    authenticateRequest,
    authorizeByRolesAndPermissions(
        [USER_ROLES.ADMINISTRATOR],
        [PERMISSIONS.DELETE_USER_ACCOUNT]
    ),
    userController.deleteUserById
);

// ============================================================================
// SERVICE-SPECIFIC ACCESS ENDPOINTS
// ============================================================================

/**
 * GET /auth/services/cruise/access
 * Check cruise service access
 */
router.get('/services/cruise/access',
    authenticateRequest,
    authorizeByServices([SERVICES.CRUISE]),
    (req, res) => {
        res.json({
            status: 'success',
            message: 'Cruise service access granted',
            data: {
                service: 'cruise',
                userRole: req.user.role,
                permissions: req.user.permissions
            },
            timestamp: new Date().toISOString()
        });
    }
);

/**
 * GET /auth/services/insurance/access
 * Check insurance service access
 */
router.get('/services/insurance/access',
    authenticateRequest,
    authorizeByServices([SERVICES.INSURANCE]),
    (req, res) => {
        res.json({
            status: 'success',
            message: 'Insurance service access granted',
            data: {
                service: 'insurance',
                userRole: req.user.role,
                permissions: req.user.permissions
            },
            timestamp: new Date().toISOString()
        });
    }
);

// ============================================================================
// TEST AND DEVELOPMENT ENDPOINTS
// ============================================================================

/**
 * GET /auth/test/protected
 * Test endpoint for protected resource access
 */
router.get('/test/protected',
    authenticateRequest,
    (req, res) => {
        res.json({
            status: 'success',
            message: 'Protected resource accessed successfully',
            data: {
                user: {
                    id: req.user.id,
                    email: req.user.email,
                    role: req.user.role,
                    permissions: req.user.permissions,
                    allowedServices: req.user.allowedServices
                },
                timestamp: new Date().toISOString()
            }
        });
    }
);

/**
 * GET /auth/test/permissions
 * Test endpoint to view current user permissions
 */
router.get('/test/permissions',
    authenticateRequest,
    (req, res) => {
        const { getUserEffectivePermissions } = require('./services/authService');

        res.json({
            status: 'success',
            message: 'User permissions retrieved successfully',
            data: {
                user: {
                    email: req.user.email,
                    role: req.user.role,
                    customPermissions: req.user.permissions,
                    allowedServices: req.user.allowedServices
                },
                effectivePermissions: getUserEffectivePermissions(req.user),
                timestamp: new Date().toISOString()
            }
        });
    }
);

module.exports = router; 