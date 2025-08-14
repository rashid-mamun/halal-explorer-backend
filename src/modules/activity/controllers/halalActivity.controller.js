const { successResponse } = require('../../../utils/response.util');
const {
    saveOrUpdateActivityInfo,
    getAllHalalActivity,
    getHalalActivity,
    saveOrUpdateStructure,
    getHalalRatingStructure,
} = require('../services/halalActivity.service');

const rateActivityHandler = async (req, res, next) => {
    try {
        const activity = await saveOrUpdateActivityInfo(req.body);
        successResponse(res, activity, 'Activity rated successfully');
    } catch (err) {
        next(err);
    }
};

const getAllHalalActivityHandler = async (req, res, next) => {
    try {
        const { totalActivities, data } = await getAllHalalActivity(req.query);
        successResponse(res, { totalActivities, activities: data }, 'Halal activities fetched successfully');
    } catch (err) {
        next(err);
    }
};

const getHalalActivityHandler = async (req, res, next) => {
    try {
        const activity = await getHalalActivity(req.query);
        successResponse(res, activity, 'Halal activity fetched successfully');
    } catch (err) {
        next(err);
    }
};

const halalRatingStructureHandler = async (req, res, next) => {
    try {
        const structure = await saveOrUpdateStructure(req.body);
        successResponse(res, structure, 'Halal rating structure saved/updated successfully');
    } catch (err) {
        next(err);
    }
};

const getHalalRatingStructureHandler = async (req, res, next) => {
    try {
        const structure = await getHalalRatingStructure();
        successResponse(res, structure, 'Halal rating structure fetched successfully');
    } catch (err) {
        next(err);
    }
};

module.exports = {
    rateActivity: rateActivityHandler,
    getAllHalalActivity: getAllHalalActivityHandler,
    getHalalActivity: getHalalActivityHandler,
    halalRatingStructure: halalRatingStructureHandler,
    getHalalRatingStructure: getHalalRatingStructureHandler,
};