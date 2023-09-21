const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const checkLogin = require('../middleware/checkLogin');
const authorizeRoles = require('../middleware/authorizeRoles');

router.post('/login', authController.login);
router.post('/signup', authController.register);

router.get('/protected-resource', checkLogin, (req, res) => {
    res.json({ message: 'Protected resource accessed successfully.' });
});
router.get('/admin/add', checkLogin, authorizeRoles(['admin']), authController.addAdmin);

module.exports = router;
