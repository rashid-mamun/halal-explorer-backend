const Joi = require('joi');
const { saveCruiseEnquiry, getAllCruiseEnquiries } = require('../services/cruise');
const cruiseService = require('../services/index');

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

const cruiseBookSchema = Joi.object({
    priceDetails: Joi.object().required(),
    paymentDetails: Joi.object().required(),
    orderInfo: Joi.object().required(),
    userInfo: Joi.object().required(),
});
const cruiseBook = async (req, res) => {
    const { error } = cruiseBookSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        console.log("---- cruise book calling ----------");
        const cruises = await cruiseService.bookCruise(req.body);
        return res.json(cruises);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
const getAllBookings = async (req, res) => {
    try {
        console.log("---- Get book calling ----------");
        const allBookings = await cruiseService.getAllBookings();
        res.json(allBookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getBookingsByEmail = async (req, res) => {
    const { email } = req.params;

    try {
        console.log("---- Get email book calling ----------", email);
        const matchingBookings = await cruiseService.getBookingsByEmail(email);
        res.json(matchingBookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
module.exports = {
    createCruiseEnquiry,
    getCruiseEnquiries,
    cruiseBook,
    getAllBookings,
    getBookingsByEmail
};
