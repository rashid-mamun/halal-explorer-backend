const {
    validatePolicyType,
    validateArea,
    validateCountry,
    validateTravellerType,
    validateRestType,
    validateAgeGroup,
    validateInsurancePlan,
    validateInsuranceBooking
} = require('../../../utils/validation');
const insuranceService = require('../services/insuranceService');

const createPolicyType = async (req, res) => {
    try {
        const { error, value } = validatePolicyType(req.body);
        if (error) {
            return res.status(400).json({ error: error.details.map(err => err.message).join(', ') });
        }
        const result = await insuranceService.createPolicyType(value);
        return result.success
            ? res.status(201).json(result)
            : res.status(400).json({ error: result.error });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create policy type' });
    }
};

const getPolicyTypes = async (req, res) => {
    try {
        const result = await insuranceService.getPolicyTypes();
        return result.success
            ? res.status(200).json(result.data)
            : res.status(500).json({ error: result.error });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch policy types' });
    }
};

const createArea = async (req, res) => {
    try {
        const { error, value } = validateArea(req.body);
        if (error) {
            return res.status(400).json({ error: error.details.map(err => err.message).join(', ') });
        }
        const result = await insuranceService.createArea(value);
        return result.success
            ? res.status(201).json(result)
            : res.status(400).json({ error: result.error });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create area' });
    }
};

const getAreas = async (req, res) => {
    try {
        const result = await insuranceService.getAreas();
        return result.success
            ? res.status(200).json(result.data)
            : res.status(500).json({ error: result.error });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch areas' });
    }
};

const createCountry = async (req, res) => {
    try {
        const { error, value } = validateCountry(req.body);
        if (error) {
            return res.status(400).json({ error: error.details.map(err => err.message).join(', ') });
        }
        const result = await insuranceService.createCountry(value);
        return result.success
            ? res.status(201).json(result)
            : res.status(400).json({ error: result.error });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create country' });
    }
};

const getCountries = async (req, res) => {
    try {
        const result = await insuranceService.getCountries();
        return result.success
            ? res.status(200).json(result.data)
            : res.status(500).json({ error: result.error });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch countries' });
    }
};

const createTravellerType = async (req, res) => {
    try {
        const { error, value } = validateTravellerType(req.body);
        if (error) {
            return res.status(400).json({ error: error.details.map(err => err.message).join(', ') });
        }
        const result = await insuranceService.createTravellerType(value);
        return result.success
            ? res.status(201).json(result)
            : res.status(400).json({ error: result.error });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create traveller type' });
    }
};

const getTravellerTypes = async (req, res) => {
    try {
        const result = await insuranceService.getTravellerTypes();
        return result.success
            ? res.status(200).json(result.data)
            : res.status(500).json({ error: result.error });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch traveller types' });
    }
};

const createRestType = async (req, res) => {
    try {
        const { error, value } = validateRestType(req.body);
        if (error) {
            return res.status(400).json({ error: error.details.map(err => err.message).join(', ') });
        }
        const result = await insuranceService.createRestType(value);
        return result.success
            ? res.status(201).json(result)
            : res.status(400).json({ error: result.error });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create rest type' });
    }
};

const getRestTypes = async (req, res) => {
    try {
        const result = await insuranceService.getRestTypes();
        return result.success
            ? res.status(200).json(result.data)
            : res.status(500).json({ error: result.error });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch rest types' });
    }
};

const createAgeGroup = async (req, res) => {
    try {
        const { error, value } = validateAgeGroup(req.body);
        if (error) {
            return res.status(400).json({ error: error.details.map(err => err.message).join(', ') });
        }
        const result = await insuranceService.createAgeGroup(value);
        return result.success
            ? res.status(201).json(result)
            : res.status(400).json({ error: result.error });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create age group' });
    }
};

const getAgeGroups = async (req, res) => {
    try {
        const result = await insuranceService.getAgeGroups();
        return result.success
            ? res.status(200).json(result.data)
            : res.status(500).json({ error: result.error });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch age groups' });
    }
};

const createPlan = async (req, res) => {
    try {
        const { error, value } = validateInsurancePlan(req.body);
        if (error) {
            return res.status(400).json({ error: error.details.map(err => err.message).join(', ') });
        }
        const result = await insuranceService.createPlan(value);
        return result.success
            ? res.status(201).json(result)
            : res.status(400).json({ error: result.error });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create insurance plan' });
    }
};

const getPlans = async (req, res) => {
    try {
        const result = await insuranceService.getPlans();
        return result.success
            ? res.status(200).json(result.data)
            : res.status(500).json({ error: result.error });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch insurance plans' });
    }
};

const getPlanById = async (req, res) => {
    try {
        const result = await insuranceService.getPlanById(req.params.planId);
        return result.success
            ? res.status(200).json(result.data)
            : res.status(404).json({ error: result.error });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch insurance plan' });
    }
};

const updatePlan = async (req, res) => {
    try {
        const { error, value } = validateInsurancePlan(req.body);
        if (error) {
            return res.status(400).json({ error: error.details.map(err => err.message).join(', ') });
        }
        const result = await insuranceService.updatePlan(req.params.planId, value);
        return result.success
            ? res.status(200).json(result)
            : res.status(404).json({ error: result.error });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update insurance plan' });
    }
};

const deletePlan = async (req, res) => {
    try {
        const result = await insuranceService.deletePlan(req.params.planId);
        return result.success
            ? res.status(204).json({ message: result.message })
            : res.status(404).json({ error: result.error });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to delete insurance plan' });
    }
};

const bookInsurance = async (req, res) => {
    try {
        const { error, value } = validateInsuranceBooking(req.body);
        if (error) {
            return res.status(400).json({ error: error.details.map(err => err.message).join(', ') });
        }
        const result = await insuranceService.bookInsurance(value);
        return result.success
            ? res.status(201).json(result)
            : res.status(400).json({ error: result.error });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to book insurance' });
    }
};

const getAllBookings = async (req, res) => {
    try {
        const result = await insuranceService.getAllBookings();
        return result.success
            ? res.status(200).json(result.data)
            : res.status(500).json({ error: result.error });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch insurance bookings' });
    }
};

const getBookingById = async (req, res) => {
    try {
        const result = await insuranceService.getBookingById(req.params.bookingId);
        return result.success
            ? res.status(200).json(result.data)
            : res.status(404).json({ error: result.error });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch insurance booking' });
    }
};

const getBookingsByEmail = async (req, res) => {
    try {
        const result = await insuranceService.getBookingsByEmail(req.params.userEmail);
        return result.success
            ? res.status(200).json(result.data)
            : res.status(500).json({ error: result.error });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch insurance bookings by email' });
    }
};

module.exports = {
    createPolicyType,
    getPolicyTypes,
    createArea,
    getAreas,
    createCountry,
    getCountries,
    createTravellerType,
    getTravellerTypes,
    createRestType,
    getRestTypes,
    createAgeGroup,
    getAgeGroups,
    createPlan,
    getPlans,
    getPlanById,
    updatePlan,
    deletePlan,
    bookInsurance,
    getAllBookings,
    getBookingById,
    getBookingsByEmail,
};