const CruiseEnquiry = require('../models/CruiseEnquiry');
const { v4: uuidv4 } = require('uuid');

/**
 * Generate unique enquiry code
 */
const generateEnquiryCode = () => {
  const length = 6;
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }
  return code;
};

/**
 * Create a new cruise enquiry
 */
const createEnquiry = async (enquiryData) => {
  try {
    const enquiryId = uuidv4();
    
    const enquiry = new CruiseEnquiry({
      ...enquiryData,
      enquiryId
    });
    
    await enquiry.save();
    return enquiry;
  } catch (error) {
    throw new Error(`Failed to create cruise enquiry: ${error.message}`);
  }
};

/**
 * Get all enquiries
 */
const getAllEnquiries = async () => {
  try {
    const enquiries = await CruiseEnquiry.find().sort({ createdAt: -1 });
    return enquiries;
  } catch (error) {
    throw new Error(`Failed to retrieve enquiries: ${error.message}`);
  }
};

/**
 * Get enquiry by ID
 */
const getEnquiryById = async (enquiryId) => {
  try {
    const enquiry = await CruiseEnquiry.findOne({ enquiryId });
    
    if (!enquiry) {
      throw new Error('Enquiry not found');
    }
    
    return enquiry;
  } catch (error) {
    throw new Error(`Failed to retrieve enquiry: ${error.message}`);
  }
};

/**
 * Get enquiries by email
 */
const getEnquiriesByEmail = async (email) => {
  try {
    const enquiries = await CruiseEnquiry.find({ email }).sort({ createdAt: -1 });
    return enquiries;
  } catch (error) {
    throw new Error(`Failed to retrieve enquiries by email: ${error.message}`);
  }
};

/**
 * Get enquiries by cruise ID
 */
const getEnquiriesByCruiseId = async (cruiseId) => {
  try {
    const enquiries = await CruiseEnquiry.find({ cruiseId }).sort({ createdAt: -1 });
    return enquiries;
  } catch (error) {
    throw new Error(`Failed to retrieve enquiries by cruise ID: ${error.message}`);
  }
};

/**
 * Update enquiry
 */
const updateEnquiry = async (enquiryId, updateData) => {
  try {
    const enquiry = await CruiseEnquiry.findOneAndUpdate(
      { enquiryId },
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!enquiry) {
      throw new Error('Enquiry not found');
    }
    
    return enquiry;
  } catch (error) {
    throw new Error(`Failed to update enquiry: ${error.message}`);
  }
};

/**
 * Delete enquiry
 */
const deleteEnquiry = async (enquiryId) => {
  try {
    const enquiry = await CruiseEnquiry.findOneAndDelete({ enquiryId });
    
    if (!enquiry) {
      throw new Error('Enquiry not found');
    }
    
    return enquiry;
  } catch (error) {
    throw new Error(`Failed to delete enquiry: ${error.message}`);
  }
};

/**
 * Search enquiries by criteria
 */
const searchEnquiries = async (criteria) => {
  try {
    const query = {};
    
    if (criteria.email) query.email = criteria.email;
    if (criteria.cruiseId) query.cruiseId = criteria.cruiseId;
    if (criteria.name) query.name = { $regex: criteria.name, $options: 'i' };
    if (criteria.preferredDeparturePort) query.preferredDeparturePort = { $regex: criteria.preferredDeparturePort, $options: 'i' };
    if (criteria.startDate) query.createdAt = { $gte: new Date(criteria.startDate) };
    if (criteria.endDate) query.createdAt = { $lte: new Date(criteria.endDate) };
    
    const enquiries = await CruiseEnquiry.find(query).sort({ createdAt: -1 });
    return enquiries;
  } catch (error) {
    throw new Error(`Failed to search enquiries: ${error.message}`);
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
  searchEnquiries,
  generateEnquiryCode
};
