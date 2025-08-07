const { successResponse } = require('../../../utils/response.util');
const {
    saveOrUpdateHotelInfo,
    getAllHalalHotelInfo,
    getHalalHotelInfo,
    saveOrUpdateStructure,
    getHalalRatingStructure,
} = require('../services/halalHotel.service');

const rateHotelHandler = async (req, res, next) => {
    try {
        const result = await saveOrUpdateHotelInfo(req.body);
        successResponse(res, result, result.message);
    } catch (err) {
        next(err);
    }
};

const getAllHalalHotelHandler = async (req, res, next) => {
    try {
        const result = await getAllHalalHotelInfo(req.query);
        successResponse(res, result, result.message);
    } catch (err) {
        next(err);
    }
};

const getHalalHotelHandler = async (req, res, next) => {
    try {
        const result = await getHalalHotelInfo(req.query);
        successResponse(res, result, result.message);
    } catch (err) {
        next(err);
    }
};

const halalRatingStructureHandler = async (req, res, next) => {
    try {
        const result = await saveOrUpdateStructure(req.body);
        successResponse(res, result, result.message);
    } catch (err) {
        next(err);
    }
};

const getHalalRatingStructureHandler = async (req, res, next) => {
    try {
        const result = await getHalalRatingStructure();
        successResponse(res, result, result.message);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    rateHotel: rateHotelHandler,
    getAllHalalHotel: getAllHalalHotelHandler,
    getHalalHotel: getHalalHotelHandler,
    halalRatingStructure: halalRatingStructureHandler,
    getHalalRatingStructure: getHalalRatingStructureHandler,
};