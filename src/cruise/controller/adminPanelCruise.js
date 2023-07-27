const Joi = require('joi');
const { createCruisePackage, getAllCruisePackages } = require('../services/adminPanelCruise');

// Define Joi schema for validation
const cruisePackageSchema = Joi.object({
    destination: Joi.string().required(),
    cruiseLine: Joi.string().required(),
    ship: Joi.string().required(),
    sailingDates: Joi.array().items(Joi.string()).required(),
    length: Joi.string().required(),
    commentForLength: Joi.string().allow('').required(),
    itinerary: Joi.object().pattern(Joi.string(), Joi.string()).required(),
    gallery: Joi.array().items(Joi.string()).optional(),
    shipFacts: Joi.object().pattern(Joi.string(), Joi.string()).required(),
    shipInfo: Joi.object().pattern(Joi.string(), Joi.string()).required(),
    policies: Joi.object().pattern(Joi.string(), Joi.string()).required(),
    roomTypes: Joi.object().pattern(Joi.string(), Joi.string()).required(),
    price: Joi.object({
        startsFrom: Joi.string().required(),
    }).required(),
});

async function createCruisePackageController(req, res) {
    try {
        // Validate the request body using Joi schema
        const { error: validationError } = cruisePackageSchema.validate(req.body, {
            abortEarly: false,
        });

        if (validationError) {
            // If validation fails, return the error details
            const validationErrorMessage = validationError.details.map((err) => err.message);
            return res.status(400).json({ error: validationErrorMessage });
        }

        // Prepare the cruise package data object
        const {
            destination,
            cruiseLine,
            ship,
            sailingDates,
            length,
            commentForLength,
            itinerary,
            gallery,
            shipFacts,
            shipInfo,
            policies,
            roomTypes,
            price,
        } = req.body;

        const cruisePackageData = {
            destination,
            cruiseLine,
            ship,
            sailingDates,
            length,
            commentForLength,
            itinerary,
            gallery,
            shipFacts,
            shipInfo,
            policies,
            roomTypes,
            price,
        };

        // Save the cruise package
        const result = await createCruisePackage(cruisePackageData);

        if (result.success) {
            return res.status(201).json(result);
        } else {
            return res.status(400).json(result);
        }
    } catch (err) {
        console.error('Error creating cruise package:', err);
        return res.status(500).json({ error: 'Failed to create cruise package.' });
    }
}
async function getAllCruisePackagesController(req, res) {
    try {
        const cruisePackages = await getAllCruisePackages();
        res.status(200).json(cruisePackages);
    } catch (err) {
        console.error('Error fetching cruise packages:', err);
        res.status(500).json({ error: 'Failed to fetch cruise packages.' });
    }
}
module.exports = {
    createCruisePackageController,
    getAllCruisePackagesController,
};
