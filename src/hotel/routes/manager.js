const express = require('express');
const router = express.Router();
const apiController = require('../controller/index');

router.get('/api', async (req, res) => {
  res.status(200).json({
    message: 'Manager API running',
  });
});

router.get('/search', apiController.managerSearch);
router.post('/info', apiController.managerInfo);
router.get('/all', apiController.getAllManagerInfo);
router.get('/one', apiController.getManagerInfo);

module.exports = router;
