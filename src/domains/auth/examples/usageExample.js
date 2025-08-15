const express = require('express');
const router = express.Router();

// Import auth middleware
const { requireAuth } = require('../middleware/auth');
const { 
  requirePermissionMiddleware,
  requireResourcePermissionMiddleware,
  requireRoleMiddleware,
  requireServiceAccessMiddleware
} = require('../middleware/authorization');

// Import validation
const { validateRequestBody } = require('../../../shared/utils/validators');

// Example: Hotel management routes
router.get('/hotels', 
  requireAuth, 
  requireResourcePermissionMiddleware('hotel', 'read'),
  (req, res) => {
    // Get hotels logic
    res.json({ message: 'Hotels retrieved successfully' });
  }
);

router.post('/hotels', 
  requireAuth, 
  requireResourcePermissionMiddleware('hotel', 'create'),
  validateRequestBody(hotelSchema),
  (req, res) => {
    // Create hotel logic
    res.json({ message: 'Hotel created successfully' });
  }
);

router.put('/hotels/:id', 
  requireAuth, 
  requireResourcePermissionMiddleware('hotel', 'update'),
  (req, res) => {
    // Update hotel logic
    res.json({ message: 'Hotel updated successfully' });
  }
);

router.delete('/hotels/:id', 
  requireAuth, 
  requireResourcePermissionMiddleware('hotel', 'delete'),
  (req, res) => {
    // Delete hotel logic
    res.json({ message: 'Hotel deleted successfully' });
  }
);

// Example: Admin only routes
router.get('/admin/users', 
  requireAuth, 
  requireRoleMiddleware('admin'),
  (req, res) => {
    // Admin only - get all users
    res.json({ message: 'All users retrieved successfully' });
  }
);

// Example: Manager and Admin routes
router.get('/admin/reports', 
  requireAuth, 
  requireRoleMiddleware(['admin', 'manager']),
  (req, res) => {
    // Manager and Admin - get reports
    res.json({ message: 'Reports retrieved successfully' });
  }
);

// Example: Service-specific access
router.get('/hotel/bookings', 
  requireAuth, 
  requireServiceAccessMiddleware('hotel'),
  (req, res) => {
    // Only users with hotel service access
    res.json({ message: 'Hotel bookings retrieved successfully' });
  }
);

// Example: Multiple permissions
router.post('/hotel/approve/:id', 
  requireAuth, 
  requirePermissionMiddleware('hotel:approve'),
  (req, res) => {
    // Approve hotel booking
    res.json({ message: 'Hotel booking approved successfully' });
  }
);

// Example: Complex authorization
router.get('/user/:userId/profile', 
  requireAuth, 
  requireOwnershipOrPermissionMiddleware('user:read'),
  (req, res) => {
    // Users can access their own profile or if they have user:read permission
    res.json({ message: 'User profile retrieved successfully' });
  }
);

module.exports = router;
