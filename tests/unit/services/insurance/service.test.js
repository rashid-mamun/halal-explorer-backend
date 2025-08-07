const insuranceService = require('../../../../src/services/insurance/service');
const Insurance = require('../../../../src/models/Insurance');

// Mock dependencies
jest.mock('../../../../src/models/Insurance');

describe('Insurance Service', () => {
    let mockInsurance;
    let mockInsuranceData;

    beforeEach(() => {
        // Reset all mocks
        jest.clearAllMocks();

        // Create mock insurance data
        mockInsuranceData = global.testUtils.generateTestInsurance();

        // Create mock insurance instance
        mockInsurance = {
            _id: 'insurance123',
            ...mockInsuranceData,
            save: jest.fn().mockResolvedValue(mockInsurance),
            getSummary: jest.fn().mockReturnValue({
                id: 'insurance123',
                name: mockInsuranceData.name,
                type: mockInsuranceData.type,
                category: mockInsuranceData.category,
                provider: mockInsuranceData.provider,
                coverage: {
                    type: mockInsuranceData.coverage.type,
                    amount: mockInsuranceData.coverage.amount,
                    currency: mockInsuranceData.coverage.currency
                },
                premium: {
                    amount: mockInsuranceData.premium.amount,
                    currency: mockInsuranceData.premium.currency,
                    frequency: mockInsuranceData.premium.frequency
                },
                duration: {
                    startDate: mockInsuranceData.duration.startDate,
                    endDate: mockInsuranceData.duration.endDate,
                    days: mockInsuranceData.duration.days
                },
                halalCompliance: {
                    isHalal: mockInsuranceData.halalCompliance.isHalal,
                    rating: mockInsuranceData.halalCompliance.rating
                },
                status: mockInsuranceData.status,
                isFeatured: mockInsuranceData.isFeatured,
                isActive: true,
                isExpired: false,
                daysUntilExpiry: 365
            })
        };

        // Mock Insurance constructor
        Insurance.mockImplementation(() => mockInsurance);
    });

    describe('createInsurance', () => {
        it('should create insurance successfully', async () => {
            const userId = 'user123';
            const insuranceData = mockInsuranceData;

            const result = await insuranceService.createInsurance(insuranceData, userId);

            expect(Insurance).toHaveBeenCalledWith({
                ...insuranceData,
                createdBy: userId
            });
            expect(mockInsurance.save).toHaveBeenCalled();
            expect(result.status).toBe('success');
            expect(result.message).toBe('Insurance created successfully');
            expect(result.data).toBe(mockInsurance);
            expect(result.statusCode).toBe(201);
        });

        it('should handle validation errors', async () => {
            const userId = 'user123';
            const invalidInsuranceData = { ...mockInsuranceData, name: '' }; // Invalid data

            const validationError = new Error('Validation failed');
            validationError.name = 'ValidationError';
            validationError.errors = {
                name: { message: 'Insurance name is required' }
            };

            Insurance.mockImplementation(() => {
                throw validationError;
            });

            const result = await insuranceService.createInsurance(invalidInsuranceData, userId);

            expect(result.status).toBe('error');
            expect(result.message).toBe('Validation failed');
            expect(result.errorCode).toBe('VALIDATION_ERROR');
            expect(result.statusCode).toBe(400);
            expect(result.details).toEqual(['Insurance name is required']);
        });

        it('should handle duplicate policy number error', async () => {
            const userId = 'user123';
            const insuranceData = mockInsuranceData;

            const duplicateError = new Error('Duplicate key error');
            duplicateError.code = 11000;

            Insurance.mockImplementation(() => {
                throw duplicateError;
            });

            const result = await insuranceService.createInsurance(insuranceData, userId);

            expect(result.status).toBe('error');
            expect(result.message).toBe('Policy number already exists');
            expect(result.errorCode).toBe('DUPLICATE_POLICY_NUMBER');
            expect(result.statusCode).toBe(409);
        });

        it('should handle database errors', async () => {
            const userId = 'user123';
            const insuranceData = mockInsuranceData;

            Insurance.mockImplementation(() => {
                throw new Error('Database connection failed');
            });

            const result = await insuranceService.createInsurance(insuranceData, userId);

            expect(result.status).toBe('error');
            expect(result.message).toBe('Database operation failed');
            expect(result.errorCode).toBe('CREATE_INSURANCE_ERROR');
            expect(result.statusCode).toBe(500);
        });
    });

    describe('getAllInsurance', () => {
        it('should get all insurance with pagination', async () => {
            const query = { page: 1, pageSize: 10 };
            const mockInsuranceList = [mockInsurance, mockInsurance];
            const mockTotal = 2;

            Insurance.find = jest.fn().mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    skip: jest.fn().mockReturnValue({
                        limit: jest.fn().mockReturnValue({
                            sort: jest.fn().mockResolvedValue(mockInsuranceList)
                        })
                    })
                })
            });

            Insurance.countDocuments = jest.fn().mockResolvedValue(mockTotal);

            const result = await insuranceService.getAllInsurance(query);

            expect(result.status).toBe('success');
            expect(result.message).toBe('Insurance retrieved successfully');
            expect(result.data.insurance).toHaveLength(2);
            expect(result.data.pagination).toEqual({
                page: 1,
                pageSize: 10,
                total: 2,
                totalPages: 1
            });
        });

        it('should apply search filter', async () => {
            const query = { search: 'test' };
            const mockInsuranceList = [mockInsurance];

            Insurance.find = jest.fn().mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    skip: jest.fn().mockReturnValue({
                        limit: jest.fn().mockReturnValue({
                            sort: jest.fn().mockResolvedValue(mockInsuranceList)
                        })
                    })
                })
            });

            Insurance.countDocuments = jest.fn().mockResolvedValue(1);

            await insuranceService.getAllInsurance(query);

            expect(Insurance.find).toHaveBeenCalledWith({
                status: 'active',
                $or: [
                    { name: { $regex: 'test', $options: 'i' } },
                    { description: { $regex: 'test', $options: 'i' } },
                    { provider: { $regex: 'test', $options: 'i' } },
                    { category: { $regex: 'test', $options: 'i' } }
                ]
            });
        });

        it('should apply type filter', async () => {
            const query = { type: 'travel' };
            const mockInsuranceList = [mockInsurance];

            Insurance.find = jest.fn().mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    skip: jest.fn().mockReturnValue({
                        limit: jest.fn().mockReturnValue({
                            sort: jest.fn().mockResolvedValue(mockInsuranceList)
                        })
                    })
                })
            });

            Insurance.countDocuments = jest.fn().mockResolvedValue(1);

            await insuranceService.getAllInsurance(query);

            expect(Insurance.find).toHaveBeenCalledWith({
                status: 'active',
                type: 'travel'
            });
        });

        it('should apply price range filter', async () => {
            const query = { minPrice: 100, maxPrice: 1000 };
            const mockInsuranceList = [mockInsurance];

            Insurance.find = jest.fn().mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    skip: jest.fn().mockReturnValue({
                        limit: jest.fn().mockReturnValue({
                            sort: jest.fn().mockResolvedValue(mockInsuranceList)
                        })
                    })
                })
            });

            Insurance.countDocuments = jest.fn().mockResolvedValue(1);

            await insuranceService.getAllInsurance(query);

            expect(Insurance.find).toHaveBeenCalledWith({
                status: 'active',
                'premium.amount': { $gte: 100, $lte: 1000 }
            });
        });

        it('should apply halal filter', async () => {
            const query = { isHalal: 'true' };
            const mockInsuranceList = [mockInsurance];

            Insurance.find = jest.fn().mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    skip: jest.fn().mockReturnValue({
                        limit: jest.fn().mockReturnValue({
                            sort: jest.fn().mockResolvedValue(mockInsuranceList)
                        })
                    })
                })
            });

            Insurance.countDocuments = jest.fn().mockResolvedValue(1);

            await insuranceService.getAllInsurance(query);

            expect(Insurance.find).toHaveBeenCalledWith({
                status: 'active',
                'halalCompliance.isHalal': true
            });
        });

        it('should handle database errors', async () => {
            const query = { page: 1, pageSize: 10 };

            Insurance.find = jest.fn().mockImplementation(() => {
                throw new Error('Database error');
            });

            const result = await insuranceService.getAllInsurance(query);

            expect(result.status).toBe('error');
            expect(result.message).toBe('Database operation failed');
            expect(result.errorCode).toBe('GET_INSURANCE_ERROR');
            expect(result.statusCode).toBe(500);
        });
    });

    describe('getInsuranceById', () => {
        it('should get insurance by ID successfully', async () => {
            const insuranceId = 'insurance123';

            Insurance.findById = jest.fn().mockReturnValue({
                populate: jest.fn().mockResolvedValue(mockInsurance)
            });

            const result = await insuranceService.getInsuranceById(insuranceId);

            expect(Insurance.findById).toHaveBeenCalledWith(insuranceId);
            expect(result.status).toBe('success');
            expect(result.message).toBe('Insurance retrieved successfully');
            expect(result.data).toBe(mockInsurance);
        });

        it('should return error when insurance not found', async () => {
            const insuranceId = 'nonexistent';

            Insurance.findById = jest.fn().mockReturnValue({
                populate: jest.fn().mockResolvedValue(null)
            });

            const result = await insuranceService.getInsuranceById(insuranceId);

            expect(result.status).toBe('error');
            expect(result.message).toBe('Insurance not found');
            expect(result.errorCode).toBe('INSURANCE_NOT_FOUND');
            expect(result.statusCode).toBe(404);
        });

        it('should handle database errors', async () => {
            const insuranceId = 'insurance123';

            Insurance.findById = jest.fn().mockImplementation(() => {
                throw new Error('Database error');
            });

            const result = await insuranceService.getInsuranceById(insuranceId);

            expect(result.status).toBe('error');
            expect(result.message).toBe('Database operation failed');
            expect(result.errorCode).toBe('GET_INSURANCE_ERROR');
            expect(result.statusCode).toBe(500);
        });
    });

    describe('updateInsurance', () => {
        it('should update insurance successfully', async () => {
            const insuranceId = 'insurance123';
            const updateData = { name: 'Updated Insurance Name' };
            const userId = 'user123';

            Insurance.findById = jest.fn().mockResolvedValue(mockInsurance);

            const result = await insuranceService.updateInsurance(insuranceId, updateData, userId);

            expect(Insurance.findById).toHaveBeenCalledWith(insuranceId);
            expect(mockInsurance.save).toHaveBeenCalled();
            expect(result.status).toBe('success');
            expect(result.message).toBe('Insurance updated successfully');
            expect(result.data).toBe(mockInsurance);
        });

        it('should return error when insurance not found', async () => {
            const insuranceId = 'nonexistent';
            const updateData = { name: 'Updated Insurance Name' };
            const userId = 'user123';

            Insurance.findById = jest.fn().mockResolvedValue(null);

            const result = await insuranceService.updateInsurance(insuranceId, updateData, userId);

            expect(result.status).toBe('error');
            expect(result.message).toBe('Insurance not found');
            expect(result.errorCode).toBe('INSURANCE_NOT_FOUND');
            expect(result.statusCode).toBe(404);
        });

        it('should handle validation errors', async () => {
            const insuranceId = 'insurance123';
            const updateData = { name: '' }; // Invalid data
            const userId = 'user123';

            Insurance.findById = jest.fn().mockResolvedValue(mockInsurance);

            const validationError = new Error('Validation failed');
            validationError.name = 'ValidationError';
            validationError.errors = {
                name: { message: 'Insurance name is required' }
            };

            mockInsurance.save.mockRejectedValue(validationError);

            const result = await insuranceService.updateInsurance(insuranceId, updateData, userId);

            expect(result.status).toBe('error');
            expect(result.message).toBe('Validation failed');
            expect(result.errorCode).toBe('VALIDATION_ERROR');
            expect(result.statusCode).toBe(400);
        });
    });

    describe('deleteInsurance', () => {
        it('should delete insurance successfully', async () => {
            const insuranceId = 'insurance123';

            Insurance.findById = jest.fn().mockResolvedValue(mockInsurance);

            const result = await insuranceService.deleteInsurance(insuranceId);

            expect(Insurance.findById).toHaveBeenCalledWith(insuranceId);
            expect(mockInsurance.save).toHaveBeenCalled();
            expect(result.status).toBe('success');
            expect(result.message).toBe('Insurance deleted successfully');
        });

        it('should return error when insurance not found', async () => {
            const insuranceId = 'nonexistent';

            Insurance.findById = jest.fn().mockResolvedValue(null);

            const result = await insuranceService.deleteInsurance(insuranceId);

            expect(result.status).toBe('error');
            expect(result.message).toBe('Insurance not found');
            expect(result.errorCode).toBe('INSURANCE_NOT_FOUND');
            expect(result.statusCode).toBe(404);
        });
    });

    describe('getFeaturedInsurance', () => {
        it('should get featured insurance successfully', async () => {
            const limit = 6;
            const mockInsuranceList = [mockInsurance, mockInsurance];

            Insurance.findFeaturedInsurance = jest.fn().mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    limit: jest.fn().mockReturnValue({
                        sort: jest.fn().mockResolvedValue(mockInsuranceList)
                    })
                })
            });

            const result = await insuranceService.getFeaturedInsurance(limit);

            expect(Insurance.findFeaturedInsurance).toHaveBeenCalled();
            expect(result.status).toBe('success');
            expect(result.message).toBe('Featured insurance retrieved successfully');
            expect(result.data).toHaveLength(2);
        });

        it('should handle database errors', async () => {
            const limit = 6;

            Insurance.findFeaturedInsurance = jest.fn().mockImplementation(() => {
                throw new Error('Database error');
            });

            const result = await insuranceService.getFeaturedInsurance(limit);

            expect(result.status).toBe('error');
            expect(result.message).toBe('Database operation failed');
            expect(result.errorCode).toBe('GET_FEATURED_INSURANCE_ERROR');
            expect(result.statusCode).toBe(500);
        });
    });

    describe('getInsuranceByType', () => {
        it('should get insurance by type successfully', async () => {
            const type = 'travel';
            const query = { page: 1, pageSize: 10 };
            const mockInsuranceList = [mockInsurance];

            Insurance.findByType = jest.fn().mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    skip: jest.fn().mockReturnValue({
                        limit: jest.fn().mockReturnValue({
                            sort: jest.fn().mockResolvedValue(mockInsuranceList)
                        })
                    })
                })
            });

            Insurance.countDocuments = jest.fn().mockResolvedValue(1);

            const result = await insuranceService.getInsuranceByType(type, query);

            expect(Insurance.findByType).toHaveBeenCalledWith(type);
            expect(result.status).toBe('success');
            expect(result.message).toBe('Insurance by type retrieved successfully');
            expect(result.data.insurance).toHaveLength(1);
            expect(result.data.type).toBe(type);
        });
    });

    describe('getHalalInsurance', () => {
        it('should get halal insurance successfully', async () => {
            const minRating = 3;
            const query = { page: 1, pageSize: 10 };
            const mockInsuranceList = [mockInsurance];

            Insurance.findHalalInsurance = jest.fn().mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    skip: jest.fn().mockReturnValue({
                        limit: jest.fn().mockReturnValue({
                            sort: jest.fn().mockResolvedValue(mockInsuranceList)
                        })
                    })
                })
            });

            Insurance.countDocuments = jest.fn().mockResolvedValue(1);

            const result = await insuranceService.getHalalInsurance(minRating, query);

            expect(Insurance.findHalalInsurance).toHaveBeenCalledWith(minRating);
            expect(result.status).toBe('success');
            expect(result.message).toBe('Halal insurance retrieved successfully');
            expect(result.data.insurance).toHaveLength(1);
            expect(result.data.minHalalRating).toBe(minRating);
        });
    });

    describe('searchInsuranceByProvider', () => {
        it('should search insurance by provider successfully', async () => {
            const provider = 'Test Insurance Co';
            const query = { page: 1, pageSize: 10 };
            const mockInsuranceList = [mockInsurance];

            Insurance.findByProvider = jest.fn().mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    skip: jest.fn().mockReturnValue({
                        limit: jest.fn().mockReturnValue({
                            sort: jest.fn().mockResolvedValue(mockInsuranceList)
                        })
                    })
                })
            });

            Insurance.countDocuments = jest.fn().mockResolvedValue(1);

            const result = await insuranceService.searchInsuranceByProvider(provider, query);

            expect(Insurance.findByProvider).toHaveBeenCalledWith(provider);
            expect(result.status).toBe('success');
            expect(result.message).toBe('Insurance search completed successfully');
            expect(result.data.insurance).toHaveLength(1);
            expect(result.data.searchTerm).toBe(provider);
        });
    });

    describe('getInsuranceByPriceRange', () => {
        it('should get insurance by price range successfully', async () => {
            const minPrice = 100;
            const maxPrice = 1000;
            const query = { page: 1, pageSize: 10 };
            const mockInsuranceList = [mockInsurance];

            Insurance.findByPriceRange = jest.fn().mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    skip: jest.fn().mockReturnValue({
                        limit: jest.fn().mockReturnValue({
                            sort: jest.fn().mockResolvedValue(mockInsuranceList)
                        })
                    })
                })
            });

            Insurance.countDocuments = jest.fn().mockResolvedValue(1);

            const result = await insuranceService.getInsuranceByPriceRange(minPrice, maxPrice, query);

            expect(Insurance.findByPriceRange).toHaveBeenCalledWith(minPrice, maxPrice);
            expect(result.status).toBe('success');
            expect(result.message).toBe('Insurance by price range retrieved successfully');
            expect(result.data.insurance).toHaveLength(1);
            expect(result.data.priceRange).toEqual({ minPrice, maxPrice });
        });
    });
}); 