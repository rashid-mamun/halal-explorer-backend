const { successResponse } = require('../../../utils/response.util');
const {
    searchHotels,
    searchHotelDetails,
    searchFilterHotels,
    dumbHotelById,
} = require('../services/hotel.service');

const hotelSearchHandler = async (req, res, next) => {
    try {
        const result = await searchHotels(req.query);
        successResponse(res, result, 'Hotels search completed successfully');
    } catch (err) {
        next(err);
    }
};

const hotelSearchFilterHandler = async (req, res, next) => {
    try {
        const result = await searchFilterHotels(req.query);
        successResponse(res, result, 'Filtered hotels fetched successfully');
    } catch (err) {
        next(err);
    }
};

const hotelSearchDetailsHandler = async (req, res, next) => {
    try {
        const result = await searchHotelDetails(req.query);
        successResponse(res, result, 'Hotel details fetched successfully');
    } catch (err) {
        next(err);
    }
};

const dumbHotelByIdHandler = async (req, res, next) => {
    try {
        const result = await dumbHotelById(req.query);
        successResponse(res, result, 'Hotel fetched successfully');
    } catch (err) {
        next(err);
    }
};

module.exports = {
    hotelSearch: hotelSearchHandler,
    hotelSearchFilter: hotelSearchFilterHandler,
    hotelSearchDetails: hotelSearchDetailsHandler,
    dumbHotelById: dumbHotelByIdHandler,
};