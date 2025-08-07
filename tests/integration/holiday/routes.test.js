const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../../src/app');
const User = require('../../../src/models/User');
const Holiday = require('../../../src/models/Holiday');
const { generateAccessToken } = require('../../../src/auth/services/authService');
const { USER_ROLES, PERMISSIONS, SERVICES } = require('../../../src/utils/constants');

describe('Holiday Routes Integration Tests', () => {
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

        // Create test holiday packages with future dates
        testHoliday = await Holiday.create({
            name: 'Test Holiday Package 1',
            description: 'A wonderful test holiday package',
            destination: {
                name: 'Dubai',
                country: 'UAE',
                city: 'Dubai',
                coordinates: { latitude: 25.2048, longitude: 55.2708 }
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
                name: 'Test Hotel',
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
                            airport: 'DXB',
                            time: '10:00',
                            airline: 'Emirates',
                            flightNumber: 'EK123'
                        },
                        return: {
                            airport: 'DXB',
                            time: '22:00',
                            airline: 'Emirates',
                            flightNumber: 'EK124'
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
                    name: 'Desert Safari',
                    description: 'Experience the magic of the desert',
                    duration: 6,
                    included: true,
                    price: 0
                }
            ],
            itinerary: [
                {
                    day: 1,
                    title: 'Arrival in Dubai',
                    description: 'Welcome to the city of gold',
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
                notes: 'All meals are halal certified'
            },
            images: [
                {
                    url: 'https://example.com/test-image1.jpg',
                    alt: 'Test Image 1',
                    isPrimary: true,
                    caption: 'Test Holiday Package 1'
                }
            ],
            documents: [
                {
                    name: 'Test Document',
                    url: 'test-doc.pdf',
                    type: 'other',
                    size: 1024
                }
            ],
            status: 'active',
            isFeatured: true,
            tags: ['test', 'dubai'],
            cancellationPolicy: 'Standard cancellation policy',
            termsAndConditions: 'Standard terms and conditions',
            contactInfo: {
                phone: '+1-555-0123',
                email: 'test@testholiday.com',
                website: 'https://testholiday.com'
            },
            createdBy: adminUser._id
        });

        testHoliday2 = await Holiday.create({
            name: 'Test Holiday Package 2',
            description: 'Another wonderful test holiday package',
            destination: {
                name: 'Maldives',
                country: 'Maldives',
                city: 'Male',
                coordinates: { latitude: 3.2028, longitude: 73.2207 }
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
                name: 'Test Resort',
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
                    name: 'Snorkeling',
                    description: 'Explore the underwater world',
                    duration: 3,
                    included: true,
                    price: 0
                }
            ],
            itinerary: [
                {
                    day: 1,
                    title: 'Arrival in Maldives',
                    description: 'Welcome to paradise',
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
                notes: 'Premium halal experience'
            },
            images: [
                {
                    url: 'https://example.com/test-image2.jpg',
                    alt: 'Test Image 2',
                    isPrimary: true,
                    caption: 'Test Holiday Package 2'
                }
            ],
            documents: [
                {
                    name: 'Test Document 2',
                    url: 'test-doc2.pdf',
                    type: 'other',
                    size: 512
                }
            ],
            status: 'active',
            isFeatured: false,
            tags: ['test', 'maldives'],
            cancellationPolicy: 'Premium cancellation policy',
            termsAndConditions: 'Premium terms and conditions',
            contactInfo: {
                phone: '+1-555-9999',
                email: 'test2@testholiday.com',
                website: 'https://testholiday2.com'
            },
            createdBy: managerUser._id
        });
    });

    afterEach(async () => {
        await Holiday.deleteMany({});
        await User.deleteMany({});
    });

    describe('Authentication Test', () => {
        it('should authenticate with valid token', async () => {
            const response = await request(app)
                .get('/holiday')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);

            expect(response.body.status).toBe('success');
        });

        it('should create holiday with admin token', async () => {
            const newHolidayData = {
                name: 'Admin Test Holiday',
                description: 'A test holiday created by admin',
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
                    startDate: '2026-09-01',
                    endDate: '2026-09-06',
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
                    name: 'Admin Test Hotel',
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
                        name: 'Test Activity',
                        description: 'A test activity',
                        duration: 3,
                        included: true,
                        price: 0
                    }
                ],
                itinerary: [
                    {
                        day: 1,
                        title: 'Test Day',
                        description: 'Test day description',
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
                    notes: 'Test halal compliance'
                },
                images: [
                    {
                        url: 'https://example.com/admin-image.jpg',
                        alt: 'Admin Test Image',
                        isPrimary: true,
                        caption: 'Admin Test Holiday'
                    }
                ],
                documents: [
                    {
                        name: 'Test Document',
                        url: 'test-doc.pdf',
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
                }
            };

            const response = await request(app)
                .post('/holiday')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(newHolidayData)
                .expect(201);

            expect(response.body.status).toBe('success');
            expect(response.body.data.name).toBe('Admin Test Holiday');
        });
    });

    describe('GET /holiday/health', () => {
        it('should return health status', async () => {
            const response = await request(app)
                .get('/holiday/health')
                .expect(200);

            expect(response.body.status).toBe('success');
            expect(response.body.data.service).toBe('holiday');
            expect(response.body.data.status).toBe('healthy');
        });
    });

    describe('GET /holiday', () => {
        it('should get all holidays with pagination', async () => {
            const response = await request(app)
                .get('/holiday')
                .expect(200);

            expect(response.body.status).toBe('success');
            expect(response.body.data).toHaveLength(2);
            expect(response.body.pagination).toBeDefined();
            expect(response.body.pagination.pageSize).toBe(10);
            expect(response.body.pagination.total).toBe(2);
        });

        it('should filter holidays by price range', async () => {
            const response = await request(app)
                .get('/holiday?minPrice=1500&maxPrice=2500')
                .expect(200);

            expect(response.body.status).toBe('success');
            expect(response.body.data).toHaveLength(1);
            expect(response.body.data[0].pricing.basePrice).toBe(2000);
        });

        it('should filter holidays by destination', async () => {
            const response = await request(app)
                .get('/holiday?destination=Dubai')
                .expect(200);

            expect(response.body.status).toBe('success');
            expect(response.body.data).toHaveLength(1);
            expect(response.body.data[0].destination.city).toBe('Dubai');
        });

        it('should filter holidays by accommodation type', async () => {
            const response = await request(app)
                .get('/holiday?accommodationType=resort')
                .expect(200);

            expect(response.body.status).toBe('success');
            expect(response.body.data).toHaveLength(1);
            expect(response.body.data[0].accommodation.type).toBe('resort');
        });

        it('should filter holidays by board type', async () => {
            const response = await request(app)
                .get('/holiday?boardType=all_inclusive')
                .expect(200);

            expect(response.body.status).toBe('success');
            expect(response.body.data).toHaveLength(1);
            // Note: board type is not included in the summary response
        });

        it('should filter halal holidays only', async () => {
            const response = await request(app)
                .get('/holiday?halalOnly=true')
                .expect(200);

            expect(response.body.status).toBe('success');
            expect(response.body.data).toHaveLength(2);
            response.body.data.forEach(holiday => {
                expect(holiday.halalCompliance.isHalal).toBe(true);
            });
        });

        it('should filter featured holidays only', async () => {
            const response = await request(app)
                .get('/holiday?featuredOnly=true')
                .expect(200);

            expect(response.body.status).toBe('success');
            expect(response.body.data).toHaveLength(1);
            expect(response.body.data[0].isFeatured).toBe(true);
        });
    });

    describe('GET /holiday/featured', () => {
        it('should get featured holidays', async () => {
            const response = await request(app)
                .get('/holiday/featured')
                .expect(200);

            expect(response.body.status).toBe('success');
            expect(response.body.data).toHaveLength(1);
            expect(response.body.data[0].isFeatured).toBe(true);
        });
    });

    describe('GET /holiday/search/destination/:destination', () => {
        it('should search holidays by destination', async () => {
            const response = await request(app)
                .get('/holiday/search/destination/Dubai')
                .expect(200);

            expect(response.body.status).toBe('success');
            expect(response.body.data.holidays).toHaveLength(1);
            expect(response.body.data.searchTerm).toBe('Dubai');
        });

        it('should return empty array for non-existent destination', async () => {
            const response = await request(app)
                .get('/holiday/search/destination/NonExistent')
                .expect(200);

            expect(response.body.status).toBe('success');
            expect(response.body.data.holidays).toHaveLength(0);
        });
    });

    describe('GET /holiday/search/date-range', () => {
        it('should get holidays by date range', async () => {
            const response = await request(app)
                .get('/holiday/search/date-range?startDate=2026-11-01&endDate=2026-12-31')
                .expect(200);

            expect(response.body.status).toBe('success');
            expect(response.body.data.holidays).toHaveLength(2);
        });

        it('should return error for invalid date range', async () => {
            const response = await request(app)
                .get('/holiday/search/date-range?startDate=2025-12-31&endDate=2025-11-01')
                .expect(400);

            expect(response.body.status).toBe('error');
            expect(response.body.errorCode).toBe('INVALID_DATE_RANGE');
        });

        it('should return error for missing date parameters', async () => {
            const response = await request(app)
                .get('/holiday/search/date-range?startDate=2025-11-01')
                .expect(400);

            expect(response.body.status).toBe('error');
            expect(response.body.errorCode).toBe('MISSING_DATE_PARAMETERS');
        });
    });

    describe('GET /holiday/search/price-range', () => {
        it('should get holidays by price range', async () => {
            const response = await request(app)
                .get('/holiday/search/price-range?minPrice=1500&maxPrice=2500')
                .expect(200);

            expect(response.body.status).toBe('success');
            expect(response.body.data.holidays).toHaveLength(1);
            expect(response.body.data.minPrice).toBe(1500);
            expect(response.body.data.maxPrice).toBe(2500);
        });

        it('should return error for invalid price range', async () => {
            const response = await request(app)
                .get('/holiday/search/price-range?minPrice=2500&maxPrice=1500')
                .expect(400);

            expect(response.body.status).toBe('error');
            expect(response.body.errorCode).toBe('INVALID_PRICE_RANGE');
        });

        it('should return error for missing price parameters', async () => {
            const response = await request(app)
                .get('/holiday/search/price-range?minPrice=1500')
                .expect(400);

            expect(response.body.status).toBe('error');
            expect(response.body.errorCode).toBe('MISSING_PRICE_PARAMETERS');
        });
    });

    describe('GET /holiday/halal', () => {
        it('should get halal-rated holidays', async () => {
            const response = await request(app)
                .get('/holiday/halal')
                .expect(200);

            expect(response.body.status).toBe('success');
            expect(response.body.data.holidays).toHaveLength(2);
            response.body.data.holidays.forEach(holiday => {
                expect(holiday.halalCompliance.isHalal).toBe(true);
            });
        });

        it('should get halal holidays with minimum rating', async () => {
            const response = await request(app)
                .get('/holiday/halal?minRating=5')
                .expect(200);

            expect(response.body.status).toBe('success');
            expect(response.body.data.holidays).toHaveLength(1);
            expect(response.body.data.holidays[0].halalCompliance.rating).toBe(5);
        });
    });

    describe('GET /holiday/:holidayId', () => {
        it('should get holiday by ID', async () => {
            const response = await request(app)
                .get(`/holiday/${testHoliday._id}`)
                .expect(200);

            expect(response.body.status).toBe('success');
            expect(response.body.data.name).toBe('Test Holiday Package 1');
        });

        it('should return 404 for non-existent holiday', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const response = await request(app)
                .get(`/holiday/${fakeId}`)
                .expect(404);

            expect(response.body.status).toBe('error');
            expect(response.body.errorCode).toBe('HOLIDAY_NOT_FOUND');
        });

        it('should return 400 for invalid holiday ID', async () => {
            const response = await request(app)
                .get('/holiday/invalid-id')
                .expect(400);

            expect(response.body.status).toBe('error');
            expect(response.body.errorCode).toBe('INVALID_HOLIDAY_ID');
        });
    });

    describe('POST /holiday', () => {
        it('should create new holiday with admin token', async () => {
            const newHolidayData = {
                name: 'New Test Holiday',
                description: 'A new test holiday package',
                destination: {
                    name: 'New Destination',
                    country: 'Test Country',
                    city: 'Test City',
                    coordinates: { latitude: 0, longitude: 0 }
                },
                duration: {
                    days: 5,
                    nights: 4
                },
                dates: {
                    startDate: '2025-09-01',
                    endDate: '2025-09-06',
                    flexibleDates: false
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
                    name: 'New Test Hotel',
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
                        title: 'Arrival',
                        description: 'Welcome',
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
                        url: 'https://example.com/new-image.jpg',
                        alt: 'New Test Image',
                        isPrimary: true,
                        caption: 'New Test Holiday'
                    }
                ],
                documents: [],
                status: 'active',
                isFeatured: false,
                tags: ['new', 'test'],
                cancellationPolicy: 'New cancellation policy',
                termsAndConditions: 'New terms and conditions',
                contactInfo: {
                    phone: '+1-555-9999',
                    email: 'new@testholiday.com',
                    website: 'https://new-testholiday.com'
                }
            };

            const response = await request(app)
                .post('/holiday')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(newHolidayData)
                .expect(201);

            expect(response.body.status).toBe('success');
            expect(response.body.data.name).toBe('New Test Holiday');
        });

        it('should create new holiday with manager token', async () => {
            const newHolidayData = {
                name: 'Manager Test Holiday',
                description: 'A test holiday created by manager',
                destination: {
                    name: 'Manager Destination',
                    country: 'Test Country',
                    city: 'Test City',
                    coordinates: { latitude: 0, longitude: 0 }
                },
                duration: {
                    days: 3,
                    nights: 2
                },
                dates: {
                    startDate: '2026-08-01',
                    endDate: '2026-08-04',
                    flexibleDates: true
                },
                pricing: {
                    basePrice: 1200,
                    currency: 'USD',
                    discount: { percentage: 5, validUntil: '2026-07-31' },
                    taxes: 120,
                    fees: 30
                },
                accommodation: {
                    type: 'guesthouse',
                    name: 'Manager Test Guesthouse',
                    rating: 3,
                    amenities: ['WiFi'],
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
                        included: true,
                        type: 'public_transport'
                    }
                },
                activities: [],
                itinerary: [
                    {
                        day: 1,
                        title: 'Arrival',
                        description: 'Welcome',
                        activities: [],
                        meals: { breakfast: false, lunch: false, dinner: false }
                    }
                ],
                capacity: {
                    totalSeats: 15,
                    availableSeats: 15,
                    minGroupSize: 1,
                    maxGroupSize: 3
                },
                halalCompliance: {
                    isHalal: true,
                    rating: 3,
                    features: ['halal_food'],
                    certification: 'Basic Halal',
                    notes: 'Basic halal compliance'
                },
                images: [
                    {
                        url: 'https://example.com/manager-image.jpg',
                        alt: 'Manager Test Image',
                        isPrimary: true,
                        caption: 'Manager Test Holiday'
                    }
                ],
                documents: [],
                status: 'active',
                isFeatured: false,
                tags: ['manager', 'test'],
                cancellationPolicy: 'Manager cancellation policy',
                termsAndConditions: 'Manager terms and conditions',
                contactInfo: {
                    phone: '+1-555-8888',
                    email: 'manager@testholiday.com',
                    website: 'https://manager-testholiday.com'
                }
            };

            const response = await request(app)
                .post('/holiday')
                .set('Authorization', `Bearer ${managerToken}`)
                .send(newHolidayData)
                .expect(201);

            expect(response.body.status).toBe('success');
            expect(response.body.data.name).toBe('Manager Test Holiday');
        });

        it('should return 401 without authentication', async () => {
            const response = await request(app)
                .post('/holiday')
                .send({ name: 'Test Holiday' })
                .expect(401);

            expect(response.body.status).toBe('error');
            expect(response.body.errorCode).toBe('TOKEN_REQUIRED');
        });

        it('should return 403 with insufficient permissions', async () => {
            const response = await request(app)
                .post('/holiday')
                .set('Authorization', `Bearer ${userToken}`)
                .send({ name: 'Test Holiday' })
                .expect(403);

            expect(response.body.status).toBe('error');
            expect(response.body.errorCode).toBe('INSUFFICIENT_ROLE');
        });

        it('should return 400 for invalid data', async () => {
            const response = await request(app)
                .post('/holiday')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ name: '' })
                .expect(400);

            expect(response.body.status).toBe('error');
            expect(response.body.errorCode).toBe('VALIDATION_ERROR');
        });
    });

    describe('PUT /holiday/:holidayId', () => {
        it('should update holiday with admin token', async () => {
            const updateData = {
                name: 'Updated Test Holiday',
                description: 'Updated description',
                pricing: {
                    basePrice: 2500,
                    currency: 'USD',
                    discount: { percentage: 15, validUntil: '2025-10-31' },
                    taxes: 250,
                    fees: 75
                }
            };

            const response = await request(app)
                .put(`/holiday/${testHoliday._id}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send(updateData)
                .expect(200);

            expect(response.body.status).toBe('success');
            expect(response.body.data.name).toBe('Updated Test Holiday');
        });

        it('should update holiday with manager token', async () => {
            const updateData = {
                name: 'Manager Updated Holiday',
                description: 'Manager updated description',
                pricing: {
                    basePrice: 2800,
                    currency: 'USD',
                    discount: { percentage: 20, validUntil: '2025-10-31' },
                    taxes: 280,
                    fees: 80
                }
            };

            const response = await request(app)
                .put(`/holiday/${testHoliday2._id}`)
                .set('Authorization', `Bearer ${managerToken}`)
                .send(updateData)
                .expect(200);

            expect(response.body.status).toBe('success');
            expect(response.body.data.name).toBe('Manager Updated Holiday');
        });

        it('should return 401 without authentication', async () => {
            const response = await request(app)
                .put(`/holiday/${testHoliday._id}`)
                .send({ name: 'Updated Holiday' })
                .expect(401);

            expect(response.body.status).toBe('error');
            expect(response.body.errorCode).toBe('TOKEN_REQUIRED');
        });

        it('should return 403 with insufficient permissions', async () => {
            const response = await request(app)
                .put(`/holiday/${testHoliday._id}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({ name: 'Updated Holiday' })
                .expect(403);

            expect(response.body.status).toBe('error');
            expect(response.body.errorCode).toBe('INSUFFICIENT_ROLE');
        });

        it('should return 404 for non-existent holiday', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const response = await request(app)
                .put(`/holiday/${fakeId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ name: 'Updated Holiday' })
                .expect(404);

            expect(response.body.status).toBe('error');
            expect(response.body.errorCode).toBe('HOLIDAY_NOT_FOUND');
        });
    });

    describe('DELETE /holiday/:holidayId', () => {
        it('should delete holiday with admin token', async () => {
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
                .delete(`/holiday/${holidayToDelete._id}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);

            expect(response.body.status).toBe('success');
            expect(response.body.message).toBe('Holiday package deleted successfully');
        });

        it('should return 401 without authentication', async () => {
            const response = await request(app)
                .delete(`/holiday/${testHoliday._id}`)
                .expect(401);

            expect(response.body.status).toBe('error');
            expect(response.body.errorCode).toBe('TOKEN_REQUIRED');
        });

        it('should return 403 with manager token (insufficient permissions)', async () => {
            const response = await request(app)
                .delete(`/holiday/${testHoliday._id}`)
                .set('Authorization', `Bearer ${managerToken}`)
                .expect(403);

            expect(response.body.status).toBe('error');
            expect(response.body.errorCode).toBe('INSUFFICIENT_ROLE');
        });

        it('should return 404 for non-existent holiday', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const response = await request(app)
                .delete(`/holiday/${fakeId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(404);

            expect(response.body.status).toBe('error');
            expect(response.body.errorCode).toBe('HOLIDAY_NOT_FOUND');
        });
    });
}); 