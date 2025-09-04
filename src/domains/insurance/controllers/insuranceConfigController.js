const insuranceConfigService = require('../services/insuranceConfigService');
const { sendSuccessResponse, sendErrorResponse } = require('../../../shared/utils/responseHandler');

/**
 * Get all configuration data
 */
const getAllConfig = async (req, res) => {
  try {
    const config = await insuranceConfigService.getAllConfig();
    sendSuccessResponse(res, config, 'Configuration retrieved successfully');
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

/**
 * Get specific configuration section
 */
const getConfigSection = async (req, res) => {
  try {
    const { section } = req.params;
    const data = await insuranceConfigService.getConfigSection(section);
    sendSuccessResponse(res, data, `${section} retrieved successfully`);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

/**
 * Add traveller type
 */
const addTravellerType = async (req, res) => {
  try {
    const { name, description } = req.body;
    const result = await insuranceConfigService.addTravellerType({ name, description });
    sendSuccessResponse(res, result, 'Traveller type added successfully');
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

/**
 * Add policy type
 */
const addPolicyType = async (req, res) => {
  try {
    const { name, description } = req.body;
    const result = await insuranceConfigService.addPolicyType({ name, description });
    sendSuccessResponse(res, result, 'Policy type added successfully');
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

/**
 * Add area
 */
const addArea = async (req, res) => {
  try {
    const { name, description } = req.body;
    const result = await insuranceConfigService.addArea({ name, description });
    sendSuccessResponse(res, result, 'Area added successfully');
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

/**
 * Add rest type
 */
const addRestType = async (req, res) => {
  try {
    const { name, description } = req.body;
    const result = await insuranceConfigService.addRestType({ name, description });
    sendSuccessResponse(res, result, 'Rest type added successfully');
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

/**
 * Add product name
 */
const addProductName = async (req, res) => {
  try {
    const { name, description } = req.body;
    const result = await insuranceConfigService.addProductName({ name, description });
    sendSuccessResponse(res, result, 'Product name added successfully');
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

/**
 * Add age group
 */
const addAgeGroup = async (req, res) => {
  try {
    const { name, minAge, maxAge } = req.body;
    const result = await insuranceConfigService.addAgeGroup({ name, minAge, maxAge });
    sendSuccessResponse(res, result, 'Age group added successfully');
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

/**
 * Add country
 */
const addCountry = async (req, res) => {
  try {
    const { name, code } = req.body;
    const result = await insuranceConfigService.addCountry({ name, code });
    sendSuccessResponse(res, result, 'Country added successfully');
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

/**
 * Add duration
 */
const addDuration = async (req, res) => {
  try {
    const { name, days } = req.body;
    const result = await insuranceConfigService.addDuration({ name, days });
    sendSuccessResponse(res, result, 'Duration added successfully');
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

module.exports = {
  getAllConfig,
  getConfigSection,
  addTravellerType,
  addPolicyType,
  addArea,
  addRestType,
  addProductName,
  addAgeGroup,
  addCountry,
  addDuration
};
