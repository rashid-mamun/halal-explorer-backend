const express = require('express');
const router = express.Router();

// Import auth middleware
const { requireAuth } = require('./domains/auth/middleware/auth');
const { 
  requirePermissionMiddleware,
  requireResourcePermissionMiddleware,
  requireRoleMiddleware,
  requireServiceAccessMiddleware
} = require('./domains/auth/middleware/authorization');

// Import existing routes
const hotelRoutes = require('./domains/hotel/routes');
const activityRoutes = require('./domains/activity/routes');
const insuranceRoutes = require('./domains/insurance/routes');
const holidayRoutes = require('./domains/holiday/routes');
const cruiseRoutes = require('./domains/cruise/routes');
const transferRoutes = require('./domains/transfer/routes');

// Health check route (public)
router.get('/', (req, res) => {
  res.status(200).send('<h1 style="text-align: center">Halal Explorer API Online, 2023!</h1>');
});

// Public routes (no authentication required)
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is healthy',
    timestamp: new Date().toISOString()
  });
});

// Protected routes with role-based authentication
// Hotel routes
router.use('/hotel', 
  requireAuth,
  requireServiceAccessMiddleware('hotel'),
  hotelRoutes
);

// Activity routes
router.use('/activity', 
  requireAuth,
  requireServiceAccessMiddleware('activity'),
  activityRoutes
);



// Insurance routes
router.use('/insurance', 
  requireAuth,
  requireServiceAccessMiddleware('insurance'),
  insuranceRoutes
);

// Holiday routes
router.use('/holiday', 
  requireAuth,
  requireServiceAccessMiddleware('holiday'),
  holidayRoutes
);

// Cruise routes
router.use('/cruise', 
  requireAuth,
  requireServiceAccessMiddleware('cruise'),
  cruiseRoutes
);

// Transfer routes
router.use('/transfer', 
  requireAuth,
  requireServiceAccessMiddleware('transfers'),
  transferRoutes
);

module.exports = router;