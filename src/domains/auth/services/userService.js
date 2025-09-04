const User = require('../models/User');
const Role = require('../models/Role');
const { ROLES, PAGINATION } = require('../../../shared/constants');
const { generateEmailVerificationToken, generatePasswordResetToken } = require('./authService');

/**
 * Find user by email with populated role and permissions
 */
const findByEmail = async (email) => {
  return await User.findOne({ email }).populate({
    path: 'role',
    populate: {
      path: 'permissions'
    }
  });
};

/**
 * Find user by ID with populated role and permissions
 */
const findById = async (userId) => {
  return await User.findById(userId).populate({
    path: 'role',
    populate: {
      path: 'permissions'
    }
  });
};

/**
 * Create user with default role if not provided
 */
const createUser = async (userData) => {
  // Handle role processing
  if (!userData.role) {
    // No role provided, use default
    const defaultRole = await Role.findOne({ name: ROLES.CUSTOMER });
    if (!defaultRole) {
      throw new Error('Default role not found');
    }
    userData.role = defaultRole._id;
  } else if (typeof userData.role === 'string' && !userData.role.match(/^[0-9a-fA-F]{24}$/)) {
    // Role provided as name string, convert to ID
    const role = await Role.findOne({ name: userData.role });
    if (!role) {
      throw new Error(`Role '${userData.role}' not found`);
    }
    userData.role = role._id;
  }
  
  const user = await User.create(userData);
  
  // Return user with populated role and permissions
  return await User.findById(user._id).populate({
    path: 'role',
    populate: {
      path: 'permissions'
    }
  });
};

/**
 * Update user
 */
const updateUser = async (userId, updateData) => {
  return await User.findByIdAndUpdate(
    userId,
    updateData,
    { new: true, runValidators: true }
  ).populate({
    path: 'role',
    populate: {
      path: 'permissions'
    }
  });
};

/**
 * Delete user
 */
const deleteUser = async (userId) => {
  return await User.findByIdAndDelete(userId);
};

/**
 * Get all users with pagination
 */
const getAllUsers = async (page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT, filters = {}) => {
  const skip = (page - 1) * limit;
  
  const query = User.find(filters)
    .populate({
      path: 'role',
      populate: {
        path: 'permissions'
      }
    })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const [users, total] = await Promise.all([
    query.exec(),
    User.countDocuments(filters)
  ]);

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

/**
 * Update user password
 */
const updatePassword = async (userId, oldPassword, newPassword) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const bcrypt = require('bcrypt');
  const isValidPassword = await bcrypt.compare(oldPassword, user.password);
  if (!isValidPassword) {
    throw new Error('Invalid old password');
  }

  user.password = newPassword;
  await user.save();

  return user;
};

/**
 * Increment login attempts
 */
const incrementLoginAttempts = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  if (user.lockUntil && user.lockUntil < Date.now()) {
    // Reset lock if expired
    user.lockUntil = undefined;
    user.loginAttempts = 1;
  } else {
    user.loginAttempts += 1;
    
    // Lock account after 5 failed attempts
    if (user.loginAttempts >= 5 && !user.lockUntil) {
      user.lockUntil = Date.now() + 2 * 60 * 60 * 1000; // 2 hours
    }
  }

  await user.save();
  return user;
};

/**
 * Reset login attempts
 */
const resetLoginAttempts = async (userId) => {
  return await User.findByIdAndUpdate(
    userId,
    {
      $unset: { loginAttempts: 1, lockUntil: 1 }
    },
    { new: true }
  );
};

/**
 * Update last login
 */
const updateLastLogin = async (userId) => {
  return await User.findByIdAndUpdate(
    userId,
    { lastLogin: new Date() },
    { new: true }
  );
};

/**
 * Generate and save email verification token
 */
const generateEmailVerificationTokenForUser = async (userId) => {
  const { token, hashedToken, expires } = generateEmailVerificationToken();
  
  await User.findByIdAndUpdate(userId, {
    emailVerificationToken: hashedToken,
    emailVerificationExpires: expires
  });

  return token;
};

/**
 * Verify email verification token
 */
const verifyEmailToken = async (userId, token) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  if (!user.emailVerificationToken || !user.emailVerificationExpires) {
    throw new Error('No verification token found');
  }

  if (user.emailVerificationExpires < Date.now()) {
    throw new Error('Verification token expired');
  }

  const crypto = require('crypto');
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  if (user.emailVerificationToken !== hashedToken) {
    throw new Error('Invalid verification token');
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();

  return user;
};

/**
 * Generate and save password reset token
 */
const generatePasswordResetTokenForUser = async (email) => {
  const user = await findByEmail(email);
  if (!user) {
    throw new Error('User not found');
  }

  const { token, hashedToken, expires } = generatePasswordResetToken();
  
  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = expires;
  await user.save();

  return { user, token };
};

/**
 * Reset password using token
 */
const resetPassword = async (token, newPassword) => {
  const crypto = require('crypto');
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!user) {
    throw new Error('Invalid or expired reset token');
  }

  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  return user;
};

module.exports = {
  findByEmail,
  findById,
  createUser,
  updateUser,
  deleteUser,
  getAllUsers,
  updatePassword,
  incrementLoginAttempts,
  resetLoginAttempts,
  updateLastLogin,
  generateEmailVerificationTokenForUser,
  verifyEmailToken,
  generatePasswordResetTokenForUser,
  resetPassword
};
