const express = require('express');
const router = express.Router();

// Import controllers
const { 
  register, 
  login, 
  refreshToken, 
  logout, 
  getProfile, 
  updateProfile, 
  changePassword,
  requestPasswordReset,
  resetPasswordController,
  verifyEmail,
  resendEmailVerification,
  getSessions,
  revokeSession,
  revokeAllSessions
} = require('../controllers/authController');

// Import middleware
const { 
  requireAuth, 
  requireRefreshToken 
} = require('../middleware/auth');

// Import validation
const {
  validateRequestBody,
  userRegistrationSchema,
  userLoginSchema,
  userUpdateSchema,
  passwordUpdateSchema,
  passwordResetRequestSchema,
  passwordResetSchema,
  emailVerificationSchema
} = require('../../../shared/utils/validators');

// Public routes (no authentication required)
router.post('/register', validateRequestBody(userRegistrationSchema), register);
router.post('/login', validateRequestBody(userLoginSchema), login);
router.post('/refresh-token', requireRefreshToken, refreshToken);
router.post('/forgot-password', validateRequestBody(passwordResetRequestSchema), requestPasswordReset);
router.post('/reset-password', validateRequestBody(passwordResetSchema), resetPasswordController);

// Protected routes (authentication required)
router.post('/logout', requireAuth, logout);
router.get('/profile', requireAuth, getProfile);
router.put('/profile', requireAuth, validateRequestBody(userUpdateSchema), updateProfile);
router.put('/change-password', requireAuth, validateRequestBody(passwordUpdateSchema), changePassword);

// Session management routes
router.get('/sessions', requireAuth, getSessions);
router.delete('/sessions/:sessionId', requireAuth, revokeSession);
router.delete('/sessions', requireAuth, revokeAllSessions);

router.post('/verify-email', requireAuth, validateRequestBody(emailVerificationSchema), verifyEmail);
router.post('/resend-verification', requireAuth, resendEmailVerification);

module.exports = router;
