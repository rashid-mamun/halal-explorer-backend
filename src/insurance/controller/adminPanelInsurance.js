const { addInsurance, getAllInsurances } = require('../services/adminPanelInsurance');
const Joi = require('joi');

const insuranceSchema = Joi.object({
    travellerType: Joi.string().required(),
    policyType: Joi.string().required(),
    area: Joi.string().required(),
    restType: Joi.string().required(),
    productName: Joi.string().required(),
    ageGroup: Joi.string().required(),
    duration: Joi.string().required(),
    price: Joi.number().required(),
});

const createInsurance = async (req, res) => {
    try {
        const insuranceData = req.body;
        const validationResult = insuranceSchema.validate(insuranceData);

        if (validationResult.error) {
            return res.status(400).json({ error: validationResult.error.details[0].message });
        }

        const result = await addInsurance(insuranceData);

        if (result.success) {
            return res.status(201).json(result);
        } else {
            return res.status(500).json(result);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to save/update insurance information' });
    }
};

const getInsurances = async (req, res) => {
    try {
        const result = await getAllInsurances();

        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(500).json(result);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to retrieve insurances' });
    }
};

module.exports = {
    createInsurance,
    getInsurances,
};
