const {
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
  getAllDurations
} = require('../services/insurance');
const Joi = require('joi');

const travellerTypeSchema = Joi.object({
  name: Joi.string().required(),
});

// Joi schema for Age Group
const ageGroupSchema = Joi.object({
  name: Joi.string().required(),
});

// Joi schema for Rest Type
const restTypeSchema = Joi.object({
  name: Joi.string().required(),
});
// Joi schema for Name of The Product
const productNameSchema = Joi.object({
  name: Joi.string().required(),
});
const policyTypeSchema = Joi.object({
  name: Joi.string().required(),
});

const areaSchema = Joi.object({
  name: Joi.string().required(),
});

const countrySchema = Joi.object({
  name: Joi.string().required(),
});
const durationSchema = Joi.object({
  startDay: Joi.number().required(),
  endDay: Joi.number().required(),
});

const createCountry = async (req, res) => {
  try {
    const countryData = req.body;
    const validationResult = countrySchema.validate(countryData);

    if (validationResult.error) {
      return res.status(400).json({ error: validationResult.error.details[0].message });
    }

    const result = await addCountry(countryData);

    if (result.success) {
      return res.status(201).json(result.data);
    } else {
      return res.status(500).json({ error: result.error });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to save/update country information' });
  }
};

const getCountries = async (req, res) => {
  try {
    const result = await getAllCountries();

    if (result.success) {
      return res.status(200).json(result.data);
    } else {
      return res.status(500).json({ error: result.error });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to retrieve countries' });
  }
};


const createTravellerType = async (req, res) => {
  try {
    const travellerTypeData = req.body;
    const validationResult = travellerTypeSchema.validate(travellerTypeData);

    if (validationResult.error) {
      return res.status(400).json({ error: validationResult.error.details[0].message });
    }

    const result = await addTravellerType(travellerTypeData);

    if (result.success) {
      return res.status(201).json(result);
    } else {
      return res.status(500).json(result);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to save/update travellerType information' });
  }
};

const getTravellerTypes = async (req, res) => {
  try {
    const result = await getAllTravellerTypes();

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(500).json(result);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to retrieve travellerTypes' });
  }
};

const createPolicyType = async (req, res) => {
  try {
    const policyTypeData = req.body;
    const validationResult = policyTypeSchema.validate(policyTypeData);

    if (validationResult.error) {
      return res.status(400).json({ error: validationResult.error.details[0].message });
    }

    const result = await addPolicyType(policyTypeData);

    if (result.success) {
      return res.status(201).json(result);
    } else {
      return res.status(500).json(result);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to save/update policy type information' });
  }
};

const getPolicyTypes = async (req, res) => {
  try {
    const result = await getAllPolicyTypes();

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(500).json(result);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to retrieve policy types' });
  }
};
const createArea = async (req, res) => {
  try {
    const areaData = req.body;
    const validationResult = areaSchema.validate(areaData);

    if (validationResult.error) {
      return res.status(400).json({ error: validationResult.error.details[0].message });
    }

    const result = await addArea(areaData);

    if (result.success) {
      return res.status(201).json(result);
    } else {
      return res.status(500).json(result);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to save/update area information' });
  }
};

const getAreas = async (req, res) => {
  try {
    const result = await getAllAreas();

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(500).json(result);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to retrieve areas' });
  }
};
const createRestType = async (req, res) => {
  try {
    const restTypeData = req.body;
    const validationResult = restTypeSchema.validate(restTypeData);

    if (validationResult.error) {
      return res.status(400).json({ error: validationResult.error.details[0].message });
    }

    const result = await addRestType(restTypeData);

    if (result.success) {
      return res.status(201).json(result);
    } else {
      return res.status(500).json(result);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to save/update rest type information' });
  }
};

const getRestTypes = async (req, res) => {
  try {
    const result = await getAllRestTypes();

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(500).json(result);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to retrieve rest types' });
  }
};

const createProductName = async (req, res) => {
  try {
    const productNameData = req.body;
    const validationResult = productNameSchema.validate(productNameData);

    if (validationResult.error) {
      return res.status(400).json({ error: validationResult.error.details[0].message });
    }

    const result = await addProductName(productNameData);

    if (result.success) {
      return res.status(201).json(result);
    } else {
      return res.status(500).json(result);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to save/update product name information' });
  }
};

const getProductNames = async (req, res) => {
  try {
    const result = await getAllProductNames();

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(500).json(result);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to retrieve product names' });
  }
};
const createAgeGroup = async (req, res) => {
  try {
    const ageGroupData = req.body;
    const validationResult = ageGroupSchema.validate(ageGroupData);

    if (validationResult.error) {
      return res.status(400).json({ error: validationResult.error.details[0].message });
    }

    const result = await addAgeGroup(ageGroupData);

    if (result.success) {
      return res.status(201).json(result);
    } else {
      return res.status(500).json(result);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to save/update age group information' });
  }
};

const getAgeGroups = async (req, res) => {
  try {
    const result = await getAllAgeGroups();

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(500).json(result);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to retrieve age groups' });
  }
};


const createDuration = async (req, res) => {
  try {
    const { startDay, endDay } = req.body;
    const durationData = {
      startDay,
      endDay
    };
    const validationResult = durationSchema.validate(durationData);

    if (validationResult.error) {
      return res.status(400).json({ error: validationResult.error.details[0].message });
    }
    const result = await addDuration(durationData);

    if (result.success) {
      return res.status(201).json(result.data);
    } else {
      return res.status(500).json({ error: result.error });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to save/update duration information' });
  }
};

const getDurations = async (req, res) => {
  try {
    const result = await getAllDurations();

    if (result.success) {
      return res.status(200).json(result.data);
    } else {
      return res.status(500).json({ error: result.error });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to retrieve durations' });
  }
};

module.exports = {
  createTravellerType,
  getTravellerTypes,
  createPolicyType,
  getPolicyTypes,
  createArea,
  getAreas,
  createRestType,
  getRestTypes,
  createProductName,
  getProductNames,
  createAgeGroup,
  getAgeGroups,
  createCountry,
  getCountries,
  createDuration,
  getDurations,
};
