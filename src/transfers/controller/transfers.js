const {
  getPickups,
  getHotels,
  getCountries,
  getDestinations,
  getTerminals,
  searchTerminals,
  getMasterCategories,
  getMasterVehicles,
  getMasterTransferTypes,
  getCurrencies,
  getRoutes
} = require('../services/transfers');
const Joi = require('joi');

const validateQuery = (query, schema) => {
  const { error } = schema.validate(query);
  return error ? error.details[0].message : null;
};

const validateGetPickupsQuery = (query) => {
  const schema = Joi.object({
    fields: Joi.string().required(),
    language: Joi.string().required(),
    codes: Joi.string(),
    offset: Joi.number(),
    limit: Joi.number(),
  });

  return validateQuery(query, schema);
};

const validateGetHotelsQuery = (query) => {
  const schema = Joi.object({
    fields: Joi.string().required(),
    language: Joi.string().required(),
    countryCodes: Joi.string(),
    destinationCodes: Joi.string(),
    codes: Joi.string(),
    giataCodes: Joi.string(),
    offset: Joi.number(),
    limit: Joi.number(),
  });

  return validateQuery(query, schema);
};

const validateGetCountriesQuery = (query) => {
  const schema = Joi.object({
    fields: Joi.string().required(),
    language: Joi.string().required(),
    codes: Joi.string(),
    offset: Joi.number(),
    limit: Joi.number(),
  });

  return validateQuery(query, schema);
};

const validateGetDestinationsQuery = (query) => {
  const schema = Joi.object({
    fields: Joi.string().required(),
    language: Joi.string().required(),
    countryCodes: Joi.string(),
    codes: Joi.string(),
    offset: Joi.number(),
    limit: Joi.number(),
  });

  return validateQuery(query, schema);
};

const validateGetTerminalsQuery = (query) => {
  const schema = Joi.object({
    fields: Joi.string().required(),
    language: Joi.string().required(),
    countryCode: Joi.string(),
    codes: Joi.string(),
    offset: Joi.number(),
    limit: Joi.number(),
  });

  return validateQuery(query, schema);
};

const validateGetMasterCategoriesQuery = (query) => {
  const schema = Joi.object({
    fields: Joi.string().required(),
    language: Joi.string().required(),
    codes: Joi.string(),
    offset: Joi.number(),
    limit: Joi.number(),
  });

  return validateQuery(query, schema);
};

const validateGetMasterVehiclesQuery = (query) => {
  const schema = Joi.object({
    fields: Joi.string().required(),
    language: Joi.string().required(),
    codes: Joi.string(),
    offset: Joi.number(),
    limit: Joi.number(),
  });

  return validateQuery(query, schema);
};

const validateGetMasterTransferTypesQuery = (query) => {
  const schema = Joi.object({
    fields: Joi.string().required(),
    language: Joi.string().required(),
    codes: Joi.string(),
    offset: Joi.number(),
    limit: Joi.number(),
  });

  return validateQuery(query, schema);
};

const validateGetCurrenciesQuery = (query) => {
  const schema = Joi.object({
    fields: Joi.string().required(),
    language: Joi.string().required(),
    codes: Joi.string(),
    offset: Joi.number(),
    limit: Joi.number(),
  });

  return validateQuery(query, schema);
};

const validateGetRoutesQuery = (query) => {
  const schema = Joi.object({
    fields: Joi.string().required(),
    destinationCode: Joi.string().required(),
    offset: Joi.number(),
    limit: Joi.number(),
  });

  return validateQuery(query, schema);
};

const getPickupsController = async (req, res) => {
  try {
    const error = validateGetPickupsQuery(req.query);
    if (error) {
      return res.status(400).json({ error });
    }

    // Extract the validated query parameters
    const { fields, language, codes, offset, limit } = req.query;

    // Call the service layer to get pickups
    const pickups = await getPickups({
      fields,
      language,
      codes,
      offset,
      limit,
    });

    // Send the pickups response back to the client
    res.json(pickups);
  } catch (error) {
    console.error(`Error retrieving pickups: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getHotelsController = async (req, res) => {
  try {
    const error = validateGetHotelsQuery(req.query);
    if (error) {
      return res.status(400).json({ error });
    }

    // Extract the validated query parameters
    const { fields, language, countryCodes, destinationCodes, codes, giataCodes, offset, limit } = req.query;

    // Call the service layer to get hotels
    const hotels = await getHotels({
      fields,
      language,
      countryCodes,
      destinationCodes,
      codes,
      giataCodes,
      offset,
      limit,
    });

    // Send the hotels response back to the client
    res.json(hotels);
  } catch (error) {
    console.error(`Error retrieving hotels: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getCountriesController = async (req, res) => {
  try {
    const error = validateGetCountriesQuery(req.query);
    if (error) {
      return res.status(400).json({ error });
    }

    // Extract the validated query parameters
    const { fields, language, codes, offset, limit } = req.query;

    // Call the service layer to get countries
    const countries = await getCountries({
      fields,
      language,
      codes,
      offset,
      limit,
    });

    // Send the countries response back to the client
    res.json(countries);
  } catch (error) {
    console.error(`Error retrieving countries: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getDestinationsController = async (req, res) => {
  try {
    const error = validateGetDestinationsQuery(req.query);
    if (error) {
      return res.status(400).json({ error });
    }

    // Extract the validated query parameters
    const { fields, language, countryCodes, codes, offset, limit } = req.query;

    // Call the service layer to get destinations
    const destinations = await getDestinations({
      fields,
      language,
      countryCodes,
      codes,
      offset,
      limit,
    });

    // Send the destinations response back to the client
    res.json(destinations);
  } catch (error) {
    console.error(`Error retrieving destinations: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
const searchSchema = Joi.object({
  keyword: Joi.string().required(),
  offset: Joi.number().integer().min(0).default(0),
  limit: Joi.number().integer().min(1).max(100).default(10),
});

const getTerminalsSearchController = async (req, res) => {
  try {
    const { error, value } = searchSchema.validate(req.query);
    if (error) {
      return res.status(400).json({ error });
    }
    const { keyword, offset, limit } = value;
    const terminals = await searchTerminals(keyword, offset, limit);
    res.json(terminals);
  } catch (error) {
    console.error(`Error retrieving terminals: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const getTerminalsController = async (req, res) => {
  try {
    const error = validateGetTerminalsQuery(req.query);
    if (error) {
      return res.status(400).json({ error });
    }

    // Extract the validated query parameters
    const { fields, language, countryCode, codes, offset, limit } = req.query;

    // Call the service layer to get terminals
    const terminals = await getTerminals({
      fields,
      language,
      countryCode,
      codes,
      offset,
      limit,
    });

    // Send the terminals response back to the client
    res.json(terminals);
  } catch (error) {
    console.error(`Error retrieving terminals: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getMasterCategoriesController = async (req, res) => {
  try {
    const error = validateGetMasterCategoriesQuery(req.query);
    if (error) {
      return res.status(400).json({ error });
    }

    // Extract the validated query parameters
    const { fields, language, codes, offset, limit } = req.query;

    // Call the service layer to get master categories
    const masterCategories = await getMasterCategories({
      fields,
      language,
      codes,
      offset,
      limit,
    });

    // Send the master categories response back to the client
    res.json(masterCategories);
  } catch (error) {
    console.error(`Error retrieving master categories: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getMasterVehiclesController = async (req, res) => {
  try {
    const error = validateGetMasterVehiclesQuery(req.query);
    if (error) {
      return res.status(400).json({ error });
    }

    // Extract the validated query parameters
    const { fields, language, codes, offset, limit } = req.query;

    // Call the service layer to get master vehicles
    const masterVehicles = await getMasterVehicles({
      fields,
      language,
      codes,
      offset,
      limit,
    });

    // Send the master vehicles response back to the client
    res.json(masterVehicles);
  } catch (error) {
    console.error(`Error retrieving master vehicles: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getMasterTransferTypesController = async (req, res) => {
  try {
    const error = validateGetMasterTransferTypesQuery(req.query);
    if (error) {
      return res.status(400).json({ error });
    }

    // Extract the validated query parameters
    const { fields, language, codes, offset, limit } = req.query;

    // Call the service layer to get master transfer types
    const masterTransferTypes = await getMasterTransferTypes({
      fields,
      language,
      codes,
      offset,
      limit,
    });

    // Send the master transfer types response back to the client
    res.json(masterTransferTypes);
  } catch (error) {
    console.error(`Error retrieving master transfer types: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getCurrenciesController = async (req, res) => {
  try {
    const error = validateGetCurrenciesQuery(req.query);
    if (error) {
      return res.status(400).json({ error });
    }

    // Extract the validated query parameters
    const { fields, language, codes, offset, limit } = req.query;

    // Call the service layer to get currencies
    const currencies = await getCurrencies({
      fields,
      language,
      codes,
      offset,
      limit,
    });

    // Send the currencies response back to the client
    res.json(currencies);
  } catch (error) {
    console.error(`Error retrieving currencies: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getRoutesController = async (req, res) => {
  try {
    const error = validateGetRoutesQuery(req.query);
    if (error) {
      return res.status(400).json({ error });
    }

    // Extract the validated query parameters
    const { fields, destinationCode, offset, limit } = req.query;

    // Call the service layer to get routes
    const routes = await getRoutes({
      fields,
      destinationCode,
      offset,
      limit,
    });

    // Send the routes response back to the client
    res.json(routes);
  } catch (error) {
    console.error(`Error retrieving routes: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getPickupsController,
  getHotelsController,
  getCountriesController,
  getDestinationsController,
  getTerminalsController,
  getTerminalsSearchController,
  getMasterCategoriesController,
  getMasterVehiclesController,
  getMasterTransferTypesController,
  getCurrenciesController,
  getRoutesController,
};
