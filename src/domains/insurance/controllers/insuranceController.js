const insuranceService = require('../services/insuranceService');
const { sendSuccessResponse, sendErrorResponse } = require('../../../shared/utils/responseHandler');

/**
 * Create a new insurance policy
 */
const createInsurance = async (req, res) => {
  try {
    const insurance = await insuranceService.createInsurance(req.body);
    sendSuccessResponse(res, 'Insurance policy created successfully', insurance);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

/**
 * Get all insurance policies
 */
const getAllInsurances = async (req, res) => {
  try {
    const insurances = await insuranceService.getAllInsurances();
    sendSuccessResponse(res, 'Insurance policies retrieved successfully', insurances);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

/**
 * Get insurance policy by ID
 */
const getInsuranceById = async (req, res) => {
  try {
    const { id } = req.params;
    const insurance = await insuranceService.getInsuranceById(id);
    sendSuccessResponse(res, 'Insurance policy retrieved successfully', insurance);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

/**
 * Update insurance policy
 */
const updateInsurance = async (req, res) => {
  try {
    const { id } = req.params;
    const insurance = await insuranceService.updateInsurance(id, req.body);
    sendSuccessResponse(res, 'Insurance policy updated successfully', insurance);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

/**
 * Delete insurance policy
 */
const deleteInsurance = async (req, res) => {
  try {
    const { id } = req.params;
    const insurance = await insuranceService.deleteInsurance(id);
    sendSuccessResponse(res, 'Insurance policy deleted successfully', insurance);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

/**
 * Search insurance policies
 */
const searchInsurances = async (req, res) => {
  try {
    const criteria = req.query;
    const insurances = await insuranceService.searchInsurances(criteria);
    sendSuccessResponse(res, 'Insurance policies search completed', insurances);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

module.exports = {
  createInsurance,
  getAllInsurances,
  getInsuranceById,
  updateInsurance,
  deleteInsurance,
  searchInsurances
};
