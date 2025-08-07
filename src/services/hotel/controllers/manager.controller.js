const { successResponse } = require('../../../utils/response.util');
const {
    saveOrUpdateManagerInfo,
    getAllManagerInfo,
    getManagerInfo,
    searchHalalManagerHotels,
} = require('../services/manager.service');

const managerInfoHandler = async (req, res, next) => {
    try {
        const result = await saveOrUpdateManagerInfo(req.body);
        successResponse(res, result, result.message);
    } catch (err) {
        next(err);
    }
};

const getAllManagerInfoHandler = async (req, res, next) => {
    try {
        const result = await getAllManagerInfo(req.query);
        successResponse(res, result, result.message);
    } catch (err) {
        next(err);
    }
};

const getManagerInfoHandler = async (req, res, next) => {
    try {
        const result = await getManagerInfo(req.query);
        successResponse(res, result, result.message);
    } catch (err) {
        next(err);
    }
};

const managerSearchHandler = async (req, res, next) => {
    try {
        const result = await searchHalalManagerHotels(req.query);
        successResponse(res, result, 'Halal manager hotels search completed successfully');
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