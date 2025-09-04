const cruisePackageService = require('../services/cruisePackageService');
const { sendSuccessResponse, sendErrorResponse } = require('../../../shared/utils/responseHandler');

/**
 * Create a new cruise package
 */
const createCruisePackage = async (req, res) => {
  try {
    const cruisePackage = await cruisePackageService.createCruisePackage(req.body);
    sendSuccessResponse(res, cruisePackage, 'Cruise package created successfully');
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
    sendSuccessResponse(res, packages, 'Cruise packages retrieved successfully');
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
    const cruisePackage = await cruisePackageService.getCruisePackageById(id);
    sendSuccessResponse(res, cruisePackage, 'Cruise package retrieved successfully');
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
    const cruisePackage = await cruisePackageService.updateCruisePackage(id, req.body);
    sendSuccessResponse(res, cruisePackage, 'Cruise package updated successfully');
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
    const cruisePackage = await cruisePackageService.deleteCruisePackage(id);
    sendSuccessResponse(res, cruisePackage, 'Cruise package deleted successfully');
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
    sendSuccessResponse(res, packages, 'Cruise packages search completed');
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
