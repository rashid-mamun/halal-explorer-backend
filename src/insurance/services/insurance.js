const { getClient } = require("../../config/database");

const addTravellerType = async (travellerType) => {
  try {
    const client = getClient();
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection(process.env.INSURANCE_TRAVELLER_TYPES_COLLECTION);

    const existingTravellerType = await collection.findOne({ name: travellerType.name });

    if (existingTravellerType) {
      return {
        success: false,
        error: 'Traveller type already exists',
      };
    }

    await collection.insertOne(travellerType);

    const travellerTypeData = await collection.find().project({ name: 1 }).toArray();

    return {
      success: true,
      data: travellerTypeData.map(type => type.name),
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      error: 'Failed to save/update traveller type information',
    };
  }
};

const getAllTravellerTypes = async () => {
  try {
    const client = getClient();
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection(process.env.INSURANCE_TRAVELLER_TYPES_COLLECTION);

    const allTravellerTypes = await collection.find().project({ name: 1 }).toArray();

    return {
      success: true,
      data: allTravellerTypes.map(type => type.name),
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      error: 'Failed to retrieve traveller types',
    };
  }
};
const addPolicyType = async (policyType) => {
  try {
    const client = getClient();
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection(process.env.INSURANCE_POLICYTYPES_TYPES_COLLECTION);

    const existingPolicyType = await collection.findOne({ name: policyType.name });

    if (existingPolicyType) {
      return {
        success: false,
        error: 'Policy type already exists',
      };
    }

    await collection.insertOne(policyType);

    const policyTypeData = await collection.find().project({ name: 1 }).toArray();

    return {
      success: true,
      data: policyTypeData.map(type => type.name),
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      error: 'Failed to save/update policy type information',
    };
  }
};

const getAllPolicyTypes = async () => {
  try {
    const client = getClient();
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection(process.env.INSURANCE_POLICYTYPES_TYPES_COLLECTION);

    const allPolicyTypes = await collection.find().project({ name: 1 }).toArray();

    return {
      success: true,
      data: allPolicyTypes.map(type => type.name),
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      error: 'Failed to retrieve policy types',
    };
  }
};

const addArea = async (area) => {
  try {
    const client = getClient();
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection(process.env.INSURANCE_AREAS_COLLECTION);

    const existingArea = await collection.findOne({ name: area.name });

    if (existingArea) {
      return {
        success: false,
        error: 'Area already exists',
      };
    }

    await collection.insertOne(area);

    const areaData = await collection.find().project({ name: 1 }).toArray();

    return {
      success: true,
      data: areaData.map(item => item.name),
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      error: 'Failed to save/update area information',
    };
  }
};

const getAllAreas = async () => {
  try {
    const client = getClient();
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection(process.env.INSURANCE_AREAS_COLLECTION);

    const allAreas = await collection.find().project({ name: 1 }).toArray();

    return {
      success: true,
      data: allAreas.map(item => item.name),
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      error: 'Failed to retrieve areas',
    };
  }
};

const addRestType = async (restType) => {
  try {
    const client = getClient();
   const db = client.db(process.env.DB_NAME);
    const collection = db.collection(process.env.INSURANCE_REST_TYPES_COLLECTION);

    const existingRestType = await collection.findOne({ name: restType.name });

    if (existingRestType) {
      return {
        success: false,
        error: 'Rest type already exists',
      };
    }

    await collection.insertOne(restType);

    const restTypeData = await collection.find().project({ name: 1 }).toArray();

    return {
      success: true,
      data: restTypeData.map(item => item.name),
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      error: 'Failed to save/update rest type information',
    };
  }
};

const getAllRestTypes = async () => {
  try {
    const client = getClient();
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection(process.env.INSURANCE_REST_TYPES_COLLECTION);

    const allRestTypes = await collection.find().project({ name: 1 }).toArray();

    return {
      success: true,
      data: allRestTypes.map(item => item.name),
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      error: 'Failed to retrieve rest types',
    };
  }
};

const addProductName = async (productName) => {
  try {
    const client = getClient();
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection(process.env.INSURANCE_PRODUCT_NAMES_COLLECTION);

    const existingProductName = await collection.findOne({ name: productName.name });

    if (existingProductName) {
      return {
        success: false,
        error: 'Product name already exists',
      };
    }

    await collection.insertOne(productName);

    const productNameData = await collection.find().project({ name: 1 }).toArray();

    return {
      success: true,
      data: productNameData.map(item => item.name),
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      error: 'Failed to save/update product name information',
    };
  }
};

const getAllProductNames = async () => {
  try {
    const client = getClient();
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection(process.env.INSURANCE_PRODUCT_NAMES_COLLECTION);

    const allProductNames = await collection.find().project({ name: 1 }).toArray();

    return {
      success: true,
      data: allProductNames.map(item => item.name),
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      error: 'Failed to retrieve product names',
    };
  }
};

const addAgeGroup = async (ageGroup) => {
  try {
    const client = getClient();
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection(process.env.INSURANCE_AGE_GROUPS_COLLECTION);

    const existingAgeGroup = await collection.findOne({ name: ageGroup.name });

    if (existingAgeGroup) {
      return {
        success: false,
        error: 'Age group already exists',
      };
    }

    await collection.insertOne(ageGroup);

    const ageGroupData = await collection.find().project({ name: 1 }).toArray();

    return {
      success: true,
      data: ageGroupData.map(item => item.name),
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      error: 'Failed to save/update age group information',
    };
  }
};

const getAllAgeGroups = async () => {
  try {
    const client = getClient();
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection(process.env.INSURANCE_AGE_GROUPS_COLLECTION);

    const allAgeGroups = await collection.find().project({ name: 1 }).toArray();

    return {
      success: true,
      data: allAgeGroups.map(item => item.name),
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      error: 'Failed to retrieve age groups',
    };
  }
};

const addCountry = async (country) => {
  try {
    const client = getClient();
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection(process.env.INSURANCE_COUNTRIES_COLLECTION);

    const existingCountry = await collection.findOne({ name: country.name });

    if (existingCountry) {
      return {
        success: false,
        error: 'Country already exists',
      };
    }

    await collection.insertOne(country);

    const countryData = await collection.find().project({ name: 1 }).toArray();

    return {
      success: true,
      data: countryData.map(item => item.name),
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      error: 'Failed to save/update country information',
    };
  }
};

const getAllCountries = async () => {
  try {
    const client = getClient();
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection(process.env.INSURANCE_COUNTRIES_COLLECTION);

    const allCountries = await collection.find().project({ name: 1 }).toArray();

    return {
      success: true,
      data: allCountries.map(item => item.name),
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      error: 'Failed to retrieve countries',
    };
  }
};
const addDuration = async (duration) => {
  try {
    const client = getClient();
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection(process.env.INSURANCE_DURATIONS_COLLECTION);

    const existingDuration = await collection.findOne({
      startDay: duration.startDay,
      endDay: duration.endDay,
    });

    if (existingDuration) {
      return {
        success: false,
        error: 'Duration already exists',
      };
    }

    const newDuration = {
      name: `Between ${duration.startDay} and ${duration.endDay} days`,
      startDay: duration.startDay,
      endDay: duration.endDay,
    };

    await collection.insertOne(newDuration);

    const durationData = await collection.find().toArray();

    return {
      success: true,
      data: durationData,
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      error: 'Failed to save/update duration information',
    };
  }
};
const getAllDurations = async () => {
  try {
    const client = getClient();
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection(process.env.INSURANCE_DURATIONS_COLLECTION);

    const allDurations = await collection.find().toArray();

    return {
      success: true,
      data: allDurations,
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      error: 'Failed to retrieve durations',
    };
  }
};



module.exports = {
  addTravellerType,
  getAllTravellerTypes,
  addPolicyType,
  getAllPolicyTypes,
  addArea,
  getAllAreas,
  addRestType,
  getAllRestTypes,
  addProductName,
  getAllProductNames,
  addAgeGroup,
  getAllAgeGroups,
  addCountry,
  getAllCountries,
  addDuration,
  getAllDurations,
};
