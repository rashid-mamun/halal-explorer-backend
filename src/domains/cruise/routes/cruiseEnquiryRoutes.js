const express = require('express');
const router = express.Router();
const cruiseEnquiryController = require('../controllers/cruiseEnquiryController');
const { requireAuth } = require('../../auth/middleware/auth');
const { requirePermissionMiddleware } = require('../../auth/middleware/authorization');
const { validateRequestBody, validateRequestQuery } = require('../../../shared/utils/validators');
const {
  createCruiseEnquiryValidator,
  updateCruiseEnquiryValidator,
  searchCruiseEnquiryValidator
} = require('../validators/cruiseEnquiryValidators');

// Create new cruise enquiry
router.post('/', 
  requireAuth, 
  requirePermissionMiddleware('cruise:create'),
  validateRequestBody(createCruiseEnquiryValidator),
  cruiseEnquiryController.createEnquiry
);

// Get all enquiries (Admin/Manager only)
router.get('/all', 
  requireAuth, 
  requirePermissionMiddleware('cruise:read'),
  cruiseEnquiryController.getAllEnquiries
);

// Search enquiries
router.get('/search', 
  requireAuth, 
  requirePermissionMiddleware('cruise:read'),
  validateRequestQuery(searchCruiseEnquiryValidator),
  cruiseEnquiryController.searchEnquiries
);

// Get enquiry by ID
router.get('/id/:enquiryId', 
  requireAuth, 
  requirePermissionMiddleware('cruise:read'),
  cruiseEnquiryController.getEnquiryById
);

// Get enquiries by email
router.get('/email/:email', 
  requireAuth, 
  requirePermissionMiddleware('cruise:read'),
  cruiseEnquiryController.getEnquiriesByEmail
);

// Get enquiries by cruise ID
router.get('/cruise/:cruiseId', 
  requireAuth, 
  requirePermissionMiddleware('cruise:read'),
  cruiseEnquiryController.getEnquiriesByCruiseId
);

// Update enquiry
router.put('/:enquiryId', 
  requireAuth, 
  requirePermissionMiddleware('cruise:update'),
  validateRequestBody(updateCruiseEnquiryValidator),
  cruiseEnquiryController.updateEnquiry
);

// Delete enquiry (Admin only)
router.delete('/:enquiryId', 
  requireAuth, 
  requirePermissionMiddleware('cruise:delete'),
  cruiseEnquiryController.deleteEnquiry
);

module.exports = router;
