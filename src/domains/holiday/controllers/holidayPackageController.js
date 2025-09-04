const holidayPackageService = require('../services/holidayPackageService');
const { sendSuccessResponse, sendErrorResponse } = require('../../../shared/utils/responseHandler');

/**
 * Create a new holiday package
 */
const createHolidayPackage = async (req, res) => {
  try {
    const holidayPackage = await holidayPackageService.createHolidayPackage(req.body);
    sendSuccessResponse(res, holidayPackage, 'Holiday package created successfully');
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
    sendSuccessResponse(res, packages, 'Holiday packages retrieved successfully');
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
    const holidayPackage = await holidayPackageService.getHolidayPackageById(id);
    sendSuccessResponse(res, holidayPackage, 'Holiday package retrieved successfully');
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
    const holidayPackage = await holidayPackageService.updateHolidayPackage(id, req.body);
    sendSuccessResponse(res, holidayPackage, 'Holiday package updated successfully');
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
    const holidayPackage = await holidayPackageService.deleteHolidayPackage(id);
    sendSuccessResponse(res, holidayPackage, 'Holiday package deleted successfully');
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
    sendSuccessResponse(res, packages, 'Holiday packages search completed');
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
