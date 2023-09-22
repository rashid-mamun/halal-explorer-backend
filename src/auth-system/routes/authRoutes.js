const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const checkLogin = require('../middleware/checkLogin');
const authorizeRoles = require('../middleware/authorizeRoles');
const usersController = require('../controllers/users');


router.post('/login', authController.login);
router.post('/signup', authController.register);
router.post('/users/admin/add', checkLogin, authorizeRoles(['admin']), authController.addAdmin);
router.post('/users/employee/add', checkLogin, authorizeRoles(['employee']), authController.addEmployee);

router.put('/users/:email', checkLogin, authorizeRoles(['admin', 'employee']), usersController.updateOneUser);
router.put('/users/:email/password', checkLogin, authorizeRoles(['admin', 'employee', 'manager']), usersController.updateOneUserPassword);

router.get('/protected-resource', checkLogin, (req, res) => {
    res.json({ message: 'Protected resource accessed successfully.' });
});

router.get('/users/:email', checkLogin, authorizeRoles(['admin', 'employee', 'manager']), usersController.getOneUser);
router.get('/users', checkLogin, authorizeRoles(['admin', 'employee', 'manager']), usersController.getAllUser);
router.delete('/users/:email', checkLogin, authorizeRoles(['admin']), usersController.deleteOneUser);

module.exports = router;
