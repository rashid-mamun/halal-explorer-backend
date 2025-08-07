const { validateCruisePackage, validateCruiseLine, validateShip, validateCruiseBooking, validateCruiseEnquiry } = require('../../../utils/validation');
const cruiseService = require('../services/cruiseService');
const bookingService = require('../services/bookingService');

const createOrUpdateCruisePackage = async (req, res) => {
    try {
        const { error, value } = validateCruisePackage(req.body);
        if (error) {
            return res.status(400).json({ error: error.details.map(err => err.message).join(', ') });
        }
        const result = await cruiseService.createOrUpdateCruisePackage(value, req.files);
        return result.success
            ? res.status(201).json(result)
            : res.status(400).json({ error: result.error });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create or update cruise package' });
    }
};

const getAllCruisePackages = async (req, res) => {
    try {
        const result = await cruiseService.getAllCruisePackages();
        return result.success
            ? res.status(200).json(result.data)
            : res.status(500).json({ error: result.error });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch cruise packages' });
    }
};

const deleteCruisePackage = async (req, res) => {
    try {
        const result = await cruiseService.deleteCruisePackage(req.params.packageId);
        return result.success
            ? res.status(204).json({ message: result.message })
            : res.status(404).json({ error: result.error });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to delete cruise package' });
    }
};

const searchCruisePackageById = async (req, res) => {
    try {
        const result = await cruiseService.searchCruisePackageById(req.params.packageId);
        return result.success
            ? res.status(200).json(result.data)
            : res.status(404).json({ error: result.error });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch cruise package' });
    }
};

const createCruiseLine = async (req, res) => {
    try {
        const { error, value } = validateCruiseLine(req.body);
        if (error) {
            return res.status(400).json({ error: error.details.map(err => err.message).join(', ') });
        }
        const result = await cruiseService.createCruiseLine(value, req.files);
        return result.success
            ? res.status(201).json(result)
            : res.status(400).json({ error: result.error });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create cruise line' });
    }
};

const createShip = async (req, res) => {
    try {
        const { error, value } = validateShip(req.body);
        if (error) {
            return res.status(400).json({ error: error.details.map(err => err.message).join(', ') });
        }
        const result = await cruiseService.createShip(value, req.files);
        return result.success
            ? res.status(201).json(result)
            : res.status(400).json({ error: result.error });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create ship' });
    }
};

const createBooking = async (req, res) => {
    try {
        const { error, value } = validateCruiseBooking(req.body);
        if (error) {
            return res.status(400).json({ error: error.details.map(err => err.message).join(', ') });
        }
        const result = await bookingService.createBooking(value);
        return result.success
            ? res.status(201).json(result)
            : res.status(400).json({ error: result.error });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create cruise booking' });
    }
};

const getAllBookings = async (req, res) => {
    try {
        const result = await bookingService.getAllBookings();
        return result.success
            ? res.status(200).json(result.data)
            : res.status(500).json({ error: result.error });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch cruise bookings' });
    }
};

const getBookingById = async (req, res) => {
    try {
        const result = await bookingService.getBookingById(req.query.id);
        return result.success
            ? res.status(200).json(result.data)
            : res.status(404).json({ error: result.error });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch cruise booking' });
    }
};

const getBookingsByEmail = async (req, res) => {
    try {
        const result = await bookingService.getBookingsByEmail(req.params.userEmail);
        return result.success
            ? res.status(200).json(result.data)
            : res.status(500).json({ error: result.error });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch cruise bookings by email' });
    }
};

const createEnquiry = async (req, res) => {
    try {
        const { error, value } = validateCruiseEnquiry(req.body);
        if (error) {
            return res.status(400).json({ error: error.details.map(err => err.message).join(', ') });
        }
        const result = await bookingService.createEnquiry(value);
        return result.success
            ? res.status(201).json(result)
            : res.status(400).json({ error: result.error });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create cruise enquiry' });
    }
};

const getAllEnquiries = async (req, res) => {
    try {
        const result = await bookingService.getAllEnquiries();
        return result.success
            ? res.status(200).json(result.data)
            : res.status(500).json({ error: result.error });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch cruise enquiries' });
    }
};

const getEnquiryById = async (req, res) => {
    try {
        const result = await bookingService.getEnquiryById(req.query.id);
        return result.success
            ? res.status(200).json(result.data)
            : res.status(404).json({ error: result.error });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch cruise enquiry' });
    }
};

module.exports = {
    createOrUpdateCruisePackage,
    getAllCruisePackages,
    deleteCruisePackage,
    searchCruisePackageById,
    createCruiseLine,
    createShip,
    createBooking,
    getAllBookings,
    getBookingById,
    getBookingsByEmail,
    createEnquiry,
    getAllEnquiries,
    getEnquiryById,
};