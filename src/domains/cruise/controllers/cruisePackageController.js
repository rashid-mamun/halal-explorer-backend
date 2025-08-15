const cruisePackageService = require('../services/cruisePackageService');
const { sendSuccessResponse, sendErrorResponse } = require('../../../shared/utils/responseHandler');

/**
 * Create a new cruise package
 */
const createCruisePackage = async (req, res) => {
  try {
    const package = await cruisePackageService.createCruisePackage(req.body);
    sendSuccessResponse(res, 'Cruise package created successfully', package);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

/**
 * Get all cruise packages
 */
const getAllCruisePackages = async (req, res) => {
  try {
    const packages = await cruisePackageService.getAllCruisePackages();
    sendSuccessResponse(res, 'Cruise packages retrieved successfully', packages);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

/**
 * Get cruise package by ID
 */
const getCruisePackageById = async (req, res) => {
  try {
    const { id } = req.params;
    const package = await cruisePackageService.getCruisePackageById(id);
    sendSuccessResponse(res, 'Cruise package retrieved successfully', package);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

/**
 * Update cruise package
 */
const updateCruisePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const package = await cruisePackageService.updateCruisePackage(id, req.body);
    sendSuccessResponse(res, 'Cruise package updated successfully', package);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

/**
 * Delete cruise package
 */
const deleteCruisePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const package = await cruisePackageService.deleteCruisePackage(id);
    sendSuccessResponse(res, 'Cruise package deleted successfully', package);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

/**
 * Search cruise packages
 */
const searchCruisePackages = async (req, res) => {
  try {
    const criteria = req.query;
    const packages = await cruisePackageService.searchCruisePackages(criteria);
    sendSuccessResponse(res, 'Cruise packages search completed', packages);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

module.exports = {
  createCruisePackage,
  getAllCruisePackages,
  getCruisePackageById,
  updateCruisePackage,
  deleteCruisePackage,
  searchCruisePackages
};
