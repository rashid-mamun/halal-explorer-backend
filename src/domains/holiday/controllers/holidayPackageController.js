const holidayPackageService = require('../services/holidayPackageService');
const { sendSuccessResponse, sendErrorResponse } = require('../../../shared/utils/responseHandler');

/**
 * Create a new holiday package
 */
const createHolidayPackage = async (req, res) => {
  try {
    const package = await holidayPackageService.createHolidayPackage(req.body);
    sendSuccessResponse(res, 'Holiday package created successfully', package);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

/**
 * Get all holiday packages
 */
const getAllHolidayPackages = async (req, res) => {
  try {
    const packages = await holidayPackageService.getAllHolidayPackages();
    sendSuccessResponse(res, 'Holiday packages retrieved successfully', packages);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

/**
 * Get holiday package by ID
 */
const getHolidayPackageById = async (req, res) => {
  try {
    const { id } = req.params;
    const package = await holidayPackageService.getHolidayPackageById(id);
    sendSuccessResponse(res, 'Holiday package retrieved successfully', package);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

/**
 * Update holiday package
 */
const updateHolidayPackage = async (req, res) => {
  try {
    const { id } = req.params;
    const package = await holidayPackageService.updateHolidayPackage(id, req.body);
    sendSuccessResponse(res, 'Holiday package updated successfully', package);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

/**
 * Delete holiday package
 */
const deleteHolidayPackage = async (req, res) => {
  try {
    const { id } = req.params;
    const package = await holidayPackageService.deleteHolidayPackage(id);
    sendSuccessResponse(res, 'Holiday package deleted successfully', package);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

/**
 * Search holiday packages
 */
const searchHolidayPackages = async (req, res) => {
  try {
    const criteria = req.query;
    const packages = await holidayPackageService.searchHolidayPackages(criteria);
    sendSuccessResponse(res, 'Holiday packages search completed', packages);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

module.exports = {
  createHolidayPackage,
  getAllHolidayPackages,
  getHolidayPackageById,
  updateHolidayPackage,
  deleteHolidayPackage,
  searchHolidayPackages
};
