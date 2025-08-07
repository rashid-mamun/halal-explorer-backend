const mongoose = require('mongoose');
const Insurance = require('../models/insurance');
const InsuranceBooking = require('../models/insuranceBooking');
const InsuranceConfig = require('../models/insuranceConfig');
const { generateBookingCode } = require('../../../utils/generateBookingCode');

const createPolicyType = async (policyTypeData) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const config = await InsuranceConfig.findOne().session(session) || new InsuranceConfig({});
        const exists = config.policyTypes.some(pt => pt.name === policyTypeData.name);
        if (exists) {
            throw new Error('Policy type already exists');
        }
        config.policyTypes.push(policyTypeData);
        await config.save({ session });
        await session.commitTransaction();
        return { success: true, data: policyTypeData, message: 'Policy type created successfully' };
    } catch (error) {
        await session.abortTransaction();
        return { success: false, error: error.message };
    } finally {
        session.endSession();
    }
};

const getPolicyTypes = async () => {
    try {
        const config = await InsuranceConfig.findOne();
        return { success: true, data: config ? config.policyTypes : [], message: config && config.policyTypes.length === 0 ? 'No policy types found' : undefined };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

const createArea = async (areaData) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const config = await InsuranceConfig.findOne().session(session) || new InsuranceConfig({});
        const exists = config.areas.some(a => a.name === areaData.name);
        if (exists) {
            throw new Error('Area already exists');
        }
        config.areas.push(areaData);
        await config.save({ session });
        await session.commitTransaction();
        return { success: true, data: areaData, message: 'Area created successfully' };
    } catch (error) {
        await session.abortTransaction();
        return { success: false, error: error.message };
    } finally {
        session.endSession();
    }
};

const getAreas = async () => {
    try {
        const config = await InsuranceConfig.findOne();
        return { success: true, data: config ? config.areas : [], message: config && config.areas.length === 0 ? 'No areas found' : undefined };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

const createCountry = async (countryData) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const config = await InsuranceConfig.findOne().session(session) || new InsuranceConfig({});
        const exists = config.countries.some(c => c.name === countryData.name);
        if (exists) {
            throw new Error('Country already exists');
        }
        config.countries.push(countryData);
        await config.save({ session });
        await session.commitTransaction();
        return { success: true, data: countryData, message: 'Country created successfully' };
    } catch (error) {
        await session.abortTransaction();
        return { success: false, error: error.message };
    } finally {
        session.endSession();
    }
};

const getCountries = async () => {
    try {
        const config = await InsuranceConfig.findOne();
        return { success: true, data: config ? config.countries : [], message: config && config.countries.length === 0 ? 'No countries found' : undefined };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

const createTravellerType = async (travellerTypeData) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const config = await InsuranceConfig.findOne().session(session) || new InsuranceConfig({});
        const exists = config.travellerTypes.some(t => t.name === travellerTypeData.name);
        if (exists) {
            throw new Error('Traveller type already exists');
        }
        config.travellerTypes.push(travellerTypeData);
        await config.save({ session });
        await session.commitTransaction();
        return { success: true, data: travellerTypeData, message: 'Traveller type created successfully' };
    } catch (error) {
        await session.abortTransaction();
        return { success: false, error: error.message };
    } finally {
        session.endSession();
    }
};

const getTravellerTypes = async () => {
    try {
        const config = await InsuranceConfig.findOne();
        return { success: true, data: config ? config.travellerTypes : [], message: config && config.travellerTypes.length === 0 ? 'No traveller types found' : undefined };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

const createRestType = async (restTypeData) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const config = await InsuranceConfig.findOne().session(session) || new InsuranceConfig({});
        const exists = config.restTypes.some(r => r.name === restTypeData.name);
        if (exists) {
            throw new Error('Rest type already exists');
        }
        config.restTypes.push(restTypeData);
        await config.save({ session });
        await session.commitTransaction();
        return { success: true, data: restTypeData, message: 'Rest type created successfully' };
    } catch (error) {
        await session.abortTransaction();
        return { success: false, error: error.message };
    } finally {
        session.endSession();
    }
};

const getRestTypes = async () => {
    try {
        const config = await InsuranceConfig.findOne();
        return { success: true, data: config ? config.restTypes : [], message: config && config.restTypes.length === 0 ? 'No rest types found' : undefined };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

const createAgeGroup = async (ageGroupData) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const config = await InsuranceConfig.findOne().session(session) || new InsuranceConfig({});
        const exists = config.ageGroups.some(a => a.name === ageGroupData.name);
        if (exists) {
            throw new Error('Age group already exists');
        }
        config.ageGroups.push(ageGroupData);
        await config.save({ session });
        await session.commitTransaction();
        return { success: true, data: ageGroupData, message: 'Age group created successfully' };
    } catch (error) {
        await session.abortTransaction();
        return { success: false, error: error.message };
    } finally {
        session.endSession();
    }
};

const getAgeGroups = async () => {
    try {
        const config = await InsuranceConfig.findOne();
        return { success: true, data: config ? config.ageGroups : [], message: config && config.ageGroups.length === 0 ? 'No age groups found' : undefined };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

const createPlan = async (planData) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { travellerType, policyType, area, restType, productName, ageGroup, country, duration } = planData;
        const config = await InsuranceConfig.findOne().session(session);
        if (!config) {
            throw new Error('Insurance configuration not found');
        }
        const checks = [
            config.travellerTypes.some(t => t.name === travellerType),
            config.policyTypes.some(p => p.name === policyType),
            config.areas.some(a => a.name === area),
            config.restTypes.some(r => r.name === restType),
            config.productNames.some(p => p.name === productName),
            config.ageGroups.some(a => a.name === ageGroup),
            config.countries.some(c => c.name === country),
            config.durations.some(d => d.name === duration),
        ];
        if (checks.some(check => !check)) {
            throw new Error('One or more configuration values are invalid');
        }
        const existingPlan = await Insurance.findOne({
            policyName: planData.policyName,
            travellerType,
            policyType,
            area,
            restType,
            productName,
            ageGroup,
            country,
            duration,
        }).session(session);
        if (existingPlan) {
            throw new Error('Insurance plan already exists');
        }
        const insurancePlan = new Insurance(planData);
        await insurancePlan.save({ session });
        await session.commitTransaction();
        return { success: true, data: insurancePlan, message: 'Insurance plan created successfully' };
    } catch (error) {
        await session.abortTransaction();
        return { success: false, error: error.message };
    } finally {
        session.endSession();
    }
};

const getPlans = async () => {
    try {
        const plans = await Insurance.find({});
        return { success: true, data: plans, message: plans.length === 0 ? 'No insurance plans found' : undefined };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

const getPlanById = async (id) => {
    try {
        if (!mongoose.isValidObjectId(id)) {
            return { success: false, error: 'Invalid insurance plan ID' };
        }
        const plan = await Insurance.findById(id);
        if (!plan) {
            return { success: false, error: 'Insurance plan not found' };
        }
        return { success: true, data: plan };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

const updatePlan = async (id, planData) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        if (!mongoose.isValidObjectId(id)) {
            throw new Error('Invalid insurance plan ID');
        }
        const { travellerType, policyType, area, restType, productName, ageGroup, country, duration } = planData;
        const config = await InsuranceConfig.findOne().session(session);
        if (!config) {
            throw new Error('Insurance configuration not found');
        }
        const checks = [
            config.travellerTypes.some(t => t.name === travellerType),
            config.policyTypes.some(p => p.name === policyType),
            config.areas.some(a => a.name === area),
            config.restTypes.some(r => r.name === restType),
            config.productNames.some(p => p.name === productName),
            config.ageGroups.some(a => a.name === ageGroup),
            config.countries.some(c => c.name === country),
            config.durations.some(d => d.name === duration),
        ];
        if (checks.some(check => !check)) {
            throw new Error('One or more configuration values are invalid');
        }
        const updatedPlan = await Insurance.findByIdAndUpdate(id, { $set: planData }, { new: true, session });
        if (!updatedPlan) {
            throw new Error('Insurance plan not found');
        }
        await session.commitTransaction();
        return { success: true, data: updatedPlan, message: 'Insurance plan updated successfully' };
    } catch (error) {
        await session.abortTransaction();
        return { success: false, error: error.message };
    } finally {
        session.endSession();
    }
};

const deletePlan = async (id) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        if (!mongoose.isValidObjectId(id)) {
            throw new Error('Invalid insurance plan ID');
        }
        const result = await Insurance.findByIdAndDelete(id, { session });
        if (!result) {
            throw new Error('Insurance plan not found');
        }
        await session.commitTransaction();
        return { success: true, message: 'Insurance plan deleted successfully' };
    } catch (error) {
        await session.abortTransaction();
        return { success: false, error: error.message };
    } finally {
        session.endSession();
    }
};

const bookInsurance = async (bookingData) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { policyId, travellerDetails: { travellerType, ageGroup }, coverageDetails: { country } } = bookingData;
        const policy = await Insurance.findById(policyId).session(session);
        if (!policy) {
            throw new Error('Insurance policy not found');
        }
        const config = await InsuranceConfig.findOne().session(session);
        if (!config) {
            throw new Error('Insurance configuration not found');
        }
        const checks = [
            config.travellerTypes.some(t => t.name === travellerType),
            config.ageGroups.some(a => a.name === ageGroup),
            config.countries.some(c => c.name === country),
        ];
        if (checks.some(check => !check)) {
            throw new Error('One or more configuration values are invalid');
        }
        const booking = new InsuranceBooking({
            ...bookingData,
            partnerOrderId: `INS${generateBookingCode()}`,
            email: bookingData.contractDetails.email,
        });
        await booking.save({ session });
        await session.commitTransaction();
        return { success: true, data: booking, message: 'Insurance booking created successfully' };
    } catch (error) {
        await session.abortTransaction();
        return { success: false, error: error.message };
    } finally {
        session.endSession();
    }
};

const getAllBookings = async () => {
    try {
        const bookings = await InsuranceBooking.find({});
        return { success: true, data: bookings, message: bookings.length === 0 ? 'No insurance bookings found' : undefined };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

const getBookingById = async (id) => {
    try {
        if (!mongoose.isValidObjectId(id)) {
            return { success: false, error: 'Invalid insurance booking ID' };
        }
        const booking = await InsuranceBooking.findById(id);
        if (!booking) {
            return { success: false, error: 'Insurance booking not found' };
        }
        return { success: true, data: booking };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

const getBookingsByEmail = async (email) => {
    try {
        const bookings = await InsuranceBooking.find({ email });
        return { success: true, data: bookings, message: bookings.length === 0 ? 'No insurance bookings found for the provided email' : undefined };
    } catch (error) {
        return { success: false, error: error.message };
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