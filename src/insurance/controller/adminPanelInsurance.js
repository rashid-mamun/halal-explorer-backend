const {
    addInsurance,
    getAllInsurances,
    getAllInformation,
    searchInsurance,
} = require('../services/adminPanelInsurance');
const Joi = require('joi');

const insuranceSchema = Joi.object({
    travellerType: Joi.string().required(),
    packageName: Joi.string().required(),
    policyType: Joi.string().required(),
    area: Joi.string().required(),
    restType: Joi.string().required(),
    productName: Joi.string().required(),
    ageGroup: Joi.string().required(),
    duration: Joi.string().required(),
    price: Joi.number().required(),
});
const getAllInformationController = async (req, res) => {
    try {
        const result = await getAllInformation();
        if (result.error) {
            return res.status(500).json(result);
        }
        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to retrieve information' });
    }
};
// const createInsurance = async (req, res) => {
//     try {
//         const insuranceData = req.body;
//         const validationResult = insuranceSchema.validate(insuranceData);

//         if (validationResult.error) {
//             return res.status(400).json({ error: validationResult.error.details[0].message });
//         }

//         const result = await addInsurance(insuranceData);

//         if (result.success) {
//             return res.status(201).json(result);
//         } else {
//             return res.status(500).json(result);
//         }
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ error: 'Failed to save/update insurance information' });
//     }
// };
const createInsurance = async (req, res) => {
    try {
        const insuranceDataArray = req.body;

        const results = await Promise.all(
            insuranceDataArray.map(async (insuranceData) => {
                const validationResult = insuranceSchema.validate(insuranceData);
                if (validationResult.error) {
                    return {
                        success: false,
                        error: validationResult.error.details[0].message,
                    };
                }
                return await addInsurance(insuranceData);
            })
        );

        const successResults = results.filter((result) => result.success);
        const errorResults = results.filter((result) => !result.success);

        if (successResults.length === insuranceDataArray.length) {
            return res.status(201).json(
                {
                    success: true,
                    message: `succesfully  save/update insurance information`
                }
            );
        } else {
            return res.status(500).json(errorResults);
        }
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ error: "Failed to save/update insurance information" });
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
const searchInsuranceSchema = Joi.object({
    departureDate: Joi.date().required(),
    arrivalDate: Joi.date().required(),
    travelerDOB: Joi.date().iso().required(),
    mobile: Joi.string().required(),
    email: Joi.string().email().required(),
    country: Joi.string().required(),
    restType: Joi.string().required(),
    residenceCountry: Joi.string().required(),
});

const searchInsuranceController = async (req, res) => {
    try {
        const { error } = searchInsuranceSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const { departureDate, arrivalDate, travelerDOB, mobile, email, country, restType, residenceCountry, } = req.body;

        const insurancePolicies = await searchInsurance(departureDate, arrivalDate, travelerDOB, mobile, email, country, restType, residenceCountry
        );
        return res.status(200).json(insurancePolicies);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Failed to search insurance policies' });
    }
};

module.exports = {
    createInsurance,
    getInsurances,
    getAllInformationController,
    searchInsuranceController,
};
