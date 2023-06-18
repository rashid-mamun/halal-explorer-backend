const hotelService = require("../services/index");
const Joi = require('joi');

const hotelSearchSchema = Joi.object({
    city: Joi.string().required(),
    checkin: Joi.string().required(),
    checkout: Joi.string().required(),
    guests: Joi.string().required(),
    currency: Joi.string().required(),
    residency: Joi.string().required()
});

const hotelSearchDetailsSchema = Joi.object({
    checkin: Joi.string().required(),
    checkout: Joi.string().required(),
    guests: Joi.string().required(),
    currency: Joi.string().required(),
    residency: Joi.string().required(),
    id: Joi.string().required()
});

const dumbHotelByIdSchema = Joi.object({
    id: Joi.string().required()
});

const validateRequest = (data, schema) => {
    const { error } = schema.validate(data);
    return error ? error.details[0].message : null;
};

exports.hotelSearch = async (req, res) => {
    const queryParams = req.query;

    const validationError = validateRequest(queryParams, hotelSearchSchema);
    if (validationError) {
        return res.status(400).json({
            success: false,
            error: validationError
        });
    }

    try {
        console.log("---- hotel search calling ----------", queryParams);
        const hotels = await hotelService.searchHotels(queryParams);
        return res.json(hotels);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

exports.hotelSearchDetails = async (req, res) => {
    const queryParams = req.query;

    const validationError = validateRequest(queryParams, hotelSearchDetailsSchema);
    if (validationError) {
        return res.status(400).json({
            success: false,
            error: validationError
        });
    }

    try {
        console.log("---- hotel search Details calling ----------", queryParams);
        const hotels = await hotelService.searchHotelDetails(queryParams);
        return res.json(hotels);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

exports.dumbHotelById = async (req, res) => {
    const queryParams = req.query;

    const validationError = validateRequest(queryParams, dumbHotelByIdSchema);
    if (validationError) {
        return res.status(400).json({
            success: false,
            error: validationError
        });
    }

    try {
        console.log("---- Dumb hotel Details calling ----------", queryParams);
        const hotels = await hotelService.dumbHotelById(queryParams);
        return res.json(hotels);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
