const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../../src/app');
const User = require('../../../src/models/User');
const Holiday = require('../../../src/models/Holiday');
const { generateAccessToken } = require('../../../src/auth/services/authService');
const { USER_ROLES, PERMISSIONS, SERVICES } = require('../../../src/utils/constants');

describe('Admin Holiday Routes Integration Tests', () => {
    let testUser, adminUser, managerUser;
    let userToken, adminToken, managerToken;
    let testHoliday, testHoliday2;

    beforeEach(async () => {
        // Create test users in each test to ensure proper isolation
        testUser = await User.create({
            email: `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}@example.com`,
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
            permissions: [PERMISSIONS.MANAGE_HOLIDAY_SERVICES],
            allowedServices: [SERVICES.HOLIDAY]
        });

        managerUser = await User.create({
            email: `manager-${Date.now()}-${Math.random().toString(36).substr(2, 9)}@example.com`,
            password: 'ManagerPassword123!',
            firstName: 'Manager',
            lastName: 'User',
            role: USER_ROLES.MANAGER,
            permissions: [PERMISSIONS.MANAGE_HOLIDAY_SERVICES],
            allowedServices: [SERVICES.HOLIDAY]
        });

        // Generate tokens
        userToken = generateAccessToken(testUser);
        adminToken = generateAccessToken(adminUser);
        managerToken = generateAccessToken(managerUser);

        // Create test holiday packages
        testHoliday = await Holiday.create({
            name: 'Admin Test Holiday Package 1',
            description: 'A test holiday package for admin panel',
            destination: {
                name: 'Admin Destination',
                country: 'Test Country',
                city: 'Test City',
                coordinates: { latitude: 0, longitude: 0 }
            },
            duration: {
                days: 7,
                nights: 6
            },
            dates: {
                startDate: new Date('2026-12-01'),
                endDate: new Date('2026-12-08'),
                flexibleDates: false
            },
            pricing: {
                basePrice: 2000,
                currency: 'USD',
                discount: { percentage: 10, validUntil: new Date('2026-11-30') },
                taxes: 200,
                fees: 50
            },
            accommodation: {
                type: 'hotel',
                name: 'Admin Test Hotel',
                rating: 4,
                amenities: ['WiFi', 'Pool', 'Spa'],
                roomType: 'deluxe',
                board: 'half_board'
            },
            transportation: {
                flights: {
                    included: true,
                    details: {
                        departure: {
                            airport: 'TEST',
                            time: '10:00',
                            airline: 'Test Air',
                            flightNumber: 'TA123'
                        },
                        return: {
                            airport: 'TEST',
                            time: '22:00',
                            airline: 'Test Air',
                            flightNumber: 'TA124'
                        }
                    }
                },
                transfers: {
                    included: true,
                    type: 'private'
                },
                localTransport: {
                    included: false,
                    type: 'none'
                }
            },
            activities: [
                {
                    name: 'Admin Test Activity',
                    description: 'A test activity for admin panel',
                    duration: 4,
                    included: true,
                    price: 0
                }
            ],
            itinerary: [
                {
                    day: 1,
                    title: 'Admin Test Day',
                    description: 'Test day description for admin panel',
                    activities: [
                        { time: '14:00', activity: 'Hotel Check-in', location: 'Hotel', duration: '1 hour' }
                    ],
                    meals: { breakfast: false, lunch: false, dinner: true }
                }
            ],
            capacity: {
                totalSeats: 50,
                availableSeats: 30,
                minGroupSize: 2,
                maxGroupSize: 10
            },
            halalCompliance: {
                isHalal: true,
                rating: 4,
                features: ['halal_food', 'prayer_room'],
                certification: 'Halal Certified',
                notes: 'Admin test halal compliance'
            },
            images: [
                {
                    url: 'https://example.com/admin-image1.jpg',
                    alt: 'Admin Test Image 1',
                    isPrimary: true,
                    caption: 'Admin Test Holiday Package 1'
                }
            ],
            documents: [
                {
                    name: 'Admin Test Document',
                    url: 'admin-test-doc.pdf',
                    type: 'other',
                    size: 1024
                }
            ],
            status: 'active',
            isFeatured: true,
            tags: ['admin', 'test'],
            cancellationPolicy: 'Admin cancellation policy',
            termsAndConditions: 'Admin terms and conditions',
            contactInfo: {
                phone: '+1-555-0123',
                email: 'admin@testholiday.com',
                website: 'https://admin-testholiday.com'
            },
            createdBy: adminUser._id
        });

        testHoliday2 = await Holiday.create({
            name: 'Manager Test Holiday Package 2',
            description: 'Another test holiday package for admin panel',
            destination: {
                name: 'Manager Destination',
                country: 'Test Country',
                city: 'Test City',
                coordinates: { latitude: 0, longitude: 0 }
            },
            duration: {
                days: 5,
                nights: 4
            },
            dates: {
                startDate: new Date('2026-11-01'),
                endDate: new Date('2026-11-06'),
                flexibleDates: true
            },
            pricing: {
                basePrice: 3000,
                currency: 'USD',
                discount: { percentage: 0, validUntil: null },
                taxes: 300,
                fees: 100
            },
            accommodation: {
                type: 'resort',
                name: 'Manager Test Resort',
                rating: 5,
                amenities: ['WiFi', 'Pool', 'Beach Access'],
                roomType: 'suite',
                board: 'all_inclusive'
            },
            transportation: {
                flights: {
                    included: false,
                    details: {}
                },
                transfers: {
                    included: true,
                    type: 'private'
                },
                localTransport: {
                    included: true,
                    type: 'guided_tours'
                }
            },
            activities: [
                {
                    name: 'Manager Test Activity',
                    description: 'Another test activity for admin panel',
                    duration: 2,
                    included: true,
                    price: 0
                }
            ],
            itinerary: [
                {
                    day: 1,
                    title: 'Manager Test Day',
                    description: 'Another test day description for admin panel',
                    activities: [
                        { time: '12:00', activity: 'Resort Check-in', location: 'Resort', duration: '1 hour' }
                    ],
                    meals: { breakfast: false, lunch: true, dinner: true }
                }
            ],
            capacity: {
                totalSeats: 30,
                availableSeats: 20,
                minGroupSize: 1,
                maxGroupSize: 6
            },
            halalCompliance: {
                isHalal: true,
                rating: 5,
                features: ['halal_food', 'prayer_room', 'qibla_direction'],
                certification: 'Halal Certified Premium',
                notes: 'Manager test halal compliance'
            },
            images: [
                {
                    url: 'https://example.com/manager-image2.jpg',
                    alt: 'Manager Test Image 2',
                    isPrimary: true,
                    caption: 'Manager Test Holiday Package 2'
                }
            ],
            documents: [
                {
                    name: 'Manager Test Document',
                    url: 'manager-test-doc.pdf',
                    type: 'other',
                    size: 512
                }
            ],
            status: 'draft',
            isFeatured: false,
            tags: ['manager', 'test'],
            cancellationPolicy: 'Manager cancellation policy',
            termsAndConditions: 'Manager terms and conditions',
            contactInfo: {
                phone: '+1-555-9999',
                email: 'manager@testholiday.com',
                website: 'https://manager-testholiday.com'
            },
            createdBy: managerUser._id
        });
    });

    afterEach(async () => {
        await Holiday.deleteMany({});
        await User.deleteMany({});
    });

    describe('POST /holiday/admin', () => {
        it('should create new holiday package with admin token', async () => {
            const newHolidayData = {
                name: 'Admin Created Holiday',
                description: 'A holiday package created by admin',
                destination: {
                    name: 'Admin Created Destination',
                    country: 'Test Country',
                    city: 'Test City',
                    coordinates: { latitude: 0, longitude: 0 }
                },
                duration: {
                    days: 7,
                    nights: 6
                },
                dates: {
                    startDate: '2026-10-01',
                    endDate: '2026-10-08',
                    flexibleDates: false
                },
                pricing: {
                    basePrice: 2500,
                    currency: 'USD',
                    discount: { percentage: 15, validUntil: '2026-09-30' },
                    taxes: 250,
                    fees: 75
                },
                accommodation: {
                    type: 'hotel',
                    name: 'Admin Created Hotel',
                    rating: 4,
                    amenities: ['WiFi', 'Pool'],
                    roomType: 'deluxe',
                    board: 'full_board'
                },
                transportation: {
                    flights: {
                        included: true,
                        details: {
                            departure: {
                                airport: 'TEST',
                                time: '09:00',
                                airline: 'Test Air',
                                flightNumber: 'TA123'
                            },
                            return: {
                                airport: 'TEST',
                                time: '21:00',
                                airline: 'Test Air',
                                flightNumber: 'TA124'
                            }
                        }
                    },
                    transfers: {
                        included: true,
                        type: 'private'
                    },
                    localTransport: {
                        included: false,
                        type: 'none'
                    }
                },
                activities: [
                    {
                        name: 'Admin Created Activity',
                        description: 'A test activity created by admin',
                        duration: 3,
                        included: true,
                        price: 0
                    }
                ],
                itinerary: [
                    {
                        day: 1,
                        title: 'Admin Created Day',
                        description: 'Test day description created by admin',
                        activities: [
                            { time: '10:00', activity: 'Test Activity', location: 'Test Location', duration: '2 hours' }
                        ],
                        meals: { breakfast: true, lunch: true, dinner: true }
                    }
                ],
                capacity: {
                    totalSeats: 40,
                    availableSeats: 40,
                    minGroupSize: 2,
                    maxGroupSize: 8
                },
                halalCompliance: {
                    isHalal: true,
                    rating: 4,
                    features: ['halal_food', 'prayer_room'],
                    certification: 'Halal Certified',
                    notes: 'Admin created halal compliance'
                },
                images: [
                    {
                        url: 'https://example.com/admin-created-image.jpg',
                        alt: 'Admin Created Image',
                        isPrimary: true,
                        caption: 'Admin Created Holiday'
                    }
                ],
                documents: [
                    {
                        name: 'Admin Created Document',
                        url: 'admin-created-doc.pdf',
                        type: 'other',
                        size: 1024
                    }
                ],
                status: 'active',
                isFeatured: true,
                tags: ['admin', 'created'],
                cancellationPolicy: 'Admin created cancellation policy',
                termsAndConditions: 'Admin created terms and conditions',
                contactInfo: {
                    phone: '+1-555-0123',
                    email: 'admin-created@testholiday.com',
                    website: 'https://admin-created-testholiday.com'
                }
            };

            const response = await request(app)
                .post('/holiday/admin')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(newHolidayData)
                .expect(201);

            expect(response.body.status).toBe('success');
            expect(response.body.data.name).toBe('Admin Created Holiday');
        });

        it('should create new holiday package with manager token', async () => {
            const newHolidayData = {
                name: 'Manager Created Holiday',
                description: 'A holiday package created by manager',
                destination: {
                    name: 'Manager Created Destination',
                    country: 'Test Country',
                    city: 'Test City',
                    coordinates: { latitude: 0, longitude: 0 }
                },
                duration: {
                    days: 5,
                    nights: 4
                },
                dates: {
                    startDate: '2026-09-01',
                    endDate: '2026-09-06',
                    flexibleDates: true
                },
                pricing: {
                    basePrice: 1800,
                    currency: 'USD',
                    discount: { percentage: 0, validUntil: null },
                    taxes: 180,
                    fees: 50
                },
                accommodation: {
                    type: 'hotel',
                    name: 'Manager Created Hotel',
                    rating: 3,
                    amenities: ['WiFi'],
                    roomType: 'standard',
                    board: 'bed_and_breakfast'
                },
                transportation: {
                    flights: {
                        included: false,
                        details: {}
                    },
                    transfers: {
                        included: true,
                        type: 'shared'
                    },
                    localTransport: {
                        included: false,
                        type: 'none'
                    }
                },
                activities: [],
                itinerary: [
                    {
                        day: 1,
                        title: 'Manager Created Day',
                        description: 'Test day description created by manager',
                        activities: [],
                        meals: { breakfast: true, lunch: false, dinner: false }
                    }
                ],
                capacity: {
                    totalSeats: 20,
                    availableSeats: 20,
                    minGroupSize: 1,
                    maxGroupSize: 4
                },
                halalCompliance: {
                    isHalal: false,
                    rating: 1,
                    features: [],
                    certification: '',
                    notes: ''
                },
                images: [
                    {
                        url: 'https://example.com/manager-created-image.jpg',
                        alt: 'Manager Created Image',
                        isPrimary: true,
                        caption: 'Manager Created Holiday'
                    }
                ],
                documents: [],
                status: 'active',
                isFeatured: false,
                tags: ['manager', 'created'],
                cancellationPolicy: 'Manager created cancellation policy',
                termsAndConditions: 'Manager created terms and conditions',
                contactInfo: {
                    phone: '+1-555-9999',
                    email: 'manager-created@testholiday.com',
                    website: 'https://manager-created-testholiday.com'
                }
            };

            const response = await request(app)
                .post('/holiday/admin')
                .set('Authorization', `Bearer ${managerToken}`)
                .send(newHolidayData)
                .expect(201);

            expect(response.body.status).toBe('success');
            expect(response.body.data.name).toBe('Manager Created Holiday');
        });

        it('should return 401 without authentication', async () => {
            const response = await request(app)
                .post('/holiday/admin')
                .send({ name: 'Test Holiday' })
                .expect(401);

            expect(response.body.status).toBe('error');
            expect(response.body.errorCode).toBe('TOKEN_REQUIRED');
        });

        it('should return 403 with insufficient permissions', async () => {
            const response = await request(app)
                .post('/holiday/admin')
                .set('Authorization', `Bearer ${userToken}`)
                .send({ name: 'Test Holiday' })
                .expect(403);

            expect(response.body.status).toBe('error');
            expect(response.body.errorCode).toBe('INSUFFICIENT_ROLE');
        });
    });

    describe('GET /holiday/admin', () => {
        it('should get all holiday packages with admin token', async () => {
            const response = await request(app)
                .get('/holiday/admin')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);

            expect(response.body.status).toBe('success');
            expect(response.body.data).toHaveLength(1);
            expect(response.body.pagination).toBeDefined();
        });

        it('should get all holiday packages with manager token', async () => {
            const response = await request(app)
                .get('/holiday/admin')
                .set('Authorization', `Bearer ${managerToken}`)
                .expect(200);

            expect(response.body.status).toBe('success');
            expect(response.body.data).toHaveLength(1);
            expect(response.body.pagination).toBeDefined();
        });

        it('should filter by status', async () => {
            const response = await request(app)
                .get('/holiday/admin?status=draft')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);

            expect(response.body.status).toBe('success');
            expect(response.body.data).toHaveLength(1);
            expect(response.body.data[0].status).toBe('draft');
        });

        it('should filter by featured status', async () => {
            const response = await request(app)
                .get('/holiday/admin?isFeatured=true')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);

            expect(response.body.status).toBe('success');
            expect(response.body.data).toHaveLength(1);
            expect(response.body.data[0].isFeatured).toBe(true);
        });

        it('should return 401 without authentication', async () => {
            const response = await request(app)
                .get('/holiday/admin')
                .expect(401);

            expect(response.body.status).toBe('error');
            expect(response.body.errorCode).toBe('TOKEN_REQUIRED');
        });
    });

    describe('GET /holiday/admin/search/:holidayId', () => {
        it('should search holiday package by ID with admin token', async () => {
            const response = await request(app)
                .get(`/holiday/admin/search/${testHoliday._id}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);

            expect(response.body.status).toBe('success');
            expect(response.body.data.name).toBe('Admin Test Holiday Package 1');
        });

        it('should search holiday package by ID with manager token', async () => {
            const response = await request(app)
                .get(`/holiday/admin/search/${testHoliday2._id}`)
                .set('Authorization', `Bearer ${managerToken}`)
                .expect(200);

            expect(response.body.status).toBe('success');
            expect(response.body.data.name).toBe('Manager Test Holiday Package 2');
        });

        it('should return 404 for non-existent holiday', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const response = await request(app)
                .get(`/holiday/admin/search/${fakeId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(404);

            expect(response.body.status).toBe('error');
            expect(response.body.errorCode).toBe('HOLIDAY_PACKAGE_NOT_FOUND');
        });

        it('should return 401 without authentication', async () => {
            const response = await request(app)
                .get(`/holiday/admin/search/${testHoliday._id}`)
                .expect(401);

            expect(response.body.status).toBe('error');
            expect(response.body.errorCode).toBe('TOKEN_REQUIRED');
        });
    });

    describe('GET /holiday/admin/statistics', () => {
        it('should get holiday statistics with admin token', async () => {
            const response = await request(app)
                .get('/holiday/admin/statistics')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);

            expect(response.body.status).toBe('success');
            expect(response.body.data).toHaveProperty('total');
            expect(response.body.data).toHaveProperty('active');
            expect(response.body.data).toHaveProperty('featured');
            expect(response.body.data).toHaveProperty('halal');
            expect(response.body.data).toHaveProperty('recentPackages');
        });

        it('should get holiday statistics with manager token', async () => {
            const response = await request(app)
                .get('/holiday/admin/statistics')
                .set('Authorization', `Bearer ${managerToken}`)
                .expect(200);

            expect(response.body.status).toBe('success');
            expect(response.body.data).toHaveProperty('total');
            expect(response.body.data).toHaveProperty('active');
            expect(response.body.data).toHaveProperty('featured');
            expect(response.body.data).toHaveProperty('halal');
            expect(response.body.data).toHaveProperty('recentPackages');
        });

        it('should return 401 without authentication', async () => {
            const response = await request(app)
                .get('/holiday/admin/statistics')
                .expect(401);

            expect(response.body.status).toBe('error');
            expect(response.body.errorCode).toBe('TOKEN_REQUIRED');
        });
    });

    describe('PUT /holiday/admin/:holidayId', () => {
        it('should update holiday package with admin token', async () => {
            const updateData = {
                name: 'Admin Updated Holiday',
                description: 'Updated description by admin',
                pricing: {
                    basePrice: 2800,
                    currency: 'USD',
                    discount: { percentage: 20, validUntil: '2026-10-31' },
                    taxes: 280,
                    fees: 80
                }
            };

            const response = await request(app)
                .put(`/holiday/admin/${testHoliday._id}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send(updateData)
                .expect(200);

            expect(response.body.status).toBe('success');
            expect(response.body.data.name).toBe('Admin Updated Holiday');
        });

        it('should update holiday package with manager token', async () => {
            const updateData = {
                name: 'Manager Updated Holiday',
                description: 'Updated description by manager',
                pricing: {
                    basePrice: 3200,
                    currency: 'USD',
                    discount: { percentage: 25, validUntil: '2026-10-31' },
                    taxes: 320,
                    fees: 90
                }
            };

            const response = await request(app)
                .put(`/holiday/admin/${testHoliday2._id}`)
                .set('Authorization', `Bearer ${managerToken}`)
                .send(updateData)
                .expect(200);

            expect(response.body.status).toBe('success');
            expect(response.body.data.name).toBe('Manager Updated Holiday');
        });

        it('should return 404 for non-existent holiday', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const response = await request(app)
                .put(`/holiday/admin/${fakeId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ name: 'Updated Holiday' })
                .expect(404);

            expect(response.body.status).toBe('error');
            expect(response.body.errorCode).toBe('HOLIDAY_PACKAGE_NOT_FOUND');
        });

        it('should return 401 without authentication', async () => {
            const response = await request(app)
                .put(`/holiday/admin/${testHoliday._id}`)
                .send({ name: 'Updated Holiday' })
                .expect(401);

            expect(response.body.status).toBe('error');
            expect(response.body.errorCode).toBe('TOKEN_REQUIRED');
        });
    });

    describe('PUT /holiday/admin/bulk/status', () => {
        it('should bulk update holiday status with admin token', async () => {
            const updateData = {
                holidayIds: [testHoliday._id.toString(), testHoliday2._id.toString()],
                status: 'inactive'
            };

            const response = await request(app)
                .put('/holiday/admin/bulk/status')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(updateData)
                .expect(200);

            expect(response.body.status).toBe('success');
            expect(response.body.data.modifiedCount).toBe(2);
        });

        it('should bulk update holiday status with manager token', async () => {
            const updateData = {
                holidayIds: [testHoliday._id.toString()],
                status: 'active'
            };

            const response = await request(app)
                .put('/holiday/admin/bulk/status')
                .set('Authorization', `Bearer ${managerToken}`)
                .send(updateData)
                .expect(200);

            expect(response.body.status).toBe('success');
            expect(response.body.data.modifiedCount).toBe(1);
        });

        it('should return 400 for missing holiday IDs', async () => {
            const response = await request(app)
                .put('/holiday/admin/bulk/status')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ status: 'active' })
                .expect(400);

            expect(response.body.status).toBe('error');
            expect(response.body.errorCode).toBe('MISSING_HOLIDAY_IDS');
        });

        it('should return 400 for invalid status', async () => {
            const response = await request(app)
                .put('/holiday/admin/bulk/status')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    holidayIds: [testHoliday._id.toString()],
                    status: 'invalid_status'
                })
                .expect(400);

            expect(response.body.status).toBe('error');
            expect(response.body.errorCode).toBe('INVALID_STATUS');
        });

        it('should return 401 without authentication', async () => {
            const response = await request(app)
                .put('/holiday/admin/bulk/status')
                .send({
                    holidayIds: [testHoliday._id.toString()],
                    status: 'active'
                })
                .expect(401);

            expect(response.body.status).toBe('error');
            expect(response.body.errorCode).toBe('TOKEN_REQUIRED');
        });
    });

    describe('DELETE /holiday/admin/:holidayId', () => {
        it('should delete holiday package with admin token', async () => {
            const holidayToDelete = await Holiday.create({
                name: 'Holiday to Delete',
                description: 'This holiday will be deleted',
                destination: {
                    name: 'Delete Destination',
                    country: 'Test Country',
                    city: 'Test City',
                    coordinates: { latitude: 0, longitude: 0 }
                },
                duration: {
                    days: 1,
                    nights: 0
                },
                dates: {
                    startDate: new Date('2026-07-01'),
                    endDate: new Date('2026-07-02'),
                    flexibleDates: false
                },
                pricing: {
                    basePrice: 100,
                    currency: 'USD',
                    discount: { percentage: 0, validUntil: null },
                    taxes: 10,
                    fees: 5
                },
                accommodation: {
                    type: 'hotel',
                    name: 'Delete Hotel',
                    rating: 1,
                    amenities: [],
                    roomType: 'standard',
                    board: 'room_only'
                },
                transportation: {
                    flights: {
                        included: false,
                        details: {}
                    },
                    transfers: {
                        included: false,
                        type: 'public'
                    },
                    localTransport: {
                        included: false,
                        type: 'none'
                    }
                },
                activities: [],
                itinerary: [
                    {
                        day: 1,
                        title: 'Delete Day',
                        description: 'Delete description',
                        activities: [],
                        meals: { breakfast: false, lunch: false, dinner: false }
                    }
                ],
                capacity: {
                    totalSeats: 5,
                    availableSeats: 5,
                    minGroupSize: 1,
                    maxGroupSize: 2
                },
                halalCompliance: {
                    isHalal: false,
                    rating: 1,
                    features: [],
                    certification: '',
                    notes: ''
                },
                images: [],
                documents: [],
                status: 'active',
                isFeatured: false,
                tags: ['delete', 'test'],
                cancellationPolicy: 'Delete cancellation policy',
                termsAndConditions: 'Delete terms and conditions',
                contactInfo: {
                    phone: '+1-555-0000',
                    email: 'delete@testholiday.com',
                    website: 'https://delete-testholiday.com'
                },
                createdBy: adminUser._id
            });

            const response = await request(app)
                .delete(`/holiday/admin/${holidayToDelete._id}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);

            expect(response.body.status).toBe('success');
            expect(response.body.message).toBe('Holiday package deleted successfully');
        });

        it('should return 404 for non-existent holiday', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const response = await request(app)
                .delete(`/holiday/admin/${fakeId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(404);

            expect(response.body.status).toBe('error');
            expect(response.body.errorCode).toBe('HOLIDAY_PACKAGE_NOT_FOUND');
        });

        it('should return 401 without authentication', async () => {
            const response = await request(app)
                .delete(`/holiday/admin/${testHoliday._id}`)
                .expect(401);

            expect(response.body.status).toBe('error');
            expect(response.body.errorCode).toBe('TOKEN_REQUIRED');
        });

        it('should return 403 with manager token (insufficient permissions)', async () => {
            const response = await request(app)
                .delete(`/holiday/admin/${testHoliday._id}`)
                .set('Authorization', `Bearer ${managerToken}`)
                .expect(403);

            expect(response.body.status).toBe('error');
            expect(response.body.errorCode).toBe('INSUFFICIENT_ROLE');
        });
    });

    describe('DELETE /holiday/admin/bulk', () => {
        it('should bulk delete holiday packages with admin token', async () => {
            const holidayToDelete1 = await Holiday.create({
                name: 'Bulk Delete Holiday 1',
                description: 'This holiday will be bulk deleted',
                destination: {
                    name: 'Bulk Delete Destination 1',
                    country: 'Test Country',
                    city: 'Test City',
                    coordinates: { latitude: 0, longitude: 0 }
                },
                duration: {
                    days: 1,
                    nights: 0
                },
                dates: {
                    startDate: new Date('2026-08-01'),
                    endDate: new Date('2026-08-02'),
                    flexibleDates: false
                },
                pricing: {
                    basePrice: 100,
                    currency: 'USD',
                    discount: { percentage: 0, validUntil: null },
                    taxes: 10,
                    fees: 5
                },
                accommodation: {
                    type: 'hotel',
                    name: 'Bulk Delete Hotel 1',
                    rating: 1,
                    amenities: [],
                    roomType: 'standard',
                    board: 'room_only'
                },
                transportation: {
                    flights: {
                        included: false,
                        details: {}
                    },
                    transfers: {
                        included: false,
                        type: 'public'
                    },
                    localTransport: {
                        included: false,
                        type: 'none'
                    }
                },
                activities: [],
                itinerary: [
                    {
                        day: 1,
                        title: 'Bulk Delete Day 1',
                        description: 'Bulk delete description 1',
                        activities: [],
                        meals: { breakfast: false, lunch: false, dinner: false }
                    }
                ],
                capacity: {
                    totalSeats: 5,
                    availableSeats: 5,
                    minGroupSize: 1,
                    maxGroupSize: 2
                },
                halalCompliance: {
                    isHalal: false,
                    rating: 1,
                    features: [],
                    certification: '',
                    notes: ''
                },
                images: [],
                documents: [],
                status: 'active',
                isFeatured: false,
                tags: ['bulk', 'delete', 'test'],
                cancellationPolicy: 'Bulk delete cancellation policy 1',
                termsAndConditions: 'Bulk delete terms and conditions 1',
                contactInfo: {
                    phone: '+1-555-0001',
                    email: 'bulk-delete1@testholiday.com',
                    website: 'https://bulk-delete1-testholiday.com'
                },
                createdBy: adminUser._id
            });

            const holidayToDelete2 = await Holiday.create({
                name: 'Bulk Delete Holiday 2',
                description: 'This holiday will also be bulk deleted',
                destination: {
                    name: 'Bulk Delete Destination 2',
                    country: 'Test Country',
                    city: 'Test City',
                    coordinates: { latitude: 0, longitude: 0 }
                },
                duration: {
                    days: 1,
                    nights: 0
                },
                dates: {
                    startDate: new Date('2026-08-03'),
                    endDate: new Date('2026-08-04'),
                    flexibleDates: false
                },
                pricing: {
                    basePrice: 100,
                    currency: 'USD',
                    discount: { percentage: 0, validUntil: null },
                    taxes: 10,
                    fees: 5
                },
                accommodation: {
                    type: 'hotel',
                    name: 'Bulk Delete Hotel 2',
                    rating: 1,
                    amenities: [],
                    roomType: 'standard',
                    board: 'room_only'
                },
                transportation: {
                    flights: {
                        included: false,
                        details: {}
                    },
                    transfers: {
                        included: false,
                        type: 'public'
                    },
                    localTransport: {
                        included: false,
                        type: 'none'
                    }
                },
                activities: [],
                itinerary: [
                    {
                        day: 1,
                        title: 'Bulk Delete Day 2',
                        description: 'Bulk delete description 2',
                        activities: [],
                        meals: { breakfast: false, lunch: false, dinner: false }
                    }
                ],
                capacity: {
                    totalSeats: 5,
                    availableSeats: 5,
                    minGroupSize: 1,
                    maxGroupSize: 2
                },
                halalCompliance: {
                    isHalal: false,
                    rating: 1,
                    features: [],
                    certification: '',
                    notes: ''
                },
                images: [],
                documents: [],
                status: 'active',
                isFeatured: false,
                tags: ['bulk', 'delete', 'test'],
                cancellationPolicy: 'Bulk delete cancellation policy 2',
                termsAndConditions: 'Bulk delete terms and conditions 2',
                contactInfo: {
                    phone: '+1-555-0002',
                    email: 'bulk-delete2@testholiday.com',
                    website: 'https://bulk-delete2-testholiday.com'
                },
                createdBy: adminUser._id
            });

            const response = await request(app)
                .delete('/holiday/admin/bulk')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    holidayIds: [holidayToDelete1._id.toString(), holidayToDelete2._id.toString()]
                })
                .expect(200);

            expect(response.body.status).toBe('success');
            expect(response.body.data.deletedCount).toBe(2);
        });

        it('should return 400 for missing holiday IDs', async () => {
            const response = await request(app)
                .delete('/holiday/admin/bulk')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({})
                .expect(400);

            expect(response.body.status).toBe('error');
            expect(response.body.errorCode).toBe('MISSING_HOLIDAY_IDS');
        });

        it('should return 401 without authentication', async () => {
            const response = await request(app)
                .delete('/holiday/admin/bulk')
                .send({
                    holidayIds: [testHoliday._id.toString()]
                })
                .expect(401);

            expect(response.body.status).toBe('error');
            expect(response.body.errorCode).toBe('TOKEN_REQUIRED');
        });

        it('should return 403 with manager token (insufficient permissions)', async () => {
            const response = await request(app)
                .delete('/holiday/admin/bulk')
                .set('Authorization', `Bearer ${managerToken}`)
                .send({
                    holidayIds: [testHoliday._id.toString()]
                })
                .expect(403);

            expect(response.body.status).toBe('error');
            expect(response.body.errorCode).toBe('INSUFFICIENT_ROLE');
        });
    });
}); 