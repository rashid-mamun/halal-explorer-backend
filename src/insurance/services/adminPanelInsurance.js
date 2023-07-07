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
            packageName
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
        const collection = db.collection(process.env.INSURANCE_INSURANCES_COLLECTION);

        const existingInsurance = await collection.findOne({
            travellerType,
            packageName,
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


const calculateTripDuration = (departureDate, arrivalDate) => {
    const departure = new Date(departureDate);
    const arrival = new Date(arrivalDate);

    if (departure > arrival) {
        return null; // Invalid dates
    }

    const timeDiff = Math.abs(arrival.getTime() - departure.getTime());
    const tripDuration = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Duration in days
    return tripDuration;
};

const calculateTravelerAge = (travelerDOB) => {
    const today = new Date();
    const birthDate = new Date(travelerDOB);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

const searchInsurance = async (
    departureDate,
    arrivalDate,
    travelerDOB,
    mobile,
    email,
    country,
    restType,
    residenceCountry,
) => {
    try {
        const client = getClient();
        const db = client.db(process.env.DB_NAME);
        const durationCollection = db.collection(process.env.INSURANCE_DURATIONS_COLLECTION);
        const insuranceCollection = db.collection(process.env.INSURANCE_INSURANCES_COLLECTION);
        const ageGroupCollection = db.collection(process.env.INSURANCE_AGE_GROUPS_COLLECTION);

        const tripDuration = calculateTripDuration(departureDate, arrivalDate);
        console.log('-------tripDuration---------', tripDuration);
        const travelerAge = calculateTravelerAge(travelerDOB);
        console.log('--------travelerAge--------', travelerAge);

        if (!tripDuration || tripDuration <= 0) {
            return {
                success: false,
                error: 'Invalid departure or arrival date',
            };
        }
        const allDurations = await durationCollection
            .find({
                $and: [
                    { startDay: { $lte: tripDuration } },
                    { endDay: { $gte: tripDuration } },
                ],
            })
            .project({ _id: 0, name: 1 })
            .toArray();

        const durationNames = allDurations.map((duration) => duration.name);
        console.log(durationNames);

        const ageGroups = await ageGroupCollection
            .find({
                $and: [
                    { startYear: { $lte: travelerAge } },
                    { endYear: { $gte: travelerAge } },
                ],
            })
            .project({ _id: 0, name: 1 })
            .toArray();

        const ageGroupNames = ageGroups.map((ageGroup) => ageGroup.name);
        console.log(ageGroupNames);


        const matchedInsurancePolicy = await insuranceCollection.findOne({
            restType,
            area: country,
            ageGroup: { $in: ageGroupNames },
            duration: { $in: durationNames },
        });

        if (matchedInsurancePolicy) {
            return {
                success: true,
                data: matchedInsurancePolicy,
            };
        } else {
            console.log('No insurance policy matched');
            return {
                success: true,
                message: 'No insurance policy matched',
                data: [],
            };
        }


    } catch (error) {
        console.log(error);
        return {
            success: false,
            error: 'Failed to search insurance policies',
        };
    }
};



module.exports = {
    addInsurance,
    getAllInsurances,
    getAllInformation,
    searchInsurance
}