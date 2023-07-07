const { getClient } = require("../../config/database");
const {
    getAllTravellerTypes,
    getAllPolicyTypes,
    getAllAreas,
    getAllRestTypes,
    getAllProductNames,
    getAllAgeGroups,
    getAllCountries,
    getAllDurations
} = require('./insurance');

const getAllInformation = async () => {
    try {
        const travellerTypes = await getAllTravellerTypes();
        const policyTypes = await getAllPolicyTypes();
        const areas = await getAllAreas();
        const restTypes = await getAllRestTypes();
        const productNames = await getAllProductNames();
        const ageGroups = await getAllAgeGroups();
        const countries = await getAllCountries();
        const durations = await getAllDurations();

        const successCheck = [
            travellerTypes,
            policyTypes,
            areas,
            restTypes,
            productNames,
            ageGroups,
            durations
        ].every(result => result.success);

        if (!successCheck) {
            return {
                success: false,
                error: 'Invalid data. Please provide valid values for all fields.',
            };
        }

        const {
            data: ageGroupData,
        } = ageGroups;

        const {
            data: durationData,
        } = durations;

        const allInformation = {
            travellerTypes: travellerTypes.data,
            policyTypes: policyTypes.data,
            areas: areas.data,
            restTypes: restTypes.data,
            productNames: productNames.data,
            ageGroups: ageGroupData.map(type => type.name),
            durations: durationData.map(type => type.name),
        };

        return {
            success: true,
            data: allInformation,
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            error: 'Failed to retrieve information',
        };
    }
};

// Check if the travellerType exists in the database
const isTravellerTypeValid = async (travellerType) => {
    const client = getClient();
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection(process.env.INSURANCE_TRAVELLER_TYPES_COLLECTION);
    const existingTravellerType = await collection.findOne({ name: travellerType });

    return !!existingTravellerType;
};

// Check if the policyType exists in the database
const isPolicyTypeValid = async (policyType) => {
    const client = getClient();
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection(process.env.INSURANCE_POLICYTYPES_TYPES_COLLECTION);
    const existingPolicyType = await collection.findOne({ name: policyType });

    return !!existingPolicyType;
};

// Check if the area exists in the database
const isAreaValid = async (area) => {
    const client = getClient();
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection(process.env.INSURANCE_AREAS_COLLECTION);
    const existingArea = await collection.findOne({ name: area });

    return !!existingArea;
};

// Check if the restType exists in the database
const isRestTypeValid = async (restType) => {
    const client = getClient();
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection(process.env.INSURANCE_REST_TYPES_COLLECTION);
    const existingRestType = await collection.findOne({ name: restType });

    return !!existingRestType;
};

// Check if the productName exists in the database
const isProductNameValid = async (productName) => {
    const client = getClient();
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection(process.env.INSURANCE_PRODUCT_NAMES_COLLECTION);
    const existingProductName = await collection.findOne({ name: productName });

    return !!existingProductName;
};

// Check if the ageGroup exists in the database
const isAgeGroupValid = async (ageGroup) => {
    const client = getClient();
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection(process.env.INSURANCE_AGE_GROUPS_COLLECTION);
    const existingAgeGroup = await collection.findOne({ name: ageGroup });

    return !!existingAgeGroup;
};

// Check if the duration exists in the database
const isDurationValid = async (duration) => {
    const client = getClient();
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection(process.env.INSURANCE_DURATIONS_COLLECTION);
    const existingDuration = await collection.findOne({ name: duration });

    return !!existingDuration;
};
const addInsurance = async (insurance) => {
    try {
        const {
            travellerType,
            policyType,
            area,
            restType,
            productName,
            ageGroup,
            duration,
        } = insurance;
        const invalidFields = [];

        const isTravellerTypeValidResult = await isTravellerTypeValid(travellerType);
        if (!isTravellerTypeValidResult) {
          invalidFields.push('travellerType');
        }
    
        const isPolicyTypeValidResult = await isPolicyTypeValid(policyType);
        if (!isPolicyTypeValidResult) {
          invalidFields.push('policyType');
        }
    
        const isAreaValidResult = await isAreaValid(area);
        if (!isAreaValidResult) {
          invalidFields.push('area');
        }
    
        const isRestTypeValidResult = await isRestTypeValid(restType);
        if (!isRestTypeValidResult) {
          invalidFields.push('restType');
        }
    
        const isProductNameValidResult = await isProductNameValid(productName);
        if (!isProductNameValidResult) {
          invalidFields.push('productName');
        }
    
        const isAgeGroupValidResult = await isAgeGroupValid(ageGroup);
        if (!isAgeGroupValidResult) {
          invalidFields.push('ageGroup');
        }
    
        const isDurationValidResult = await isDurationValid(duration);
        if (!isDurationValidResult) {
          invalidFields.push('duration');
        }
    
        if (invalidFields.length > 0) {
          return {
            success: false,
            error: 'Invalid data. Please provide valid values for the following fields:',
            invalidFields,
          };
        }

        const client = getClient();
        const db = client.db(process.env.DB_NAME);
        const collection = db.collection('insurances');

        const existingInsurance = await collection.findOne({
            travellerType,
            policyType,
            area,
            restType,
            productName,
            ageGroup,
            duration,
        });

        if (existingInsurance) {
            // Update the existing insurance record
            await collection.updateOne(
                {
                    travellerType,
                    policyType,
                    area,
                    restType,
                    productName,
                    ageGroup,
                    duration,
                },
                { $set: insurance }
            );
        } else {
            // Insert a new insurance record
            await collection.insertOne(insurance);
        }

        const insuranceData = await collection.find().toArray();

        return {
            success: true,
            data: insuranceData,
        };
    } catch (err) {
        console.error(err);
        return {
            success: false,
            error: 'Failed to save/update insurance information',
        };
    }
};
const getAllInsurances = async () => {
    try {
        const client = getClient();
        const db = client.db(process.env.DB_NAME);
        const collection = db.collection('insurances');

        const allInsurances = await collection.find().toArray();

        return {
            success: true,
            data: allInsurances,
        };
    } catch (err) {
        console.error(err);
        return {
            success: false,
            error: 'Failed to retrieve insurances',
        };
    }
};


module.exports = {
    addInsurance,
    getAllInsurances,
    getAllInformation
}