const HalalHotel = require('../models/halalHotel.model');
const HalalHotelStructure = require('../models/halalHotelStructure.model');
const AppError = require('../../../utils/appError');
const { validateHotelInfo, validateStructure, validateGetHalalHotel } = require('../validators/hotel.validator');

const saveOrUpdateHotelInfo = async (hotelInfo) => {
    validateHotelInfo(hotelInfo);
    const totalRating = hotelInfo.ratings.reduce((total, rating) => total + rating.rating, 0);
    if (totalRating > 100) {
        throw new AppError('Total rating exceeds 100', 400);
    }

    const updatedHotel = await HalalHotel.findOneAndUpdate(
        { id: hotelInfo.id },
        { $set: { ratings: hotelInfo.ratings, star_rating: totalRating } },
        { upsert: true, new: true }
    );

    return { success: true, message: 'Hotel information saved/updated successfully', data: updatedHotel };
};

const getAllHalalHotelInfo = async (query) => {
    const { page = 1, pageSize = 100 } = query;
    const hotels = await HalalHotel.find().lean();
    const totalHotels = hotels.length;
    if (totalHotels === 0) {
        throw new AppError('No halal hotels found', 404);
    }

    const maxPageNumber = Math.ceil(totalHotels / pageSize);
    if (page > maxPageNumber) {
        throw new AppError('Invalid page number', 400);
    }

    const offset = (page - 1) * pageSize;
    const paginatedData = hotels.slice(offset, offset + pageSize);
    return { success: true, message: 'Halal hotels fetched successfully', data: paginatedData, totalHotels };
};

const getHalalHotelInfo = async (query) => {
    validateGetHalalHotel(query);
    const hotel = await HalalHotel.findOne({ id: query.id }).lean();
    if (!hotel) {
        throw new AppError('Halal hotel not found', 404);
    }
    return { success: true, message: 'Halal hotel fetched successfully', data: hotel };
};

const saveOrUpdateStructure = async (structureInfo) => {
    validateStructure(structureInfo);
    const totalRating = structureInfo.ratings.reduce((total, rating) => total + rating.rating, 0);
    if (totalRating > 100) {
        throw new AppError('Total rating exceeds 100', 400);
    }

    const updatedStructure = await HalalHotelStructure.findOneAndUpdate(
        { id: 'structure' },
        { $set: { ratings: structureInfo.ratings, star_rating: totalRating } },
        { upsert: true, new: true }
    );

    return { success: true, message: 'Halal rating structure saved/updated successfully', data: updatedStructure };
};

const getHalalRatingStructure = async () => {
    const structure = await HalalHotelStructure.findOne({ id: 'structure' }).lean();
    if (!structure) {
        throw new AppError('Halal rating structure not found', 404);
    }
    return { success: true, message: 'Halal rating structure fetched successfully', data: structure };
};

module.exports = {
    saveOrUpdateHotelInfo,
    getAllHalalHotelInfo,
    getHalalHotelInfo,
    saveOrUpdateStructure,
    getHalalRatingStructure,
};