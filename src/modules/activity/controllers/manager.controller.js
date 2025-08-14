const { successResponse } = require('../../../utils/response.util');
const {
    saveOrUpdateManagerInfo,
    getAllManagerInfo,
    getManagerInfo,
    searchHalalManagerActivities,
} = require('../services/manager.service');

const managerInfoHandler = async (req, res, next) => {
    try {
        const manager = await saveOrUpdateManagerInfo(req.body);
        successResponse(res, manager, 'Manager information saved/updated successfully');
    } catch (err) {
        next(err);
    }
};

const getAllManagerInfoHandler = async (req, res, next) => {
    try {
        const { totalManagers, data } = await getAllManagerInfo(req.query);
        successResponse(res, { totalManagers, managers: data }, 'Managers fetched successfully');
    } catch (err) {
        next(err);
    }
};

const getManagerInfoHandler = async (req, res, next) => {
    try {
        const manager = await getManagerInfo(req.query);
        successResponse(res, manager, 'Manager fetched successfully');
    } catch (err) {
        next(err);
    }
};

const managerSearchHandler = async (req, res, next) => {
    try {
        const { totalActivities, data } = await searchHalalManagerActivities(req.query);
        successResponse(res, { totalActivities, activities: data }, 'Halal manager activities search completed successfully');
    } catch (err) {
        next(err);
    }
};

module.exports = {
    managerInfo: managerInfoHandler,
    getAllManagerInfo: getAllManagerInfoHandler,
    getManagerInfo: getManagerInfoHandler,
    managerSearch: managerSearchHandler,
};