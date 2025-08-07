const cruiseService = require('../../../../src/services/cruise/service');
const Cruise = require('../../../../src/models/Cruise');

// Mock dependencies
jest.mock('../../../../src/models/Cruise');

describe('Cruise Service', () => {
    let mockCruise;
    let mockCruiseData;

    beforeEach(() => {
        // Reset all mocks
        jest.clearAllMocks();

        // Create mock cruise data
        mockCruiseData = global.testUtils.generateTestCruise();

        // Create mock cruise instance
        mockCruise = {
            _id: 'cruise123',
            ...mockCruiseData,
            save: jest.fn().mockResolvedValue(mockCruise),
            getSummary: jest.fn().mockReturnValue({
                id: 'cruise123',
                name: mockCruiseData.name,
                cruiseLine: mockCruiseData.cruiseLine,
                shipName: mockCruiseData.shipName,
                departurePort: mockCruiseData.departurePort,
                arrivalPort: mockCruiseData.arrivalPort,
                departureDate: mockCruiseData.departureDate,
                duration: mockCruiseData.duration,
                price: mockCruiseData.price,
                currency: mockCruiseData.currency,
                availableCabins: mockCruiseData.availableCabins,
                halalRating: mockCruiseData.halalRating,
                primaryImage: 'https://example.com/image.jpg',
                status: 'available',
                isFeatured: mockCruiseData.isFeatured
            })
        };

        // Mock Cruise constructor
        Cruise.mockImplementation(() => mockCruise);
    });

    describe('createCruise', () => {
        it('should create cruise successfully', async () => {
            const userId = 'user123';
            const cruiseData = mockCruiseData;

            const result = await cruiseService.createCruise(cruiseData, userId);

            expect(Cruise).toHaveBeenCalledWith({
                ...cruiseData,
                createdBy: userId
            });
            expect(mockCruise.save).toHaveBeenCalled();
            expect(result.status).toBe('success');
            expect(result.message).toBe('Cruise created successfully');
            expect(result.data).toBe(mockCruise);
            expect(result.statusCode).toBe(201);
        });

        it('should handle validation errors', async () => {
            const userId = 'user123';
            const invalidCruiseData = { ...mockCruiseData, name: '' }; // Invalid data

            const validationError = new Error('Validation failed');
            validationError.name = 'ValidationError';
            validationError.errors = {
                name: { message: 'Cruise name is required' }
            };

            Cruise.mockImplementation(() => {
                throw validationError;
            });

            const result = await cruiseService.createCruise(invalidCruiseData, userId);

            expect(result.status).toBe('error');
            expect(result.message).toBe('Validation failed');
            expect(result.errorCode).toBe('VALIDATION_ERROR');
            expect(result.statusCode).toBe(400);
            expect(result.details).toEqual(['Cruise name is required']);
        });

        it('should handle database errors', async () => {
            const userId = 'user123';
            const cruiseData = mockCruiseData;

            Cruise.mockImplementation(() => {
                throw new Error('Database connection failed');
            });

            const result = await cruiseService.createCruise(cruiseData, userId);

            expect(result.status).toBe('error');
            expect(result.message).toBe('Database operation failed');
            expect(result.errorCode).toBe('CREATE_CRUISE_ERROR');
            expect(result.statusCode).toBe(500);
        });
    });

    describe('getAllCruises', () => {
        it('should get all cruises with pagination', async () => {
            const query = { page: 1, pageSize: 10 };
            const mockCruises = [mockCruise, mockCruise];
            const mockTotal = 2;

            Cruise.find = jest.fn().mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    skip: jest.fn().mockReturnValue({
                        limit: jest.fn().mockReturnValue({
                            sort: jest.fn().mockResolvedValue(mockCruises)
                        })
                    })
                })
            });

            Cruise.countDocuments = jest.fn().mockResolvedValue(mockTotal);

            const result = await cruiseService.getAllCruises(query);

            expect(result.status).toBe('success');
            expect(result.message).toBe('Cruises retrieved successfully');
            expect(result.data.cruises).toHaveLength(2);
            expect(result.data.pagination).toEqual({
                page: 1,
                pageSize: 10,
                total: 2,
                totalPages: 1
            });
        });

        it('should apply search filter', async () => {
            const query = { search: 'test' };
            const mockCruises = [mockCruise];

            Cruise.find = jest.fn().mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    skip: jest.fn().mockReturnValue({
                        limit: jest.fn().mockReturnValue({
                            sort: jest.fn().mockResolvedValue(mockCruises)
                        })
                    })
                })
            });

            Cruise.countDocuments = jest.fn().mockResolvedValue(1);

            await cruiseService.getAllCruises(query);

            expect(Cruise.find).toHaveBeenCalledWith({
                isActive: true,
                $or: [
                    { name: { $regex: 'test', $options: 'i' } },
                    { description: { $regex: 'test', $options: 'i' } },
                    { cruiseLine: { $regex: 'test', $options: 'i' } },
                    { shipName: { $regex: 'test', $options: 'i' } }
                ]
            });
        });

        it('should apply price range filter', async () => {
            const query = { minPrice: 500, maxPrice: 1500 };
            const mockCruises = [mockCruise];

            Cruise.find = jest.fn().mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    skip: jest.fn().mockReturnValue({
                        limit: jest.fn().mockReturnValue({
                            sort: jest.fn().mockResolvedValue(mockCruises)
                        })
                    })
                })
            });

            Cruise.countDocuments = jest.fn().mockResolvedValue(1);

            await cruiseService.getAllCruises(query);

            expect(Cruise.find).toHaveBeenCalledWith({
                isActive: true,
                price: { $gte: 500, $lte: 1500 }
            });
        });

        it('should handle database errors', async () => {
            const query = { page: 1, pageSize: 10 };

            Cruise.find = jest.fn().mockImplementation(() => {
                throw new Error('Database error');
            });

            const result = await cruiseService.getAllCruises(query);

            expect(result.status).toBe('error');
            expect(result.message).toBe('Database operation failed');
            expect(result.errorCode).toBe('GET_CRUISES_ERROR');
            expect(result.statusCode).toBe(500);
        });
    });

    describe('getCruiseById', () => {
        it('should get cruise by ID successfully', async () => {
            const cruiseId = 'cruise123';

            Cruise.findById = jest.fn().mockReturnValue({
                populate: jest.fn().mockResolvedValue(mockCruise)
            });

            const result = await cruiseService.getCruiseById(cruiseId);

            expect(Cruise.findById).toHaveBeenCalledWith(cruiseId);
            expect(result.status).toBe('success');
            expect(result.message).toBe('Cruise retrieved successfully');
            expect(result.data).toBe(mockCruise);
        });

        it('should return error when cruise not found', async () => {
            const cruiseId = 'nonexistent';

            Cruise.findById = jest.fn().mockReturnValue({
                populate: jest.fn().mockResolvedValue(null)
            });

            const result = await cruiseService.getCruiseById(cruiseId);

            expect(result.status).toBe('error');
            expect(result.message).toBe('Cruise not found');
            expect(result.errorCode).toBe('CRUISE_NOT_FOUND');
            expect(result.statusCode).toBe(404);
        });

        it('should handle database errors', async () => {
            const cruiseId = 'cruise123';

            Cruise.findById = jest.fn().mockImplementation(() => {
                throw new Error('Database error');
            });

            const result = await cruiseService.getCruiseById(cruiseId);

            expect(result.status).toBe('error');
            expect(result.message).toBe('Database operation failed');
            expect(result.errorCode).toBe('GET_CRUISE_ERROR');
            expect(result.statusCode).toBe(500);
        });
    });

    describe('updateCruise', () => {
        it('should update cruise successfully', async () => {
            const cruiseId = 'cruise123';
            const updateData = { name: 'Updated Cruise Name' };
            const userId = 'user123';

            Cruise.findById = jest.fn().mockResolvedValue(mockCruise);

            const result = await cruiseService.updateCruise(cruiseId, updateData, userId);

            expect(Cruise.findById).toHaveBeenCalledWith(cruiseId);
            expect(mockCruise.save).toHaveBeenCalled();
            expect(result.status).toBe('success');
            expect(result.message).toBe('Cruise updated successfully');
            expect(result.data).toBe(mockCruise);
        });

        it('should return error when cruise not found', async () => {
            const cruiseId = 'nonexistent';
            const updateData = { name: 'Updated Cruise Name' };
            const userId = 'user123';

            Cruise.findById = jest.fn().mockResolvedValue(null);

            const result = await cruiseService.updateCruise(cruiseId, updateData, userId);

            expect(result.status).toBe('error');
            expect(result.message).toBe('Cruise not found');
            expect(result.errorCode).toBe('CRUISE_NOT_FOUND');
            expect(result.statusCode).toBe(404);
        });

        it('should handle validation errors', async () => {
            const cruiseId = 'cruise123';
            const updateData = { name: '' }; // Invalid data
            const userId = 'user123';

            Cruise.findById = jest.fn().mockResolvedValue(mockCruise);

            const validationError = new Error('Validation failed');
            validationError.name = 'ValidationError';
            validationError.errors = {
                name: { message: 'Cruise name is required' }
            };

            mockCruise.save.mockRejectedValue(validationError);

            const result = await cruiseService.updateCruise(cruiseId, updateData, userId);

            expect(result.status).toBe('error');
            expect(result.message).toBe('Validation failed');
            expect(result.errorCode).toBe('VALIDATION_ERROR');
            expect(result.statusCode).toBe(400);
        });
    });

    describe('deleteCruise', () => {
        it('should delete cruise successfully', async () => {
            const cruiseId = 'cruise123';

            Cruise.findById = jest.fn().mockResolvedValue(mockCruise);

            const result = await cruiseService.deleteCruise(cruiseId);

            expect(Cruise.findById).toHaveBeenCalledWith(cruiseId);
            expect(mockCruise.save).toHaveBeenCalled();
            expect(result.status).toBe('success');
            expect(result.message).toBe('Cruise deleted successfully');
        });

        it('should return error when cruise not found', async () => {
            const cruiseId = 'nonexistent';

            Cruise.findById = jest.fn().mockResolvedValue(null);

            const result = await cruiseService.deleteCruise(cruiseId);

            expect(result.status).toBe('error');
            expect(result.message).toBe('Cruise not found');
            expect(result.errorCode).toBe('CRUISE_NOT_FOUND');
            expect(result.statusCode).toBe(404);
        });
    });

    describe('getFeaturedCruises', () => {
        it('should get featured cruises successfully', async () => {
            const limit = 6;
            const mockCruises = [mockCruise, mockCruise];

            Cruise.findFeaturedCruises = jest.fn().mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    limit: jest.fn().mockReturnValue({
                        sort: jest.fn().mockResolvedValue(mockCruises)
                    })
                })
            });

            const result = await cruiseService.getFeaturedCruises(limit);

            expect(Cruise.findFeaturedCruises).toHaveBeenCalled();
            expect(result.status).toBe('success');
            expect(result.message).toBe('Featured cruises retrieved successfully');
            expect(result.data).toHaveLength(2);
        });

        it('should handle database errors', async () => {
            const limit = 6;

            Cruise.findFeaturedCruises = jest.fn().mockImplementation(() => {
                throw new Error('Database error');
            });

            const result = await cruiseService.getFeaturedCruises(limit);

            expect(result.status).toBe('error');
            expect(result.message).toBe('Database operation failed');
            expect(result.errorCode).toBe('GET_FEATURED_CRUISES_ERROR');
            expect(result.statusCode).toBe(500);
        });
    });

    describe('searchCruisesByDestination', () => {
        it('should search cruises by destination successfully', async () => {
            const destination = 'Caribbean';
            const query = { page: 1, pageSize: 10 };
            const mockCruises = [mockCruise];

            Cruise.findByDestination = jest.fn().mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    skip: jest.fn().mockReturnValue({
                        limit: jest.fn().mockReturnValue({
                            sort: jest.fn().mockResolvedValue(mockCruises)
                        })
                    })
                })
            });

            Cruise.countDocuments = jest.fn().mockResolvedValue(1);

            const result = await cruiseService.searchCruisesByDestination(destination, query);

            expect(Cruise.findByDestination).toHaveBeenCalledWith(destination);
            expect(result.status).toBe('success');
            expect(result.message).toBe('Cruises search completed successfully');
            expect(result.data.cruises).toHaveLength(1);
            expect(result.data.searchTerm).toBe(destination);
        });
    });

    describe('getCruisesByDateRange', () => {
        it('should get cruises by date range successfully', async () => {
            const startDate = new Date('2024-06-01');
            const endDate = new Date('2024-08-31');
            const query = { page: 1, pageSize: 10 };
            const mockCruises = [mockCruise];

            Cruise.findByDateRange = jest.fn().mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    skip: jest.fn().mockReturnValue({
                        limit: jest.fn().mockReturnValue({
                            sort: jest.fn().mockResolvedValue(mockCruises)
                        })
                    })
                })
            });

            Cruise.countDocuments = jest.fn().mockResolvedValue(1);

            const result = await cruiseService.getCruisesByDateRange(startDate, endDate, query);

            expect(Cruise.findByDateRange).toHaveBeenCalledWith(startDate, endDate);
            expect(result.status).toBe('success');
            expect(result.message).toBe('Cruises by date range retrieved successfully');
            expect(result.data.cruises).toHaveLength(1);
            expect(result.data.dateRange).toEqual({ startDate, endDate });
        });
    });

    describe('getHalalCruises', () => {
        it('should get halal cruises successfully', async () => {
            const minRating = 3;
            const query = { page: 1, pageSize: 10 };
            const mockCruises = [mockCruise];

            Cruise.find = jest.fn().mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    skip: jest.fn().mockReturnValue({
                        limit: jest.fn().mockReturnValue({
                            sort: jest.fn().mockResolvedValue(mockCruises)
                        })
                    })
                })
            });

            Cruise.countDocuments = jest.fn().mockResolvedValue(1);

            const result = await cruiseService.getHalalCruises(minRating, query);

            expect(Cruise.find).toHaveBeenCalledWith({
                isActive: true,
                halalRating: { $gte: minRating }
            });
            expect(result.status).toBe('success');
            expect(result.message).toBe('Halal cruises retrieved successfully');
            expect(result.data.cruises).toHaveLength(1);
            expect(result.data.minHalalRating).toBe(minRating);
        });
    });
}); 