const { 
  sendSuccessResponse, 
  sendErrorResponse, 
  sendUnauthorizedResponse, 
  sendConflictResponse, 
  sendAccountLockedResponse 
} = require('../../../shared/utils/responseHandler');
const { MESSAGES } = require('../../../shared/constants');
const { 
  generateAccessToken, 
  generateRefreshToken, 
  comparePassword,
  createUserSession,
  logoutUser,
  getUserSessions,
  revokeAllUserSessions
} = require('../services/authService');
const { 
  findByEmail, 
  createUser, 
  incrementLoginAttempts, 
  resetLoginAttempts, 
  updateLastLogin,
  generateEmailVerificationTokenForUser,
  verifyEmailToken,
  generatePasswordResetTokenForUser,
  resetPassword,
  updatePassword
} = require('../services/userService');
const sessionService = require('../services/sessionService');

/**
 * User registration
 */
const register = async (req, res) => {
  try {
    const userData = req.validatedBody;
    
    // Check if user already exists
    const existingUser = await findByEmail(userData.email);
    if (existingUser) {
      return sendConflictResponse(res, MESSAGES.ERROR.EMAIL_ALREADY_EXISTS);
    }

    // Create user
    const user = await createUser(userData);
    
    // Generate email verification token
    const verificationToken = await generateEmailVerificationTokenForUser(user._id);
    
    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Create user session
    const session = await createUserSession(user, accessToken, refreshToken, req);

    const responseData = {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role.name,
        isEmailVerified: user.isEmailVerified
      },
      accessToken,
      refreshToken,
      sessionId: session.sessionId
    };

    return sendSuccessResponse(
      res, 
      responseData, 
      MESSAGES.SUCCESS.REGISTER, 
      201
    );

  } catch (error) {
    return sendErrorResponse(res, error.message);
  }
};

/**
 * User login
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.validatedBody;

    // Find user by email
    const user = await findByEmail(email);
    if (!user) {
      return sendUnauthorizedResponse(res, MESSAGES.ERROR.INVALID_CREDENTIALS);
    }

    // Check if account is locked
    if (user.isLocked) {
      return sendAccountLockedResponse(res);
    }

    // Check if account is active
    if (!user.isActive) {
      return sendUnauthorizedResponse(res, 'Account is deactivated');
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      // Increment login attempts
      await incrementLoginAttempts(user._id);
      return sendUnauthorizedResponse(res, MESSAGES.ERROR.INVALID_CREDENTIALS);
    }

    // Reset login attempts on successful login
    await resetLoginAttempts(user._id);
    
    // Update last login
    await updateLastLogin(user._id);

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Create user session
    const session = await createUserSession(user, accessToken, refreshToken, req);

    const responseData = {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role.name,
        permissions: user.role.permissions.map(p => p.name),
        isEmailVerified: user.isEmailVerified,
        allowedServices: user.allowedServices
      },
      accessToken,
      refreshToken,
      sessionId: session.sessionId
    };

    return sendSuccessResponse(res, responseData, MESSAGES.SUCCESS.LOGIN);

  } catch (error) {
    return sendErrorResponse(res, error.message);
  }
};

/**
 * Refresh token
 */
const refreshToken = async (req, res) => {
  try {
    const user = req.user;

    // Generate new tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Create new session with refreshed tokens
    const session = await createUserSession(user, accessToken, refreshToken, req);

    const responseData = {
      accessToken,
      refreshToken,
      sessionId: session.sessionId
    };

    return sendSuccessResponse(res, responseData, MESSAGES.SUCCESS.TOKEN_REFRESHED);

  } catch (error) {
    return sendErrorResponse(res, error.message);
  }
};

/**
 * Logout
 */
const logout = async (req, res) => {
  try {
    // Extract access token from Authorization header
    const authHeader = req.headers.authorization;
    const accessToken = authHeader ? authHeader.substring(7) : null; // Remove 'Bearer ' prefix
    
    // Try to get refresh token from body, or use the same token if not provided
    let { refreshToken } = req.body;
    if (!refreshToken) {
      refreshToken = accessToken; // Use access token as fallback
    }
    
    if (!accessToken) {
      return sendErrorResponse(res, 'Access token is required');
    }

    // Blacklist tokens
    await logoutUser(req.user._id, accessToken, refreshToken);
    
    return sendSuccessResponse(res, null, MESSAGES.SUCCESS.LOGOUT);
  } catch (error) {
    return sendErrorResponse(res, error.message);
  }
};

/**
 * Get current user profile
 */
const getProfile = async (req, res) => {
  try {
    const user = req.user;

    const profileData = {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: {
        name: user.role.name,
        description: user.role.description,
        permissions: user.role.permissions.map(p => ({
          name: p.name,
          description: p.description,
          resource: p.resource,
          action: p.action
        }))
      },
      isEmailVerified: user.isEmailVerified,
      allowedServices: user.allowedServices,
      managerInfo: user.managerInfo,
      profile: user.profile,
      preferences: user.preferences,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt
    };

    return sendSuccessResponse(res, profileData, 'Profile retrieved successfully');

  } catch (error) {
    return sendErrorResponse(res, error.message);
  }
};

/**
 * Update user profile
 */
const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const updateData = req.validatedBody;

    // Remove sensitive fields that shouldn't be updated via profile update
    delete updateData.email;
    delete updateData.password;
    delete updateData.role;

    const updatedUser = await updateUser(userId, updateData);

    const profileData = {
      id: updatedUser._id,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      phone: updatedUser.phone,
      role: {
        name: updatedUser.role.name,
        description: updatedUser.role.description
      },
      isEmailVerified: updatedUser.isEmailVerified,
      allowedServices: updatedUser.allowedServices,
      managerInfo: updatedUser.managerInfo,
      profile: updatedUser.profile,
      preferences: updatedUser.preferences
    };

    return sendSuccessResponse(res, profileData, MESSAGES.SUCCESS.USER_UPDATED);

  } catch (error) {
    return sendErrorResponse(res, error.message);
  }
};

/**
 * Get user sessions
 */
const getSessions = async (req, res) => {
  try {
    const sessions = await getUserSessions(req.user._id);
    
    const sessionData = sessions.map(session => ({
      sessionId: session.sessionId,
      deviceInfo: session.deviceInfo,
      lastActivity: session.lastActivity,
      createdAt: session.createdAt,
      isActive: session.isActive
    }));

    return sendSuccessResponse(res, sessionData, 'Sessions retrieved successfully');
  } catch (error) {
    return sendErrorResponse(res, error.message);
  }
};

/**
 * Revoke specific session
 */
const revokeSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    await sessionService.revokeSession(sessionId, req.user._id);
    
    return sendSuccessResponse(res, null, 'Session revoked successfully');
  } catch (error) {
    return sendErrorResponse(res, error.message);
  }
};

/**
 * Revoke all sessions (except current)
 */
const revokeAllSessions = async (req, res) => {
  try {
    const { sessionId } = req.body; // Current session ID to exclude
    
    const revokedCount = await revokeAllUserSessions(req.user._id, sessionId);
    
    return sendSuccessResponse(res, { revokedCount }, `${revokedCount} sessions revoked successfully`);
  } catch (error) {
    return sendErrorResponse(res, error.message);
  }
};

/**
 * Change password
 */
const changePassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { oldPassword, newPassword } = req.validatedBody;

    await updatePassword(userId, oldPassword, newPassword);

    return sendSuccessResponse(res, null, MESSAGES.SUCCESS.PASSWORD_UPDATED);

  } catch (error) {
    if (error.message === 'Invalid old password') {
      return sendUnauthorizedResponse(res, MESSAGES.ERROR.OLD_PASSWORD_INVALID);
    }
    return sendErrorResponse(res, error.message);
  }
};

/**
 * Request password reset
 */
const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.validatedBody;

    const { user, token } = await generatePasswordResetTokenForUser(email);

    // In a real application, you would send this token via email
    // For now, we'll return it in the response (not recommended for production)
    const responseData = {
      message: 'Password reset token generated',
      token: token // Remove this in production
    };

    return sendSuccessResponse(res, responseData, MESSAGES.SUCCESS.PASSWORD_RESET_SENT);

  } catch (error) {
    // Don't reveal if email exists or not for security
    return sendSuccessResponse(res, null, MESSAGES.SUCCESS.PASSWORD_RESET_SENT);
  }
};

/**
 * Reset password
 */
const resetPasswordController = async (req, res) => {
  try {
    const { token, newPassword } = req.validatedBody;

    await resetPassword(token, newPassword);

    return sendSuccessResponse(res, null, MESSAGES.SUCCESS.PASSWORD_RESET);

  } catch (error) {
    return sendErrorResponse(res, error.message);
  }
};

/**
 * Verify email
 */
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.validatedBody;

    // Extract user ID from token (you might need to modify this based on your token structure)
    // For now, we'll assume the token contains the user ID
    const userId = req.user._id; // This would need to be extracted from the token

    await verifyEmailToken(userId, token);

    return sendSuccessResponse(res, null, MESSAGES.SUCCESS.EMAIL_VERIFIED);

  } catch (error) {
    return sendErrorResponse(res, error.message);
  }
};

/**
 * Resend email verification
 */
const resendEmailVerification = async (req, res) => {
  try {
    const userId = req.user._id;

    const verificationToken = await generateEmailVerificationTokenForUser(userId);

    // In a real application, you would send this token via email
    const responseData = {
      message: 'Email verification token generated',
      token: verificationToken // Remove this in production
    };

    return sendSuccessResponse(res, responseData, 'Email verification token sent');

  } catch (error) {
    return sendErrorResponse(res, error.message);
  }
};

module.exports = {
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
};
