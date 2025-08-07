const authService = require('../../../src/auth/services/authService');
const User = require('../../../src/models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Mock dependencies
jest.mock('../../../src/models/User');
jest.mock('jsonwebtoken');
jest.mock('bcrypt');

describe('Auth Service', () => {
    let mockUser;

    beforeEach(() => {
        // Reset all mocks
        jest.clearAllMocks();

        // Create mock user
        mockUser = {
            _id: 'user123',
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User',
            role: 'customer',
            permissions: ['create_booking'],
            allowedServices: ['hotel', 'cruise'],
            isActive: true,
            lastLogin: new Date(),
            preferences: {
                language: 'en',
                currency: 'USD'
            },
            comparePassword: jest.fn(),
            updateLastLogin: jest.fn()
        };

        // Mock User.findByEmail
        User.findByEmail = jest.fn();
    });

    describe('generateAccessToken', () => {
        it('should generate access token with correct payload', () => {
            const mockToken = 'mock-access-token';
            jwt.sign.mockReturnValue(mockToken);

            const result = authService.generateAccessToken(mockUser);

            expect(jwt.sign).toHaveBeenCalledWith(
                {
                    userId: mockUser._id,
                    email: mockUser.email,
                    role: mockUser.role,
                    permissions: mockUser.permissions
                },
                process.env.JWT_SECRET_KEY,
                {
                    expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY || '15m'
                }
            );
            expect(result).toBe(mockToken);
        });
    });

    describe('generateRefreshToken', () => {
        it('should generate refresh token with correct payload', () => {
            const mockToken = 'mock-refresh-token';
            jwt.sign.mockReturnValue(mockToken);

            const result = authService.generateRefreshToken(mockUser);

            expect(jwt.sign).toHaveBeenCalledWith(
                {
                    userId: mockUser._id,
                    email: mockUser.email,
                    tokenType: 'refresh'
                },
                process.env.JWT_REFRESH_SECRET_KEY || process.env.JWT_SECRET_KEY,
                {
                    expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRY || '7d'
                }
            );
            expect(result).toBe(mockToken);
        });
    });

    describe('verifyToken', () => {
        it('should verify token successfully', () => {
            const mockToken = 'mock-token';
            const mockDecoded = { userId: 'user123', email: 'test@example.com' };
            jwt.verify.mockReturnValue(mockDecoded);

            const result = authService.verifyToken(mockToken);

            expect(jwt.verify).toHaveBeenCalledWith(mockToken, process.env.JWT_SECRET_KEY);
            expect(result).toEqual(mockDecoded);
        });

        it('should verify token with custom secret key', () => {
            const mockToken = 'mock-token';
            const customSecret = 'custom-secret';
            const mockDecoded = { userId: 'user123', email: 'test@example.com' };
            jwt.verify.mockReturnValue(mockDecoded);

            const result = authService.verifyToken(mockToken, customSecret);

            expect(jwt.verify).toHaveBeenCalledWith(mockToken, customSecret);
            expect(result).toEqual(mockDecoded);
        });
    });

    describe('authenticateUser', () => {
        it('should authenticate user successfully with valid credentials', async () => {
            const email = 'test@example.com';
            const password = 'password123';
            const mockAccessToken = 'mock-access-token';
            const mockRefreshToken = 'mock-refresh-token';

            User.findByEmail.mockResolvedValue(mockUser);
            mockUser.comparePassword.mockResolvedValue(true);
            mockUser.updateLastLogin.mockResolvedValue(mockUser);
            jwt.sign
                .mockReturnValueOnce(mockAccessToken)
                .mockReturnValueOnce(mockRefreshToken);

            const result = await authService.authenticateUser(email, password);

            expect(User.findByEmail).toHaveBeenCalledWith(email);
            expect(mockUser.comparePassword).toHaveBeenCalledWith(password);
            expect(mockUser.updateLastLogin).toHaveBeenCalled();
            expect(result.status).toBe('success');
            expect(result.message).toBe('Login successful');
            expect(result.data.accessToken).toBe(mockAccessToken);
            expect(result.data.refreshToken).toBe(mockRefreshToken);
            expect(result.data.user.email).toBe(email);
        });

        it('should return error for invalid email format', async () => {
            const email = 'invalid-email';
            const password = 'password123';

            const result = await authService.authenticateUser(email, password);

            expect(result.status).toBe('error');
            expect(result.message).toBe('Invalid email format');
            expect(result.errorCode).toBe('INVALID_EMAIL_FORMAT');
            expect(result.statusCode).toBe(400);
        });

        it('should return error when user not found', async () => {
            const email = 'test@example.com';
            const password = 'password123';

            User.findByEmail.mockResolvedValue(null);

            const result = await authService.authenticateUser(email, password);

            expect(result.status).toBe('error');
            expect(result.message).toBe('User account not found');
            expect(result.errorCode).toBe('USER_NOT_FOUND');
            expect(result.statusCode).toBe(401);
        });

        it('should return error when account is deactivated', async () => {
            const email = 'test@example.com';
            const password = 'password123';
            const deactivatedUser = { ...mockUser, isActive: false };

            User.findByEmail.mockResolvedValue(deactivatedUser);

            const result = await authService.authenticateUser(email, password);

            expect(result.status).toBe('error');
            expect(result.message).toBe('User account is deactivated');
            expect(result.errorCode).toBe('ACCOUNT_DEACTIVATED');
            expect(result.statusCode).toBe(401);
        });

        it('should return error for invalid password', async () => {
            const email = 'test@example.com';
            const password = 'wrongpassword';

            User.findByEmail.mockResolvedValue(mockUser);
            mockUser.comparePassword.mockResolvedValue(false);

            const result = await authService.authenticateUser(email, password);

            expect(result.status).toBe('error');
            expect(result.message).toBe('Invalid email or password');
            expect(result.errorCode).toBe('INVALID_CREDENTIALS');
            expect(result.statusCode).toBe(401);
        });

        it('should handle authentication errors', async () => {
            const email = 'test@example.com';
            const password = 'password123';

            User.findByEmail.mockRejectedValue(new Error('Database error'));

            const result = await authService.authenticateUser(email, password);

            expect(result.status).toBe('error');
            expect(result.message).toBe('Authentication failed');
            expect(result.errorCode).toBe('AUTHENTICATION_ERROR');
            expect(result.statusCode).toBe(500);
        });
    });

    describe('refreshAccessToken', () => {
        it('should refresh access token successfully', async () => {
            const refreshToken = 'mock-refresh-token';
            const mockDecodedToken = {
                email: 'test@example.com',
                tokenType: 'refresh'
            };
            const mockNewAccessToken = 'new-access-token';

            jwt.verify.mockReturnValue(mockDecodedToken);
            User.findByEmail.mockResolvedValue(mockUser);
            jwt.sign.mockReturnValue(mockNewAccessToken);

            const result = await authService.refreshAccessToken(refreshToken);

            expect(jwt.verify).toHaveBeenCalledWith(
                refreshToken,
                process.env.JWT_REFRESH_SECRET_KEY || process.env.JWT_SECRET_KEY
            );
            expect(User.findByEmail).toHaveBeenCalledWith('test@example.com');
            expect(result.status).toBe('success');
            expect(result.message).toBe('Token refreshed successfully');
            expect(result.data.accessToken).toBe(mockNewAccessToken);
        });

        it('should return error for invalid token type', async () => {
            const refreshToken = 'mock-refresh-token';
            const mockDecodedToken = {
                email: 'test@example.com',
                tokenType: 'access' // Wrong token type
            };

            jwt.verify.mockReturnValue(mockDecodedToken);

            const result = await authService.refreshAccessToken(refreshToken);

            expect(result.status).toBe('error');
            expect(result.message).toBe('Invalid authentication token');
            expect(result.errorCode).toBe('INVALID_TOKEN_TYPE');
            expect(result.statusCode).toBe(401);
        });

        it('should return error when user not found', async () => {
            const refreshToken = 'mock-refresh-token';
            const mockDecodedToken = {
                email: 'test@example.com',
                tokenType: 'refresh'
            };

            jwt.verify.mockReturnValue(mockDecodedToken);
            User.findByEmail.mockResolvedValue(null);

            const result = await authService.refreshAccessToken(refreshToken);

            expect(result.status).toBe('error');
            expect(result.message).toBe('User account not found');
            expect(result.errorCode).toBe('USER_NOT_FOUND');
            expect(result.statusCode).toBe(401);
        });

        it('should return error for expired token', async () => {
            const refreshToken = 'mock-refresh-token';
            const expiredError = new Error('Token expired');
            expiredError.name = 'TokenExpiredError';

            jwt.verify.mockImplementation(() => {
                throw expiredError;
            });

            const result = await authService.refreshAccessToken(refreshToken);

            expect(result.status).toBe('error');
            expect(result.message).toBe('Authentication token has expired');
            expect(result.errorCode).toBe('TOKEN_EXPIRED');
            expect(result.statusCode).toBe(401);
        });

        it('should return error for invalid token', async () => {
            const refreshToken = 'invalid-token';

            jwt.verify.mockImplementation(() => {
                throw new Error('Invalid token');
            });

            const result = await authService.refreshAccessToken(refreshToken);

            expect(result.status).toBe('error');
            expect(result.message).toBe('Invalid authentication token');
            expect(result.errorCode).toBe('INVALID_REFRESH_TOKEN');
            expect(result.statusCode).toBe(401);
        });
    });

    describe('extractUserFromHeaders', () => {
        it('should extract user from valid authorization header', async () => {
            const headers = {
                authorization: 'Bearer mock-access-token'
            };
            const mockDecodedToken = {
                email: 'test@example.com'
            };

            jwt.verify.mockReturnValue(mockDecodedToken);
            User.findByEmail.mockResolvedValue(mockUser);

            const result = await authService.extractUserFromHeaders(headers);

            expect(jwt.verify).toHaveBeenCalledWith('mock-access-token');
            expect(User.findByEmail).toHaveBeenCalledWith('test@example.com');
            expect(result).toEqual({
                id: mockUser._id,
                email: mockUser.email,
                role: mockUser.role,
                permissions: mockUser.permissions,
                allowedServices: mockUser.allowedServices,
                isActive: mockUser.isActive,
                firstName: mockUser.firstName,
                lastName: mockUser.lastName,
                fullName: mockUser.firstName + ' ' + mockUser.lastName
            });
        });

        it('should return null when no authorization header', async () => {
            const headers = {};

            const result = await authService.extractUserFromHeaders(headers);

            expect(result).toBeNull();
        });

        it('should return null when authorization header format is invalid', async () => {
            const headers = {
                authorization: 'InvalidFormat mock-token'
            };

            const result = await authService.extractUserFromHeaders(headers);

            expect(result).toBeNull();
        });

        it('should return null when token is invalid', async () => {
            const headers = {
                authorization: 'Bearer invalid-token'
            };

            jwt.verify.mockImplementation(() => {
                throw new Error('Invalid token');
            });

            const result = await authService.extractUserFromHeaders(headers);

            expect(result).toBeNull();
        });

        it('should return null when user not found', async () => {
            const headers = {
                authorization: 'Bearer mock-access-token'
            };
            const mockDecodedToken = {
                email: 'test@example.com'
            };

            jwt.verify.mockReturnValue(mockDecodedToken);
            User.findByEmail.mockResolvedValue(null);

            const result = await authService.extractUserFromHeaders(headers);

            expect(result).toBeNull();
        });
    });

    describe('validateUserPermissions', () => {
        it('should return true when user has all required permissions', () => {
            const user = {
                role: 'administrator',
                permissions: ['custom_permission']
            };
            const requiredPermissions = ['create_booking', 'read_booking'];

            const result = authService.validateUserPermissions(user, requiredPermissions);

            expect(result).toBe(true);
        });

        it('should return false when user is missing required permissions', () => {
            const user = {
                role: 'customer',
                permissions: []
            };
            const requiredPermissions = ['create_booking', 'read_booking'];

            const result = authService.validateUserPermissions(user, requiredPermissions);

            expect(result).toBe(false);
        });

        it('should return false when user is null', () => {
            const user = null;
            const requiredPermissions = ['create_booking'];

            const result = authService.validateUserPermissions(user, requiredPermissions);

            expect(result).toBe(false);
        });
    });

    describe('validateUserRoleHierarchy', () => {
        it('should return true when user has sufficient role level', () => {
            const user = {
                role: 'manager'
            };
            const minimumRequiredRole = 'employee';

            const result = authService.validateUserRoleHierarchy(user, minimumRequiredRole);

            expect(result).toBe(true);
        });

        it('should return false when user has insufficient role level', () => {
            const user = {
                role: 'employee'
            };
            const minimumRequiredRole = 'manager';

            const result = authService.validateUserRoleHierarchy(user, minimumRequiredRole);

            expect(result).toBe(false);
        });

        it('should return false when user is null', () => {
            const user = null;
            const minimumRequiredRole = 'employee';

            const result = authService.validateUserRoleHierarchy(user, minimumRequiredRole);

            expect(result).toBe(false);
        });
    });

    describe('validateUserServiceAccess', () => {
        it('should return true when user has access to all required services', () => {
            const user = {
                role: 'administrator',
                allowedServices: ['hotel', 'cruise', 'insurance']
            };
            const requiredServices = ['hotel', 'cruise'];

            const result = authService.validateUserServiceAccess(user, requiredServices);

            expect(result).toBe(true);
        });

        it('should return true for super administrator', () => {
            const user = {
                role: 'super_administrator',
                allowedServices: []
            };
            const requiredServices = ['hotel', 'cruise'];

            const result = authService.validateUserServiceAccess(user, requiredServices);

            expect(result).toBe(true);
        });

        it('should return true for administrator', () => {
            const user = {
                role: 'administrator',
                allowedServices: []
            };
            const requiredServices = ['hotel', 'cruise'];

            const result = authService.validateUserServiceAccess(user, requiredServices);

            expect(result).toBe(true);
        });

        it('should return false when user lacks required services', () => {
            const user = {
                role: 'customer',
                allowedServices: ['hotel']
            };
            const requiredServices = ['hotel', 'cruise'];

            const result = authService.validateUserServiceAccess(user, requiredServices);

            expect(result).toBe(false);
        });

        it('should return false when user is null', () => {
            const user = null;
            const requiredServices = ['hotel'];

            const result = authService.validateUserServiceAccess(user, requiredServices);

            expect(result).toBe(false);
        });
    });

    describe('getUserEffectivePermissions', () => {
        it('should return combined permissions from role and custom permissions', () => {
            const user = {
                role: 'manager',
                permissions: ['custom_permission']
            };

            const result = authService.getUserEffectivePermissions(user);

            expect(result).toContain('custom_permission');
            expect(result.length).toBeGreaterThan(1);
        });

        it('should return empty array when user is null', () => {
            const user = null;

            const result = authService.getUserEffectivePermissions(user);

            expect(result).toEqual([]);
        });

        it('should return empty array when user has no role', () => {
            const user = {
                permissions: ['custom_permission']
            };

            const result = authService.getUserEffectivePermissions(user);

            expect(result).toEqual([]);
        });
    });
}); 