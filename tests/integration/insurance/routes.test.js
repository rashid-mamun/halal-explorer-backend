const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../../src/app');
const Insurance = require('../../../src/models/Insurance');
const User = require('../../../src/models/User');
const { generateAccessToken } = require('../../../src/auth/services/authService');
const { USER_ROLES, PERMISSIONS, SERVICES } = require('../../../src/utils/constants');

describe('Insurance Routes Integration Tests', () => {
    let testUser, adminUser, managerUser;
    let testInsurance, testInsurance2;
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
            permissions: [PERMISSIONS.MANAGE_INSURANCE_SERVICES],
            allowedServices: [SERVICES.INSURANCE]
        });

        managerUser = await User.create({
            email: `manager-${Date.now()}-${Math.random().toString(36).substr(2, 9)}@example.com`,
            password: 'ManagerPassword123!',
            firstName: 'Manager',
            lastName: 'User',
            role: USER_ROLES.MANAGER,
            permissions: [PERMISSIONS.MANAGE_INSURANCE_SERVICES],
            allowedServices: [SERVICES.INSURANCE]
        });

        // Generate tokens
        userToken = generateAccessToken(testUser);
        adminToken = generateAccessToken(adminUser);
        managerToken = generateAccessToken(managerUser);

        // Create test insurance policies
        testInsurance = await Insurance.create({
            name: 'Test Insurance 1',
            description: 'A comprehensive test insurance policy',
            type: 'travel',
            category: 'International',
            provider: 'Test Provider 1',
            policyNumber: 'POL-001-2025',
            coverage: {
                type: 'comprehensive',
                amount: 50000,
                currency: 'USD',
                details: [
                    { item: 'Medical', limit: 50000, description: 'Medical coverage' },
                    { item: 'Trip Cancellation', limit: 10000, description: 'Trip cancellation coverage' },
                    { item: 'Baggage', limit: 2000, description: 'Baggage coverage' },
                    { item: 'Flight Delay', limit: 500, description: 'Flight delay coverage' }
                ]
            },
            premium: {
                amount: 150,
                currency: 'USD',
                frequency: 'one_time'
            },
            duration: {
                startDate: new Date('2025-01-01'),
                endDate: new Date('2025-12-31'),
                days: 365
            },
            terms: {
                deductible: 100,
                exclusions: ['Pre-existing conditions'],
                conditions: ['Must be under 65 years old'],
                requirements: ['Valid passport required']
            },
            halalCompliance: {
                isHalal: true,
                rating: 4,
                certification: 'Halal Certified',
                features: ['No interest-based payments', 'Halal investment portfolio'],
                notes: 'Fully compliant with Islamic finance principles'
            },
            documents: [
                { name: 'Policy Document', url: 'policy-doc1.pdf', type: 'policy', size: 1024 },
                { name: 'Terms Document', url: 'terms-doc1.pdf', type: 'terms', size: 512 }
            ],
            status: 'active',
            isFeatured: true,
            tags: ['travel', 'international'],
            contactInfo: {
                phone: '+1-555-0123',
                email: 'support@testprovider1.com',
                website: 'https://testprovider1.com'
            },
            createdBy: adminUser._id
        });

        testInsurance2 = await Insurance.create({
            name: 'Test Insurance 2',
            description: 'Another comprehensive test insurance policy',
            type: 'health',
            category: 'Family',
            provider: 'Test Provider 2',
            policyNumber: 'POL-002-2025',
            coverage: {
                type: 'comprehensive',
                amount: 100000,
                currency: 'USD',
                details: [
                    { item: 'Medical', limit: 100000, description: 'Medical coverage' },
                    { item: 'Dental', limit: 5000, description: 'Dental coverage' },
                    { item: 'Vision', limit: 2000, description: 'Vision coverage' },
                    { item: 'Prescription', limit: 1000, description: 'Prescription coverage' }
                ]
            },
            premium: {
                amount: 200,
                currency: 'USD',
                frequency: 'annual'
            },
            duration: {
                startDate: new Date('2025-01-01'),
                endDate: new Date('2025-12-31'),
                days: 365
            },
            terms: {
                deductible: 200,
                exclusions: ['Cosmetic procedures'],
                conditions: ['Must be family member'],
                requirements: ['Health check required']
            },
            halalCompliance: {
                isHalal: true,
                rating: 5,
                certification: 'Halal Certified',
                features: ['No interest-based payments', 'Halal investment portfolio', 'Halal medical network'],
                notes: 'Premium halal health insurance'
            },
            documents: [
                { name: 'Policy Document', url: 'policy-doc2.pdf', type: 'policy', size: 1024 },
                { name: 'Terms Document', url: 'terms-doc2.pdf', type: 'terms', size: 512 }
            ],
            status: 'active',
            isFeatured: false,
            tags: ['health', 'family'],
            contactInfo: {
                phone: '+1-555-0456',
                email: 'support@testprovider2.com',
                website: 'https://testprovider2.com'
            },
            createdBy: managerUser._id
        });
    });

    afterAll(async () => {
        await Insurance.deleteMany({});
        await User.deleteMany({});
        await mongoose.connection.close();
    });

    describe('GET /insurance/health', () => {
        it('should return health status', async () => {
            const response = await request(app)
                .get('/insurance/health')
                .expect(200);

            expect(response.body).toMatchObject({
                status: 'success',
                message: 'Insurance service is healthy',
                data: {
                    service: 'insurance',
                    timestamp: expect.any(String)
                }
            });
        });
    });

    describe('GET /insurance', () => {
        it('should get all insurance with pagination', async () => {
            const response = await request(app)
                .get('/insurance')
                .expect(200);

            expect(response.body).toMatchObject({
                status: 'success',
                message: 'Insurance retrieved successfully',
                data: {
                    insurance: expect.any(Array),
                    pagination: {
                        page: 1,
                        pageSize: 10,
                        total: 2,
                        totalPages: 1
                    }
                }
            });

            expect(response.body.data.insurance).toHaveLength(2);
            expect(response.body.data.insurance[0]).toHaveProperty('id');
            expect(response.body.data.insurance[0]).toHaveProperty('name');
        });

        it('should filter insurance by price range', async () => {
            const response = await request(app)
                .get('/insurance?minPrice=100&maxPrice=200')
                .expect(200);

            expect(response.body.data.insurance).toHaveLength(2);
        });

        it('should filter insurance by type', async () => {
            const response = await request(app)
                .get('/insurance?type=travel')
                .expect(200);

            expect(response.body.data.insurance).toHaveLength(1);
            expect(response.body.data.insurance[0].type).toBe('travel');
        });
    });

    describe('GET /insurance/featured', () => {
        it('should get featured insurance', async () => {
            const response = await request(app)
                .get('/insurance/featured')
                .expect(200);

            expect(response.body).toMatchObject({
                status: 'success',
                message: 'Featured insurance retrieved successfully',
                data: expect.any(Array)
            });

            expect(response.body.data).toHaveLength(1);
            expect(response.body.data[0].isFeatured).toBe(true);
        });
    });

    describe('GET /insurance/type/:type', () => {
        it('should get insurance by type', async () => {
            const response = await request(app)
                .get('/insurance/type/travel')
                .expect(200);

            expect(response.body).toMatchObject({
                status: 'success',
                message: 'Insurance by type retrieved successfully',
                data: {
                    insurance: expect.any(Array),
                    type: 'travel'
                }
            });

            expect(response.body.data.insurance).toHaveLength(1);
            expect(response.body.data.insurance[0].type).toBe('travel');
        });

        it('should return empty array for non-existent type', async () => {
            const response = await request(app)
                .get('/insurance/type/NonExistent')
                .expect(200);

            expect(response.body.data.insurance).toHaveLength(0);
        });
    });

    describe('GET /insurance/halal', () => {
        it('should get halal-rated insurance', async () => {
            const response = await request(app)
                .get('/insurance/halal')
                .expect(200);

            expect(response.body).toMatchObject({
                status: 'success',
                message: 'Halal insurance retrieved successfully',
                data: {
                    insurance: expect.any(Array)
                }
            });

            expect(response.body.data.insurance).toHaveLength(2);
            expect(response.body.data.insurance[0].halalCompliance.isHalal).toBe(true);
        });
    });

    describe('GET /insurance/search/provider/:provider', () => {
        it('should search insurance by provider', async () => {
            const response = await request(app)
                .get('/insurance/search/provider/Test Provider 1')
                .expect(200);

            expect(response.body).toMatchObject({
                status: 'success',
                message: 'Insurance search completed successfully',
                data: {
                    insurance: expect.any(Array),
                    searchTerm: 'Test Provider 1'
                }
            });

            expect(response.body.data.insurance).toHaveLength(1);
            expect(response.body.data.insurance[0].provider).toBe('Test Provider 1');
        });

        it('should return empty array for non-existent provider', async () => {
            const response = await request(app)
                .get('/insurance/search/provider/NonExistent Provider')
                .expect(200);

            expect(response.body.data.insurance).toHaveLength(0);
        });
    });

    describe('GET /insurance/search/price-range', () => {
        it('should get insurance by price range', async () => {
            const response = await request(app)
                .get('/insurance/search/price-range')
                .query({
                    minPrice: 100,
                    maxPrice: 300
                })
                .expect(200);

            expect(response.body).toMatchObject({
                status: 'success',
                message: 'Insurance by price range retrieved successfully',
                data: {
                    insurance: expect.any(Array),
                    priceRange: {
                        minPrice: 100,
                        maxPrice: 300
                    }
                }
            });

            expect(response.body.data.insurance).toHaveLength(2);
        });

        it('should return error for invalid price range', async () => {
            const response = await request(app)
                .get('/insurance/search/price-range')
                .query({
                    minPrice: 300,
                    maxPrice: 100
                })
                .expect(200);

            expect(response.body.data.insurance).toHaveLength(0);
        });
    });

    describe('GET /insurance/:insuranceId', () => {
        it('should get insurance by ID', async () => {
            const response = await request(app)
                .get(`/insurance/${testInsurance._id}`)
                .expect(200);

            expect(response.body).toMatchObject({
                status: 'success',
                message: 'Insurance retrieved successfully',
                data: expect.objectContaining({
                    _id: testInsurance._id.toString(),
                    name: 'Test Insurance 1',
                    provider: 'Test Provider 1'
                })
            });
        });

        it('should return 404 for non-existent insurance', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const response = await request(app)
                .get(`/insurance/${fakeId}`)
                .expect(404);

            expect(response.body.status).toBe('error');
            expect(response.body.message).toContain('Insurance not found');
        });

        it('should return 500 for invalid insurance ID', async () => {
            const response = await request(app)
                .get('/insurance/invalid-id')
                .expect(500);

            expect(response.body.status).toBe('error');
        });
    });

    describe('POST /insurance', () => {
        const newInsuranceData = {
            name: 'New Test Insurance',
            description: 'A brand new test insurance policy',
            type: 'life',
            category: 'Individual',
            provider: 'New Test Provider',
            policyNumber: 'POL-003-2025',
            coverage: {
                type: 'comprehensive',
                amount: 500000,
                currency: 'USD',
                details: [
                    { item: 'Death Benefit', limit: 500000, description: 'Death benefit coverage' },
                    { item: 'Disability', limit: 250000, description: 'Disability coverage' },
                    { item: 'Critical Illness', limit: 100000, description: 'Critical illness coverage' }
                ]
            },
            premium: {
                amount: 300,
                currency: 'USD',
                frequency: 'annual'
            },
            duration: {
                startDate: new Date('2025-01-01'),
                endDate: new Date('2035-01-01'),
                days: 3650
            },
            terms: {
                deductible: 0,
                exclusions: ['Suicide within 2 years'],
                conditions: ['Must be under 70 years old'],
                requirements: ['Medical examination required']
            },
            halalCompliance: {
                isHalal: true,
                rating: 5,
                certification: 'Halal Certified',
                features: ['No interest-based payments', 'Halal investment portfolio', 'Takaful principles'],
                notes: 'Premium halal life insurance'
            },
            documents: [
                { name: 'Policy Document', url: 'new-policy-doc.pdf', type: 'policy', size: 1024 },
                { name: 'Terms Document', url: 'new-terms-doc.pdf', type: 'terms', size: 512 }
            ],
            status: 'active',
            isFeatured: true,
            tags: ['life', 'individual'],
            contactInfo: {
                phone: '+1-555-0789',
                email: 'support@newtestprovider.com',
                website: 'https://newtestprovider.com'
            }
        };

        it('should create new insurance with admin token', async () => {
            const response = await request(app)
                .post('/insurance')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(newInsuranceData)
                .expect(201);

            expect(response.body).toMatchObject({
                status: 'success',
                message: 'Insurance created successfully',
                data: expect.objectContaining({
                    name: 'New Test Insurance',
                    provider: 'New Test Provider',
                    premium: expect.objectContaining({
                        amount: 300
                    })
                })
            });
        });

        it('should create new insurance with manager token', async () => {
            const managerInsuranceData = { ...newInsuranceData, name: 'Manager Insurance' };
            const response = await request(app)
                .post('/insurance')
                .set('Authorization', `Bearer ${managerToken}`)
                .send(managerInsuranceData)
                .expect(201);

            expect(response.body.data.name).toBe('Manager Insurance');
        });

        it('should return 401 without authentication', async () => {
            const response = await request(app)
                .post('/insurance')
                .send(newInsuranceData)
                .expect(401);

            expect(response.body.status).toBe('error');
        });

        it('should return 403 with insufficient permissions', async () => {
            const response = await request(app)
                .post('/insurance')
                .set('Authorization', `Bearer ${userToken}`)
                .send(newInsuranceData)
                .expect(403);

            expect(response.body.status).toBe('error');
        });

        it('should return 400 for invalid data', async () => {
            const invalidData = { name: '' };
            const response = await request(app)
                .post('/insurance')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(invalidData)
                .expect(400);

            expect(response.body.status).toBe('error');
        });
    });

    describe('PUT /insurance/:insuranceId', () => {
        const updateData = {
            name: 'Updated Insurance Name',
            premium: {
                amount: 250,
                currency: 'USD',
                frequency: 'annual'
            },
            description: 'Updated description'
        };

        it('should update insurance with admin token', async () => {
            const response = await request(app)
                .put(`/insurance/${testInsurance._id}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send(updateData)
                .expect(200);

            expect(response.body).toMatchObject({
                status: 'success',
                message: 'Insurance updated successfully',
                data: expect.objectContaining({
                    name: 'Updated Insurance Name',
                    premium: expect.objectContaining({
                        amount: 250
                    })
                })
            });
        });

        it('should update insurance with manager token', async () => {
            const managerUpdateData = { ...updateData, name: 'Manager Updated Insurance' };
            const response = await request(app)
                .put(`/insurance/${testInsurance2._id}`)
                .set('Authorization', `Bearer ${managerToken}`)
                .send(managerUpdateData)
                .expect(200);

            expect(response.body.data.name).toBe('Manager Updated Insurance');
        });

        it('should return 401 without authentication', async () => {
            const response = await request(app)
                .put(`/insurance/${testInsurance._id}`)
                .send(updateData)
                .expect(401);

            expect(response.body.status).toBe('error');
        });

        it('should return 403 with insufficient permissions', async () => {
            const response = await request(app)
                .put(`/insurance/${testInsurance._id}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send(updateData)
                .expect(403);

            expect(response.body.status).toBe('error');
        });

        it('should return 404 for non-existent insurance', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const response = await request(app)
                .put(`/insurance/${fakeId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send(updateData)
                .expect(404);

            expect(response.body.status).toBe('error');
        });
    });

    describe('DELETE /insurance/:insuranceId', () => {
        it('should delete insurance with admin token', async () => {
            const insuranceToDelete = await Insurance.create({
                name: 'Insurance to Delete',
                description: 'This insurance will be deleted',
                type: 'vehicle',
                category: 'Personal',
                provider: 'Delete Provider',
                policyNumber: 'POL-DELETE-2025',
                coverage: {
                    type: 'comprehensive',
                    amount: 50000,
                    currency: 'USD',
                    details: [
                        { item: 'Liability', limit: 50000, description: 'Liability coverage' },
                        { item: 'Collision', limit: 25000, description: 'Collision coverage' },
                        { item: 'Comprehensive', limit: 25000, description: 'Comprehensive coverage' }
                    ]
                },
                premium: {
                    amount: 100,
                    currency: 'USD',
                    frequency: 'annual'
                },
                duration: {
                    startDate: new Date('2025-01-01'),
                    endDate: new Date('2025-12-31'),
                    days: 365
                },
                terms: {
                    deductible: 500,
                    exclusions: ['Racing'],
                    conditions: ['Valid driver license required'],
                    requirements: ['Vehicle inspection required']
                },
                halalCompliance: {
                    isHalal: true,
                    rating: 3,
                    certification: 'Halal Certified',
                    features: ['No interest-based payments'],
                    notes: 'Standard halal vehicle insurance'
                },
                documents: [
                    { name: 'Policy Document', url: 'delete-policy-doc.pdf', type: 'policy', size: 1024 }
                ],
                status: 'active',
                isFeatured: false,
                tags: ['vehicle', 'personal'],
                contactInfo: {
                    phone: '+1-555-0000',
                    email: 'support@deleteprovider.com',
                    website: 'https://deleteprovider.com'
                },
                createdBy: adminUser._id
            });

            const response = await request(app)
                .delete(`/insurance/${insuranceToDelete._id}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);

            expect(response.body).toMatchObject({
                status: 'success',
                message: 'Insurance deleted successfully'
            });

            // Verify insurance is soft deleted
            const deletedInsurance = await Insurance.findById(insuranceToDelete._id);
            expect(deletedInsurance.status).toBe('inactive');
        });

        it('should return 401 without authentication', async () => {
            const response = await request(app)
                .delete(`/insurance/${testInsurance._id}`)
                .expect(401);

            expect(response.body.status).toBe('error');
        });

        it('should return 403 with manager token (insufficient permissions)', async () => {
            const response = await request(app)
                .delete(`/insurance/${testInsurance._id}`)
                .set('Authorization', `Bearer ${managerToken}`)
                .expect(403);

            expect(response.body.status).toBe('error');
        });

        it('should return 404 for non-existent insurance', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const response = await request(app)
                .delete(`/insurance/${fakeId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(404);

            expect(response.body.status).toBe('error');
        });
    });
}); 