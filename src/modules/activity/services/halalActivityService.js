const Activity = require('../models/activity.model');
const Config = require('../models/config.model');
const AppError = require('../../../utils/appError');
const { validateActivityInfo, validateStructure, validateGetActivity } = require('../validators/activity.validator');

const saveOrUpdateActivityInfo = async (activityInfo) => {
    validateActivityInfo(activityInfo);
    const totalRating = activityInfo.ratings.reduce((total, rating) => total + rating.rating, 0);
    if (totalRating > 100) {
        throw new AppError('Total rating exceeds 100', 400);
    }

    const updatedActivity = await Activity.findOneAndUpdate(
        { activityCode: activityInfo.code },
        { $set: { halalRatings: activityInfo.ratings, star_rating: totalRating } },
        { upsert: true, new: true }
    );

    return updatedActivity;
};

const getAllHalalActivity = async (query) => {
    const { page = 1, pageSize = 100 } = query;
    const activities = await Activity.find({ halalRatings: { $exists: true, $ne: [] } }).lean();
    const totalActivities = activities.length;
    if (totalActivities === 0) {
        throw new AppError('Halal activities not found', 404);
    }

    const maxPageNumber = Math.ceil(totalActivities / pageSize);
    if (page > maxPageNumber) {
        throw new AppError('Invalid page number', 400);
    }

    const offset = (page - 1) * pageSize;
    const paginatedData = activities.slice(offset, offset + pageSize);
    return { totalActivities, data: paginatedData };
};

const getHalalActivity = async (query) => {
    validateGetActivity(query);
    const activity = await Activity.findOne({ activityCode: query.code, halalRatings: { $exists: true, $ne: [] } }).lean();
    if (!activity) {
        throw new AppError('Halal activity not found', 404);
    }
    return activity;
};

const saveOrUpdateStructure = async (structureInfo) => {
    validateStructure(structureInfo);
    const totalRating = structureInfo.ratings.reduce((total, rating) => total + rating.rating, 0);
    if (totalRating > 100) {
        throw new AppError('Total rating exceeds 100', 400);
    }

    const updatedStructure = await Config.findOneAndUpdate(
        { id: 'halalActivityStructure', type: 'halalActivityStructure' },
        { $set: { data: { ratings: structureInfo.ratings, star_rating: totalRating } } },
        { upsert: true, new: true }
    );

    return updatedStructure.data;
};

const getHalalRatingStructure = async () => {
    const structure = await Config.findOne({ id: 'halalActivityStructure', type: 'halalActivityStructure' }).lean();
    if (!structure) {
        throw new AppError('Halal rating structure not found', 404);
    }
    return structure.data;
};

module.exports = {
    saveOrUpdateActivityInfo,
    getAllHalalActivity,
    getHalalActivity,
    saveOrUpdateStructure,
    getHalalRatingStructure,
};