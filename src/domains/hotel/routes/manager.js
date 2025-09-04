const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../auth/middleware/auth');
const { requireResourcePermissionMiddleware } = require('../../auth/middleware/authorization');
const apiController = require('../controllers');

router.get('/api', async (req, res) => {
  res.status(200).json({
    message: 'Manager API running',
  });
});

// Public routes
router.get('/search', apiController.managerSearch);
router.get('/all', apiController.getAllManagerInfo);
router.get('/one', apiController.getManagerInfo);

// Protected routes
router.post('/info', 
  requireAuth, 
  requireResourcePermissionMiddleware('hotel', 'create'),
  apiController.managerInfo
);

module.exports = router;
