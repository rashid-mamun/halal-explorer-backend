const express = require('express');
const router = express.Router();
const managerController = require('../controllers/managerController');
const {
  requireResourcePermissionMiddleware,
  requireRoleMiddleware
} = require('../../auth/middleware/authorization');
const { validateRequestQuery, validateRequestBody } = require('../../../shared/utils/validators');
const {
  managerInfoSchema,
  getManagerInfoSchema
} = require('../validators/hotelValidators');

// Health check route
router.get('/health', async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Manager API running',
    timestamp: new Date().toISOString()
  });
});

// Manager search - Manager role required
router.get('/search', 
  requireRoleMiddleware('manager'),
  managerController.managerSearch
);

// Add manager info - Manager role required
router.post('/info', 
  requireRoleMiddleware('manager'),
  requireResourcePermissionMiddleware('hotel', 'create'),
  validateRequestBody(managerInfoSchema),
  managerController.managerInfo
);

// Get all manager info - Admin/Manager only
router.get('/all', 
  requireRoleMiddleware(['admin', 'manager']),
  managerController.getAllManagerInfo
);

// Get specific manager info - Manager role required
router.get('/one', 
  requireRoleMiddleware('manager'),
  validateRequestQuery(getManagerInfoSchema),
  managerController.getManagerInfo
);

module.exports = router;
