const cruiseEnquiryService = require('../services/cruiseEnquiryService');
const { sendSuccessResponse, sendErrorResponse } = require('../../../shared/utils/responseHandler');

/**
 * Create a new cruise enquiry
 */
const createEnquiry = async (req, res) => {
  try {
    const enquiry = await cruiseEnquiryService.createEnquiry(req.body);
    sendSuccessResponse(res, 'Cruise enquiry created successfully', enquiry);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

/**
 * Get all enquiries
 */
const getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await cruiseEnquiryService.getAllEnquiries();
    sendSuccessResponse(res, 'Enquiries retrieved successfully', enquiries);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

/**
 * Get enquiry by ID
 */
const getEnquiryById = async (req, res) => {
  try {
    const { enquiryId } = req.params;
    const enquiry = await cruiseEnquiryService.getEnquiryById(enquiryId);
    sendSuccessResponse(res, 'Enquiry retrieved successfully', enquiry);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

/**
 * Get enquiries by email
 */
const getEnquiriesByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const enquiries = await cruiseEnquiryService.getEnquiriesByEmail(email);
    sendSuccessResponse(res, 'Enquiries retrieved successfully', enquiries);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

/**
 * Get enquiries by cruise ID
 */
const getEnquiriesByCruiseId = async (req, res) => {
  try {
    const { cruiseId } = req.params;
    const enquiries = await cruiseEnquiryService.getEnquiriesByCruiseId(cruiseId);
    sendSuccessResponse(res, 'Enquiries retrieved successfully', enquiries);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

/**
 * Update enquiry
 */
const updateEnquiry = async (req, res) => {
  try {
    const { enquiryId } = req.params;
    const enquiry = await cruiseEnquiryService.updateEnquiry(enquiryId, req.body);
    sendSuccessResponse(res, 'Enquiry updated successfully', enquiry);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

/**
 * Delete enquiry
 */
const deleteEnquiry = async (req, res) => {
  try {
    const { enquiryId } = req.params;
    const enquiry = await cruiseEnquiryService.deleteEnquiry(enquiryId);
    sendSuccessResponse(res, 'Enquiry deleted successfully', enquiry);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

/**
 * Search enquiries
 */
const searchEnquiries = async (req, res) => {
  try {
    const criteria = req.query;
    const enquiries = await cruiseEnquiryService.searchEnquiries(criteria);
    sendSuccessResponse(res, 'Enquiries search completed', enquiries);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

module.exports = {
  createEnquiry,
  getAllEnquiries,
  getEnquiryById,
  getEnquiriesByEmail,
  getEnquiriesByCruiseId,
  updateEnquiry,
  deleteEnquiry,
  searchEnquiries
};
