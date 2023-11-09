const Joi = require('joi');
const {confirmBooking } = require('../services/book')

// Define Joi schemas for different parts of the request body
const paxSchema = Joi.object({
    age: Joi.number().min(0).required(),
    name: Joi.string().required(),
    type: Joi.string().valid('ADULT', 'CHILD').required(),
    surname: Joi.string().required(),
});

const activitySchema = Joi.object({
    preferedLanguage: Joi.string().required(),
    serviceLanguage: Joi.string().required(),
    rateKey: Joi.string().required(),
    from: Joi.date().iso().required(),
    to: Joi.date().iso().required(),
    paxes: Joi.array().items(paxSchema).required(),
});

const holderSchema = Joi.object({
    name: Joi.string().required(),
    title: Joi.string().required(),
    email: Joi.string().email().required(),
    address: Joi.string().required(),
    zipCode: Joi.string().required(),
    mailing: Joi.boolean().required(),
    mailUpdDate: Joi.date().iso().required(),
    country: Joi.string().required(),
    surname: Joi.string().required(),
    telephones: Joi.array().items(Joi.string().required()),
});

const requestBodySchema = Joi.object({
    language: Joi.string().required(),
    clientReference: Joi.string().required(),
    holder: holderSchema.required(),
    activities: Joi.array().items(activitySchema).required(),
});


const activityBook = async (req, res) => {
    try {
        const { error, value } = requestBodySchema.validate(req.body);

        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const bookingData = req.body;
        const result = await confirmBooking(bookingData);

        if (result.success) {
            res.json(result);
        } else {
            res.status(500).json(result);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports={
    activityBook
}