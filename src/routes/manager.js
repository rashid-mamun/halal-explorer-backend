const express = require('express');
const router = express.Router();
const apiRoutes = require('../controller/index');

router.get('/search', apiRoutes.halalSearch);
router.post('/info', apiRoutes.managerInfo);
router.get('/all', apiRoutes.getAllManager);
router.get('/one', apiRoutes.getManager);

router.get('/api', async (req, res) => {
    res.status(200).json({
        message: 'Manager api running up',
    });
});

module.exports = router;