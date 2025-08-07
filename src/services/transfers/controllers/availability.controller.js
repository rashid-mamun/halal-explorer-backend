const { successResponse } = require('../../../utils/response.util');
const { postMultipleAvailability } = require('../services/transfer.service');
const { validateMultipleAvailabilityParams, validateMultipleAvailabilityBody } = require('../validators/transfer.validator');

const multipleAvailabilityHandler = async (req, res, next) => {
    try {
        validateMultipleAvailabilityParams(req.params);
        validateMultipleAvailabilityBody(req.body);
        const { language, adults, children, infants } = req.params;
        const availabilityData = req.body;
        const routes = await postMultipleAvailability({ language, adults: parseInt(adults), children: parseInt(children), infants: parseInt(infants), availabilityData });
        successResponse(res, routes, 'Multiple availability request successful');
    } catch (err) {
        next(err);
    }
};

module.exports = {
    multipleAvailability: multipleAvailabilityHandler,
};