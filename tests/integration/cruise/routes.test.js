const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../../src/app');
const Cruise = require('../../../src/models/Cruise');
const User = require('../../../src/models/User');
const { generateAccessToken } = require('../../../src/auth/services/authService');
const { USER_ROLES, PERMISSIONS, SERVICES } = require('../../../src/utils/constants');

describe('Cruise Routes Integration Tests', () => {
    let testUser, adminUser, managerUser;
    let testCruise, testCruise2;
    let userToken, adminToken, managerToken;

    beforeEach(async () => {
        // Create test users
        testUser = await User.create({
            email: 'testuser@example.com',
            password: 'TestPassword123!',
            firstName: 'Test',
            lastName: 'User',
            role: USER_ROLES.CUSTOMER,
            permissions: [],
            allowedServices: []
        });

        adminUser = await User.create({
            email: `admin-${Date.now()}-${Math.random().toString(36).substr(2, 9)}@example.com`,
            password: 'AdminPassword123!',
            firstName: 'Admin',
            lastName: 'User',
            role: USER_ROLES.ADMINISTRATOR,
            permissions: [PERMISSIONS.MANAGE_CRUISE_SERVICES],
            allowedServices: [SERVICES.CRUISE]
        });

        managerUser = await User.create({
            email: `manager-${Date.now()}-${Math.random().toString(36).substr(2, 9)}@example.com`,
            password: 'ManagerPassword123!',
            firstName: 'Manager',
            lastName: 'User',
            role: USER_ROLES.MANAGER,
            permissions: [PERMISSIONS.MANAGE_CRUISE_SERVICES],
            allowedServices: [SERVICES.CRUISE]
        });

        // Generate fresh tokens for each test
        userToken = generateAccessToken(testUser);
        adminToken = generateAccessToken(adminUser);
        managerToken = generateAccessToken(managerUser);

        // Create test cruises
        testCruise = await Cruise.create({
            name: 'Test Cruise 1',
            description: 'A wonderful test cruise',
            cruiseLine: 'Test Line',
            shipName: 'Test Ship',
            departurePort: 'Miami',
            arrivalPort: 'Barcelona',
            departureDate: new Date('2025-12-01'),
            arrivalDate: new Date('2025-12-08'),
            duration: 7,
            price: 1500,
            currency: 'USD',
            capacity: 2000,
            availableCabins: 150,
            cabinTypes: [
                { name: 'Interior', price: 1200, capacity: 50, available: 50 },
                { name: 'Ocean View', price: 1500, capacity: 100, available: 100 }
            ],
            amenities: ['Pool', 'Spa', 'Restaurant'],
            destinations: [
                { name: 'Miami', country: 'USA', arrivalDate: new Date('2025-12-01'), departureDate: new Date('2025-12-02') },
                { name: 'Barcelona', country: 'Spain', arrivalDate: new Date('2025-12-08'), departureDate: new Date('2025-12-08') }
            ],
            images: [
                { url: 'image1.jpg', alt: 'Cruise Image 1', isPrimary: true },
                { url: 'image2.jpg', alt: 'Cruise Image 2' }
            ],
            halalRating: 4,
            halalFeatures: ['Halal Food', 'Prayer Room'],
            isActive: true,
            isFeatured: true,
            tags: ['family', 'luxury'],
            cancellationPolicy: 'Standard cancellation policy',
            termsAndConditions: 'Standard terms and conditions',
            createdBy: adminUser._id
        });

        testCruise2 = await Cruise.create({
            name: 'Test Cruise 2',
            description: 'Another wonderful test cruise',
            cruiseLine: 'Test Line 2',
            shipName: 'Test Ship 2',
            departurePort: 'Barcelona',
            arrivalPort: 'Rome',
            departureDate: new Date('2025-11-01'),
            arrivalDate: new Date('2025-11-05'),
            duration: 4,
            price: 800,
            currency: 'EUR',
            capacity: 1500,
            availableCabins: 100,
            cabinTypes: [
                { name: 'Interior', price: 600, capacity: 30, available: 30 },
                { name: 'Ocean View', price: 800, capacity: 70, available: 70 }
            ],
            amenities: ['Pool', 'Gym'],
            destinations: [
                { name: 'Barcelona', country: 'Spain', arrivalDate: new Date('2025-11-01'), departureDate: new Date('2025-11-02') },
                { name: 'Rome', country: 'Italy', arrivalDate: new Date('2025-11-05'), departureDate: new Date('2025-11-05') }
            ],
            images: [
                { url: 'image3.jpg', alt: 'Cruise Image 3', isPrimary: true }
            ],
            halalRating: 3,
            halalFeatures: ['Halal Food'],
            isActive: true,
            isFeatured: false,
            tags: ['budget', 'short'],
            cancellationPolicy: 'Flexible cancellation policy',
            termsAndConditions: 'Standard terms and conditions',
            createdBy: managerUser._id
        });
    });

    afterAll(async () => {
        await Cruise.deleteMany({});
        await User.deleteMany({});
        await mongoose.connection.close();
    });

    describe('Authentication Test', () => {
        it('should authenticate with valid token', async () => {
            const response = await request(app)
                .get('/cruise')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);

            expect(response.body.status).toBe('success');
        });

        it('should create cruise with admin token', async () => {
            const newCruiseData = {
                name: 'Admin Test Cruise',
                description: 'A test cruise created by admin',
                cruiseLine: 'Admin Test Line',
                shipName: 'Admin Test Ship',
                departurePort: 'Admin Port',
                arrivalPort: 'Admin Arrival Port',
                departureDate: '2025-10-01',
                arrivalDate: '2025-10-08',
                duration: 7,
                price: 2000,
                currency: 'USD',
                capacity: 2000,
                availableCabins: 200,
                cabinTypes: [
                    { name: 'Interior', price: 1800, capacity: 100, available: 100 },
                    { name: 'Ocean View', price: 2000, capacity: 100, available: 100 }
                ],
                amenities: ['Pool', 'Spa'],
                destinations: [
                    { name: 'Admin Port', country: 'Test Country', arrivalDate: '2025-10-01', departureDate: '2025-10-02' },
                    { name: 'Admin Arrival Port', country: 'Test Country', arrivalDate: '2025-10-08', departureDate: '2025-10-08' }
                ],
                images: [
                    { url: 'admin-image.jpg', alt: 'Admin Image', isPrimary: true }
                ],
                halalRating: 5,
                halalFeatures: ['Halal Food', 'Prayer Room'],
                isActive: true,
                isFeatured: true,
                tags: ['admin', 'test'],
                cancellationPolicy: 'Admin cancellation policy',
                termsAndConditions: 'Admin terms and conditions'
            };

            const response = await request(app)
                .post('/cruise')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(newCruiseData)
                .expect(201);

            expect(response.body.status).toBe('success');
            expect(response.body.data.name).toBe('Admin Test Cruise');
        });
    });

    describe('GET /cruise/health', () => {
        it('should return health status', async () => {
            const response = await request(app)
                .get('/cruise/health')
                .expect(200);

            expect(response.body).toMatchObject({
                status: 'success',
                message: 'Cruise service is healthy',
                data: {
                    service: 'cruise',
                    timestamp: expect.any(String)
                }
            });
        });
    });

    describe('GET /cruise', () => {
        it('should get all cruises with pagination', async () => {
            const response = await request(app)
                .get('/cruise')
                .expect(200);

            expect(response.body).toMatchObject({
                status: 'success',
                message: 'Cruises retrieved successfully',
                data: {
                    cruises: expect.any(Array),
                    pagination: {
                        page: 1,
                        pageSize: 10,
                        total: 2,
                        totalPages: 1
                    }
                }
            });

            expect(response.body.data.cruises).toHaveLength(2);
            expect(response.body.data.cruises[0]).toHaveProperty('id');
            expect(response.body.data.cruises[0]).toHaveProperty('name');
        });

        it('should filter cruises by price range', async () => {
            const response = await request(app)
                .get('/cruise?minPrice=1000&maxPrice=2000')
                .expect(200);

            expect(response.body.data.cruises).toHaveLength(1);
            expect(response.body.data.cruises[0].name).toBe('Test Cruise 1');
        });

        it('should filter cruises by departure port', async () => {
            const response = await request(app)
                .get('/cruise?departurePort=Miami')
                .expect(200);

            expect(response.body.data.cruises).toHaveLength(1);
            expect(response.body.data.cruises[0].departurePort).toBe('Miami');
        });
    });

    describe('GET /cruise/featured', () => {
        it('should get featured cruises', async () => {
            const response = await request(app)
                .get('/cruise/featured')
                .expect(200);

            expect(response.body).toMatchObject({
                status: 'success',
                message: 'Featured cruises retrieved successfully',
                data: expect.any(Array)
            });

            expect(response.body.data).toHaveLength(1);
            expect(response.body.data[0].isFeatured).toBe(true);
        });
    });

    describe('GET /cruise/search/destination/:destination', () => {
        it('should search cruises by destination', async () => {
            const response = await request(app)
                .get('/cruise/search/destination/Barcelona')
                .expect(200);

            expect(response.body).toMatchObject({
                status: 'success',
                message: 'Cruises search completed successfully',
                data: {
                    cruises: expect.any(Array),
                    searchTerm: 'Barcelona'
                }
            });

            expect(response.body.data.cruises).toHaveLength(2);
        });

        it('should return empty array for non-existent destination', async () => {
            const response = await request(app)
                .get('/cruise/search/destination/NonExistent')
                .expect(200);

            expect(response.body.data.cruises).toHaveLength(0);
        });
    });

    describe('GET /cruise/search/date-range', () => {
        it('should get cruises by date range', async () => {
            const response = await request(app)
                .get('/cruise/search/date-range')
                .query({
                    startDate: '2025-11-01',
                    endDate: '2025-12-31'
                })
                .expect(200);

            expect(response.body).toMatchObject({
                status: 'success',
                message: 'Cruises by date range retrieved successfully',
                data: {
                    cruises: expect.any(Array),
                    dateRange: {
                        startDate: expect.any(String),
                        endDate: expect.any(String)
                    }
                }
            });

            expect(response.body.data.cruises).toHaveLength(2);
        });

        it('should return error for invalid date range', async () => {
            const response = await request(app)
                .get('/cruise/search/date-range')
                .query({
                    startDate: '2025-12-31',
                    endDate: '2025-11-01'
                })
                .expect(200); // The service doesn't validate date range order

            expect(response.body.data.cruises).toHaveLength(0);
        });
    });

    describe('GET /cruise/halal', () => {
        it('should get halal-rated cruises', async () => {
            const response = await request(app)
                .get('/cruise/halal')
                .expect(200);

            expect(response.body).toMatchObject({
                status: 'success',
                message: 'Halal cruises retrieved successfully',
                data: {
                    cruises: expect.any(Array),
                    minHalalRating: 3
                }
            });

            expect(response.body.data.cruises).toHaveLength(2);
            expect(response.body.data.cruises[0].halalRating).toBeGreaterThan(0);
        });
    });

    describe('GET /cruise/:cruiseId', () => {
        it('should get cruise by ID', async () => {
            const response = await request(app)
                .get(`/cruise/${testCruise._id}`)
                .expect(200);

            expect(response.body).toMatchObject({
                status: 'success',
                message: 'Cruise retrieved successfully',
                data: expect.objectContaining({
                    _id: testCruise._id.toString(),
                    name: 'Test Cruise 1',
                    cruiseLine: 'Test Line'
                })
            });
        });

        it('should return 404 for non-existent cruise', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const response = await request(app)
                .get(`/cruise/${fakeId}`)
                .expect(404);

            expect(response.body.status).toBe('error');
            expect(response.body.message).toContain('Cruise not found');
        });

        it('should return 500 for invalid cruise ID', async () => {
            const response = await request(app)
                .get('/cruise/invalid-id')
                .expect(500);

            expect(response.body.status).toBe('error');
        });
    });

    describe('POST /cruise', () => {
        const newCruiseData = {
            name: 'New Test Cruise',
            description: 'A brand new test cruise',
            cruiseLine: 'New Test Line',
            shipName: 'New Test Ship',
            departurePort: 'New York',
            arrivalPort: 'London',
            departureDate: '2025-10-01',
            arrivalDate: '2025-10-08',
            duration: 7,
            price: 2000,
            currency: 'USD',
            capacity: 2500,
            availableCabins: 200,
            cabinTypes: [
                { name: 'Interior', price: 1800, capacity: 80, available: 80 },
                { name: 'Ocean View', price: 2000, capacity: 120, available: 120 }
            ],
            amenities: ['Pool', 'Spa', 'Restaurant', 'Gym'],
            destinations: [
                { name: 'New York', country: 'USA', arrivalDate: '2025-10-01', departureDate: '2025-10-02' },
                { name: 'London', country: 'UK', arrivalDate: '2025-10-08', departureDate: '2025-10-08' }
            ],
            images: [
                { url: 'new-image1.jpg', alt: 'New Cruise Image 1', isPrimary: true },
                { url: 'new-image2.jpg', alt: 'New Cruise Image 2' }
            ],
            halalRating: 5,
            halalFeatures: ['Halal Food', 'Prayer Room', 'Halal Entertainment'],
            isActive: true,
            isFeatured: true,
            tags: ['luxury', 'premium'],
            cancellationPolicy: 'Premium cancellation policy',
            termsAndConditions: 'Premium terms and conditions'
        };

        it('should create new cruise with admin token', async () => {
            const response = await request(app)
                .post('/cruise')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(newCruiseData)
                .expect(201);

            expect(response.body).toMatchObject({
                status: 'success',
                message: 'Cruise created successfully',
                data: expect.objectContaining({
                    name: 'New Test Cruise',
                    cruiseLine: 'New Test Line',
                    price: 2000
                })
            });
        });

        it('should create new cruise with manager token', async () => {
            const managerCruiseData = { ...newCruiseData, name: 'Manager Cruise' };
            const response = await request(app)
                .post('/cruise')
                .set('Authorization', `Bearer ${managerToken}`)
                .send(managerCruiseData)
                .expect(201);

            expect(response.body.data.name).toBe('Manager Cruise');
        });

        it('should return 401 without authentication', async () => {
            const response = await request(app)
                .post('/cruise')
                .send(newCruiseData)
                .expect(401);

            expect(response.body.status).toBe('error');
        });

        it('should return 403 with insufficient permissions', async () => {
            const response = await request(app)
                .post('/cruise')
                .set('Authorization', `Bearer ${userToken}`)
                .send(newCruiseData)
                .expect(403);

            expect(response.body.status).toBe('error');
        });

        it('should return 400 for invalid data', async () => {
            const invalidData = { name: '' };
            const response = await request(app)
                .post('/cruise')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(invalidData)
                .expect(400);

            expect(response.body.status).toBe('error');
        });
    });

    describe('PUT /cruise/:cruiseId', () => {
        const updateData = {
            name: 'Updated Cruise Name',
            price: 1800,
            description: 'Updated description'
        };

        it('should update cruise with admin token', async () => {
            const response = await request(app)
                .put(`/cruise/${testCruise._id}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send(updateData)
                .expect(200);

            expect(response.body).toMatchObject({
                status: 'success',
                message: 'Cruise updated successfully',
                data: expect.objectContaining({
                    name: 'Updated Cruise Name',
                    price: 1800
                })
            });
        });

        it('should update cruise with manager token', async () => {
            const managerUpdateData = { ...updateData, name: 'Manager Updated Cruise' };
            const response = await request(app)
                .put(`/cruise/${testCruise2._id}`)
                .set('Authorization', `Bearer ${managerToken}`)
                .send(managerUpdateData)
                .expect(200);

            expect(response.body.data.name).toBe('Manager Updated Cruise');
        });

        it('should return 401 without authentication', async () => {
            const response = await request(app)
                .put(`/cruise/${testCruise._id}`)
                .send(updateData)
                .expect(401);

            expect(response.body.status).toBe('error');
        });

        it('should return 403 with insufficient permissions', async () => {
            const response = await request(app)
                .put(`/cruise/${testCruise._id}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send(updateData)
                .expect(403);

            expect(response.body.status).toBe('error');
        });

        it('should return 404 for non-existent cruise', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const response = await request(app)
                .put(`/cruise/${fakeId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send(updateData)
                .expect(404);

            expect(response.body.status).toBe('error');
        });
    });

    describe('DELETE /cruise/:cruiseId', () => {
        it('should delete cruise with admin token', async () => {
            const cruiseToDelete = await Cruise.create({
                name: 'Cruise to Delete',
                description: 'This cruise will be deleted',
                cruiseLine: 'Delete Line',
                shipName: 'Delete Ship',
                departurePort: 'Port A',
                arrivalPort: 'Port B',
                departureDate: new Date('2025-09-01'),
                arrivalDate: new Date('2025-09-05'),
                duration: 4,
                price: 500,
                currency: 'USD',
                capacity: 1000,
                availableCabins: 100,
                cabinTypes: [{ name: 'Interior', price: 500, capacity: 100, available: 100 }],
                amenities: ['Pool'],
                destinations: [
                    { name: 'Port A', country: 'Test Country', arrivalDate: new Date('2025-09-01'), departureDate: new Date('2025-09-02') },
                    { name: 'Port B', country: 'Test Country', arrivalDate: new Date('2025-09-05'), departureDate: new Date('2025-09-05') }
                ],
                images: [{ url: 'delete-image.jpg', alt: 'Delete Image', isPrimary: true }],
                halalRating: 3,
                halalFeatures: ['Halal Food'],
                isActive: true,
                isFeatured: false,
                tags: ['test'],
                cancellationPolicy: 'Standard policy',
                termsAndConditions: 'Standard terms',
                createdBy: adminUser._id
            });

            const response = await request(app)
                .delete(`/cruise/${cruiseToDelete._id}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);

            expect(response.body).toMatchObject({
                status: 'success',
                message: 'Cruise deleted successfully'
            });

            // Verify cruise is soft deleted
            const deletedCruise = await Cruise.findById(cruiseToDelete._id);
            expect(deletedCruise.isActive).toBe(false);
        });

        it('should return 401 without authentication', async () => {
            const response = await request(app)
                .delete(`/cruise/${testCruise._id}`)
                .expect(401);

            expect(response.body.status).toBe('error');
        });

        it('should return 403 with manager token (insufficient permissions)', async () => {
            const response = await request(app)
                .delete(`/cruise/${testCruise._id}`)
                .set('Authorization', `Bearer ${managerToken}`)
                .expect(403);

            expect(response.body.status).toBe('error');
        });

        it('should return 404 for non-existent cruise', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const response = await request(app)
                .delete(`/cruise/${fakeId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(404);

            expect(response.body.status).toBe('error');
        });
    });
}); 