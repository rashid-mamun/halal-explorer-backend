const Activity = require('../models/activity.model');
const ActivityManager = require('../models/activityManager.model');
const AppError = require('../../../utils/appError');
const { validateManagerInfo, validateSearchHalalManagerActivities } = require('../validators/activity.validator');

const saveOrUpdateManagerInfo = async (managerInfo) => {
    validateManagerInfo(managerInfo);
    const updatedManager = await ActivityManager.findOneAndUpdate(
        { id: managerInfo.id },
        { $set: managerInfo },
        { upsert: true, new: true }
    );
    return updatedManager;
};

const getAllManagerInfo = async (query) => {
    const { page = 1, pageSize = 100 } = query;
    const managers = await ActivityManager.find().lean();
    const totalManagers = managers.length;
    if (totalManagers === 0) {
        throw new AppError('Managers not found', 404);
    }

    const maxPageNumber = Math.ceil(totalManagers / pageSize);
    if (page > maxPageNumber) {
        throw new AppError('Invalid page number', 400);
    }

    const offset = (page - 1) * pageSize;
    const paginatedData = managers.slice(offset, offset + pageSize);
    return { totalManagers, data: paginatedData };
};

const getManagerInfo = async (query) => {
    const manager = await ActivityManager.findOne({ id: query.id }).lean();
    if (!manager) {
        throw new AppError('Manager not found', 404);
    }
    return manager;
};

const searchHalalManagerActivities = async (query) => {
    validateSearchHalalManagerActivities(query);
    const { city, activityName, page = 1, pageSize = 100 } = query;
    const keyword = city || activityName;
    const field = city ? 'address' : 'activityCode';

    const activities = await Activity.find(
        { [field]: { $regex: keyword, $options: 'i' }, halalRatings: { $exists: true, $ne: [] } },
        { address: 1, activityCode: 1, name: 1, contentId: 1, location: 1, halalRatings: 1, star_rating: 1 }
    ).lean();

    const totalActivities = activities.length;
    if (totalActivities === 0) {
        throw new AppError('Activities not found', 404);
    }

    const maxPageNumber = Math.ceil(totalActivities / pageSize);
    if (page > maxPageNumber) {
        throw new AppError('Invalid page number', 400);
    }

    const offset = (page - 1) * pageSize;
    const paginatedData = activities.slice(offset, offset + pageSize);
    return { totalActivities, data: paginatedData };
};

module.exports = {
    saveOrUpdateManagerInfo,
    getAllManagerInfo,
    getManagerInfo,
    searchHalalManagerActivities,
};