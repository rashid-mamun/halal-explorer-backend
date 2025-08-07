const request = require('supertest');
const express = require('express');
const authRoutes = require('../../../src/auth/routes');
const User = require('../../../src/models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Create test app
const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

describe('Authentication Routes Integration Tests', () => {
    let testUser;
    let testUserData;

    beforeEach(async () => {
        // Clean up database
        await global.testUtils.cleanupDatabase();

        // Create test user data
        testUserData = global.testUtils.generateTestUser();

        // Create test user in database (password will be hashed by pre-save middleware)
        testUser = new User(testUserData);
        await testUser.save();
    });

    describe('POST /auth/login', () => {
        it('should login successfully with valid credentials', async () => {
            const loginData = {
                email: testUserData.email,
                password: testUserData.password
            };

            const response = await request(app)
                .post('/auth/login')
                .send(loginData);

            expect(response.status).toBe(200);
            expect(response.body.status).toBe('success');
            expect(response.body.message).toBe('Login successful');
            expect(response.body.data).toHaveProperty('accessToken');
            expect(response.body.data).toHaveProperty('refreshToken');
            expect(response.body.data).toHaveProperty('user');
            expect(response.body.data.user.email).toBe(testUserData.email);
            expect(response.body.data.user.firstName).toBe(testUserData.firstName);
            expect(response.body.data.user.lastName).toBe(testUserData.lastName);
        });

        it('should return error for invalid email format', async () => {
            const loginData = {
                email: 'invalid-email',
                password: testUserData.password
            };

            const response = await request(app)
                .post('/auth/login')
                .send(loginData)
                .expect(400);

            expect(response.body.status).toBe('error');
            expect(response.body.message).toBe('Invalid email format');
            expect(response.body.errorCode).toBe('INVALID_EMAIL_FORMAT');
        });

        it('should return error for missing email', async () => {
            const loginData = {
                password: testUserData.password
            };

            const response = await request(app)
                .post('/auth/login')
                .send(loginData)
                .expect(400);

            expect(response.body.status).toBe('error');
            expect(response.body.message).toBe('Required fields are missing');
            expect(response.body.errorCode).toBe('MISSING_FIELDS');
        });

        it('should return error for missing password', async () => {
            const loginData = {
                email: testUserData.email
            };

            const response = await request(app)
                .post('/auth/login')
                .send(loginData)
                .expect(400);

            expect(response.body.status).toBe('error');
            expect(response.body.message).toBe('Required fields are missing');
            expect(response.body.errorCode).toBe('MISSING_FIELDS');
        });

        it('should return error for non-existent user', async () => {
            const loginData = {
                email: 'nonexistent@example.com',
                password: testUserData.password
            };

            const response = await request(app)
                .post('/auth/login')
                .send(loginData)
                .expect(401);

            expect(response.body.status).toBe('error');
            expect(response.body.message).toBe('User account not found');
            expect(response.body.errorCode).toBe('USER_NOT_FOUND');
        });

        it('should return error for wrong password', async () => {
            const loginData = {
                email: testUserData.email,
                password: 'wrongpassword'
            };

            const response = await request(app)
                .post('/auth/login')
                .send(loginData)
                .expect(401);

            expect(response.body.status).toBe('error');
            expect(response.body.message).toBe('Invalid email or password');
            expect(response.body.errorCode).toBe('INVALID_CREDENTIALS');
        });

        it('should return error for deactivated account', async () => {
            // Deactivate user
            testUser.isActive = false;
            await testUser.save();

            const loginData = {
                email: testUserData.email,
                password: testUserData.password
            };

            const response = await request(app)
                .post('/auth/login')
                .send(loginData)
                .expect(401);

            expect(response.body.status).toBe('error');
            expect(response.body.message).toBe('User account is deactivated');
            expect(response.body.errorCode).toBe('ACCOUNT_DEACTIVATED');
        });
    });

    describe('POST /auth/register', () => {
        it('should register new user successfully', async () => {
            const newUserData = {
                email: 'newuser@example.com',
                password: 'newpassword123',
                firstName: 'New',
                lastName: 'User',
                role: 'customer'
            };

            const response = await request(app)
                .post('/auth/register')
                .send(newUserData)
                .expect(201);

            expect(response.body.status).toBe('success');
            expect(response.body.message).toBe('User account created successfully');
            expect(response.body.data).toHaveProperty('email', newUserData.email);
            expect(response.body.data).toHaveProperty('firstName', newUserData.firstName);
            expect(response.body.data).toHaveProperty('lastName', newUserData.lastName);
            expect(response.body.data).toHaveProperty('role', newUserData.role);
            expect(response.body.data).not.toHaveProperty('password');
        });

        it('should return error for duplicate email', async () => {
            const duplicateUserData = {
                email: testUserData.email, // Use existing email
                password: 'newpassword123',
                firstName: 'New',
                lastName: 'User'
            };

            const response = await request(app)
                .post('/auth/register')
                .send(duplicateUserData)
                .expect(409);

            expect(response.body.status).toBe('error');
            expect(response.body.message).toBe('Email address already exists');
            expect(response.body.errorCode).toBe('DUPLICATE_EMAIL');
        });

        it('should return error for invalid email format', async () => {
            const invalidUserData = {
                email: 'invalid-email',
                password: 'newpassword123',
                firstName: 'New',
                lastName: 'User'
            };

            const response = await request(app)
                .post('/auth/register')
                .send(invalidUserData)
                .expect(400);

            expect(response.body.status).toBe('error');
            expect(response.body.message).toBe('Invalid email format');
            expect(response.body.errorCode).toBe('INVALID_EMAIL_FORMAT');
        });

        it('should return error for missing required fields', async () => {
            const incompleteUserData = {
                email: 'newuser@example.com',
                password: 'newpassword123'
                // Missing firstName and lastName
            };

            const response = await request(app)
                .post('/auth/register')
                .send(incompleteUserData)
                .expect(400);

            expect(response.body.status).toBe('error');
            expect(response.body.message).toBe('Required fields are missing');
            expect(response.body.errorCode).toBe('MISSING_REQUIRED_FIELDS');
        });
    });

    describe('POST /auth/refresh-token', () => {
        let accessToken;
        let refreshToken;

        beforeEach(async () => {
            // Login to get tokens
            const loginResponse = await request(app)
                .post('/auth/login')
                .send({
                    email: testUserData.email,
                    password: testUserData.password
                });

            accessToken = loginResponse.body.data.accessToken;
            refreshToken = loginResponse.body.data.refreshToken;
        });

        it('should refresh access token successfully', async () => {
            const response = await request(app)
                .post('/auth/refresh-token')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ refreshToken })
                .expect(200);

            expect(response.body.status).toBe('success');
            expect(response.body.message).toBe('Token refreshed successfully');
            expect(response.body.data).toHaveProperty('accessToken');
            expect(response.body.data).toHaveProperty('user');
            expect(response.body.data.user.email).toBe(testUserData.email);
        });

        it('should return error for missing refresh token', async () => {
            const response = await request(app)
                .post('/auth/refresh-token')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({})
                .expect(400);

            expect(response.body.status).toBe('error');
            expect(response.body.message).toBe('Authentication token is required');
            expect(response.body.errorCode).toBe('MISSING_REFRESH_TOKEN');
        });

        it('should return error for invalid refresh token', async () => {
            const response = await request(app)
                .post('/auth/refresh-token')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ refreshToken: 'invalid-token' })
                .expect(401);

            expect(response.body.status).toBe('error');
            expect(response.body.message).toBe('Invalid authentication token');
            expect(response.body.errorCode).toBe('INVALID_REFRESH_TOKEN');
        });
    });

    describe('GET /auth/profile', () => {
        let accessToken;

        beforeEach(async () => {
            // Login to get access token
            const loginResponse = await request(app)
                .post('/auth/login')
                .send({
                    email: testUserData.email,
                    password: testUserData.password
                });

            accessToken = loginResponse.body.data.accessToken;
        });

        it('should get user profile successfully', async () => {
            const response = await request(app)
                .get('/auth/profile')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200);

            expect(response.body.status).toBe('success');
            expect(response.body.message).toBe('Profile retrieved successfully');
            expect(response.body.data).toHaveProperty('email', testUserData.email);
            expect(response.body.data).toHaveProperty('firstName', testUserData.firstName);
            expect(response.body.data).toHaveProperty('lastName', testUserData.lastName);
        });

        it('should return error without authorization header', async () => {
            const response = await request(app)
                .get('/auth/profile')
                .expect(401);

            expect(response.body.status).toBe('error');
            expect(response.body.message).toBe('Authentication token is required');
            expect(response.body.errorCode).toBe('TOKEN_REQUIRED');
        });

        it('should return error with invalid token', async () => {
            const response = await request(app)
                .get('/auth/profile')
                .set('Authorization', 'Bearer invalid-token')
                .expect(401);

            expect(response.body.status).toBe('error');
            expect(response.body.message).toBe('Authentication token is required');
            expect(response.body.errorCode).toBe('TOKEN_REQUIRED');
        });
    });

    describe('PUT /auth/profile', () => {
        let accessToken;

        beforeEach(async () => {
            // Login to get access token
            const loginResponse = await request(app)
                .post('/auth/login')
                .send({
                    email: testUserData.email,
                    password: testUserData.password
                });

            accessToken = loginResponse.body.data.accessToken;
        });

        it('should update user profile successfully', async () => {
            const updateData = {
                firstName: 'Updated',
                lastName: 'Name',
                phoneNumber: '+1234567890'
            };

            const response = await request(app)
                .put('/auth/profile')
                .set('Authorization', `Bearer ${accessToken}`)
                .send(updateData)
                .expect(200);

            expect(response.body.status).toBe('success');
            expect(response.body.message).toBe('User account updated successfully');
            expect(response.body.data).toHaveProperty('firstName', updateData.firstName);
            expect(response.body.data).toHaveProperty('lastName', updateData.lastName);
            expect(response.body.data).toHaveProperty('phoneNumber', updateData.phoneNumber);
        });

        it('should return error without authorization header', async () => {
            const updateData = {
                firstName: 'Updated'
            };

            const response = await request(app)
                .put('/auth/profile')
                .send(updateData)
                .expect(401);

            expect(response.body.status).toBe('error');
            expect(response.body.message).toBe('Authentication token is required');
            expect(response.body.errorCode).toBe('TOKEN_REQUIRED');
        });
    });

    describe('PUT /auth/change-password', () => {
        let accessToken;

        beforeEach(async () => {
            // Login to get access token
            const loginResponse = await request(app)
                .post('/auth/login')
                .send({
                    email: testUserData.email,
                    password: testUserData.password
                });

            accessToken = loginResponse.body.data.accessToken;
        });

        it('should change password successfully', async () => {
            const passwordData = {
                currentPassword: testUserData.password,
                newPassword: 'newpassword123'
            };

            const response = await request(app)
                .put('/auth/change-password')
                .set('Authorization', `Bearer ${accessToken}`)
                .send(passwordData)
                .expect(200);

            expect(response.body.status).toBe('success');
            expect(response.body.message).toBe('Password updated successfully');
        });

        it('should return error for wrong current password', async () => {
            const passwordData = {
                currentPassword: 'wrongpassword',
                newPassword: 'newpassword123'
            };

            const response = await request(app)
                .put('/auth/change-password')
                .set('Authorization', `Bearer ${accessToken}`)
                .send(passwordData)
                .expect(400);

            expect(response.body.status).toBe('error');
            expect(response.body.message).toBe('Invalid email or password');
            expect(response.body.errorCode).toBe('INVALID_CURRENT_PASSWORD');
        });

        it('should return error for missing password fields', async () => {
            const passwordData = {
                currentPassword: testUserData.password
                // Missing newPassword
            };

            const response = await request(app)
                .put('/auth/change-password')
                .set('Authorization', `Bearer ${accessToken}`)
                .send(passwordData)
                .expect(400);

            expect(response.body.status).toBe('error');
            expect(response.body.message).toBe('Required fields are missing');
            expect(response.body.errorCode).toBe('MISSING_PASSWORD_FIELDS');
        });
    });

    describe('POST /auth/logout', () => {
        let accessToken;

        beforeEach(async () => {
            // Login to get access token
            const loginResponse = await request(app)
                .post('/auth/login')
                .send({
                    email: testUserData.email,
                    password: testUserData.password
                });

            accessToken = loginResponse.body.data.accessToken;
        });

        it('should logout successfully', async () => {
            const response = await request(app)
                .post('/auth/logout')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200);

            expect(response.body.status).toBe('success');
            expect(response.body.message).toBe('Logout successful');
        });

        it('should return error without authorization header', async () => {
            const response = await request(app)
                .post('/auth/logout')
                .expect(401);

            expect(response.body.status).toBe('error');
            expect(response.body.message).toBe('Authentication token is required');
            expect(response.body.errorCode).toBe('TOKEN_REQUIRED');
        });
    });

    describe('GET /auth/health', () => {
        it('should return health status', async () => {
            const response = await request(app)
                .get('/auth/health')
                .expect(200);

            expect(response.body.status).toBe('success');
            expect(response.body.message).toBe('Authentication service is healthy');
            expect(response.body.data).toHaveProperty('service', 'authentication');
            expect(response.body.data).toHaveProperty('timestamp');
            expect(response.body.data).toHaveProperty('version', '1.0.0');
        });
    });

    describe('GET /auth/test/protected', () => {
        let accessToken;

        beforeEach(async () => {
            // Login to get access token
            const loginResponse = await request(app)
                .post('/auth/login')
                .send({
                    email: testUserData.email,
                    password: testUserData.password
                });

            accessToken = loginResponse.body.data.accessToken;
        });

        it('should access protected resource successfully', async () => {
            const response = await request(app)
                .get('/auth/test/protected')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200);

            expect(response.body.status).toBe('success');
            expect(response.body.message).toBe('Protected resource accessed successfully');
            expect(response.body.data).toHaveProperty('user');
            expect(response.body.data.user).toHaveProperty('email', testUserData.email);
            expect(response.body.data.user).toHaveProperty('role', testUserData.role);
        });

        it('should return error without authorization header', async () => {
            const response = await request(app)
                .get('/auth/test/protected')
                .expect(401);

            expect(response.body.status).toBe('error');
            expect(response.body.message).toBe('Authentication token is required');
            expect(response.body.errorCode).toBe('TOKEN_REQUIRED');
        });
    });

    describe('GET /auth/test/permissions', () => {
        let accessToken;

        beforeEach(async () => {
            // Login to get access token
            const loginResponse = await request(app)
                .post('/auth/login')
                .send({
                    email: testUserData.email,
                    password: testUserData.password
                });

            accessToken = loginResponse.body.data.accessToken;
        });

        it('should get user permissions successfully', async () => {
            const response = await request(app)
                .get('/auth/test/permissions')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200);

            expect(response.body.status).toBe('success');
            expect(response.body.message).toBe('User permissions retrieved successfully');
            expect(response.body.data).toHaveProperty('user');
            expect(response.body.data).toHaveProperty('effectivePermissions');
            expect(response.body.data.user).toHaveProperty('email', testUserData.email);
            expect(response.body.data.user).toHaveProperty('role', testUserData.role);
        });

        it('should return error without authorization header', async () => {
            const response = await request(app)
                .get('/auth/test/permissions')
                .expect(401);

            expect(response.body.status).toBe('error');
            expect(response.body.message).toBe('Authentication token is required');
            expect(response.body.errorCode).toBe('TOKEN_REQUIRED');
        });
    });
}); 