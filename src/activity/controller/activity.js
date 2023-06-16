const Joi = require('joi');
const {
  getAllCountriesInfo,
  getAllDestinationsInfo,
  getPortfolioAvailInfo,
  getPortfolioInfo,
  saveOrUpdateActivityInfo,
  getAllCurrenciesInfo,
  getAllSegmentsInfo,
  getAllLanguagesInfo,
  getAllDestinationHotelsInfo,
} = require('../services/activity');

// Input validation schemas
const getAllDestinationsValidation = Joi.object({
  country: Joi.string().required(),
});

const getPortfolioAvailValidation = Joi.object({
  destination: Joi.string().required(),
  offset: Joi.number().integer().min(0),
  limit: Joi.number().integer().min(1),
});

const getPortfolioValidation = Joi.object({
  destination: Joi.string().required(),
  offset: Joi.number().integer().min(0),
  limit: Joi.number().integer().min(1),
});

const saveOrUpdateActivityValidation = Joi.object({
  activityInfo: Joi.object().required(),
});

const getAllDestinationHotelsValidation = Joi.object({
  destination: Joi.string().required(),
});

const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
};

const getAllCountries = async (req, res) => {
  try {
    const response = await getAllCountriesInfo();
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch countries' });
  }
};

const getAllDestinations = async (req, res) => {
  try {
    const { error } = getAllDestinationsValidation.validate(req.query);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { country } = req.query;
    const response = await getAllDestinationsInfo(country);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch destinations' });
  }
};

const getPortfolioAvail = async (req, res) => {
  try {
    const { error } = getPortfolioAvailValidation.validate(req.query);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { destination, offset, limit } = req.query;
    const response = await getPortfolioAvailInfo(destination, offset, limit);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch portfolio availability' });
  }
};

const getPortfolio = async (req, res) => {
  try {
    const { error } = getPortfolioValidation.validate(req.query);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { destination, offset, limit } = req.query;
    const response = await getPortfolioInfo(destination, offset, limit);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch portfolio' });
  }
};

const saveOrUpdateActivity = async (req, res) => {
  try {
    const { error } = saveOrUpdateActivityValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { activityInfo } = req.body;
    const response = await saveOrUpdateActivityInfo(activityInfo);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save/update activity information' });
  }
};

const getAllCurrencies = async (req, res) => {
  try {
    const response = await getAllCurrenciesInfo();
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch currencies' });
  }
};

const getAllSegments = async (req, res) => {
  try {
    const response = await getAllSegmentsInfo();
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch segments' });
  }
};

const getAllLanguages = async (req, res) => {
  try {
    const response = await getAllLanguagesInfo();
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch languages' });
  }
};

const getAllDestinationHotels = async (req, res) => {
  try {
    const { error } = getAllDestinationHotelsValidation.validate(req.query);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { destination } = req.query;
    const response = await getAllDestinationHotelsInfo(destination);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch destination hotels' });
  }
};

module.exports = {
  getAllCountries,
  getAllDestinations,
  getPortfolioAvail,
  getPortfolio,
  saveOrUpdateActivity,
  getAllCurrencies,
  getAllSegments,
  getAllLanguages,
  getAllDestinationHotels,
};
