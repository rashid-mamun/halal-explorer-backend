const Joi = require('joi');
const { saveCruiseEnquiry, getAllCruiseEnquiries } = require('../services/cruise');

// Joi schema for validation
const cruiseEnquirySchema = Joi.object({
    name: Joi.string().required(),
    cruiseId: Joi.string().required(),
    email: Joi.string().email().required(),
    contactNumber: Joi.string().required(),
    guest: Joi.object({
        adult: Joi.number().integer().min(1).required(),
        child: Joi.number().integer().min(0).required(),
    }).required(),
    tickBox: Joi.boolean().required(),
    guestResidency: Joi.string().required(),
    preferredStateroom: Joi.array().items(Joi.string()),
    preferredDate: Joi.string().required(),
    preferredDeparturePort: Joi.string().required(),
});

// Controller function to handle cruise enquiry creation
async function createCruiseEnquiry(req, res) {
    const { error, value } = cruiseEnquirySchema.validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const enquiryData = value;

    try {
        const savedEnquiry = await saveCruiseEnquiry(enquiryData);
        return res.status(201).json(savedEnquiry);
    } catch (err) {
        return res.status(500).json({ error: 'Failed to create cruise enquiry.' });
    }
}
async function getCruiseEnquiries(req, res) {
    try {
        const cruiseEnquiries = await getAllCruiseEnquiries();
        return res.status(200).json(cruiseEnquiries);
    } catch (err) {
        return res.status(500).json({ error: 'Failed to fetch cruise enquiries.' });
    }
}
module.exports = {
    createCruiseEnquiry,
    getCruiseEnquiries,
};
