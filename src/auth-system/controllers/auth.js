const jwt = require('jsonwebtoken');
const { createUser, getUserByEmail, updateUser } = require('../models/user');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const { isEmail } = require('validator');

const signupSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('employee', 'manager', 'admin').required(),
    managerInfo: Joi.object()
});
const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

const adminAddSchema = Joi.object({
    email: Joi.string().email().required(),
    role: Joi.string().valid('admin', 'employee', 'manager').required(),
});
const employeeAddSchema = Joi.object({
    email: Joi.string().email().required(),
    role: Joi.string().valid('employee', 'manager').required(),
});
// Authenticate user and generate JWT token
async function login(req, res) {
    try {
        const { error } = loginSchema.validate(req.body);
        if (error) throw new Error(error.details[0].message);

        const { email, password } = req.body;
        const user = await getUserByEmail(email);

        if (user) {
            const isValidPassword = await bcrypt.compare(
                password,
                user.password
            );

            if (isValidPassword) {
                /* 
                        generate token
                    */
                const token = jwt.sign(
                    {
                        email: user.email,
                        role: user.role,
                    },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: process.env.JWT_SECRET_TIME_LIMIT,
                    }
                );

                res.status(200).json({
                    success: true,
                    message: 'login  successful!',
                    access_token: token,
                    data: user,
                });
            } else {
                res.status(401).json({
                    success: false,
                    error: 'Authetication failed!',
                });
            }
        }
        else {
            res.status(401).json({
                success: false,
                error: 'Authetication failed!',
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function register(req, res) {
    try {
        const { error } = signupSchema.validate(req.body);
        if (error) throw new Error(error.details[0].message);
        const { email, password, role, managerInfo } = req.body;

        if (!isEmail(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            }); // Update the user's role to "admin"
        }
        const user = await createUser(email, password, role, managerInfo);
        if (!user.success) {
            res.status(201).json({
                success: false,
                message: 'User creation failed'
            });
        }
        res.status(201).json({
            success: true,
            message: 'User created successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}
async function updateUserRole(req, res, allowedRole, schema) {
    try {
        if (req.userRole !== allowedRole) {
            return res.status(403).json({
                success: false,
                message: `User is not authorized to update ${allowedRole} roles`
            });
        }

        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const { email, role } = req.body;
        const existingUser = await getUserByEmail(email);

        if (!existingUser) {
            return res.status(400).json({
                success: false,
                message: 'No valid user found'
            });
        }

        const updatedUser = await updateUser(email, role);

        if (!updatedUser.success) {
            return res.status(400).json({
                success: false,
                message: 'User role update failed'
            });
        }

        res.status(201).json({
            success: true,
            message: 'User role updated successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

async function addAdmin(req, res) {
    await updateUserRole(req, res, 'admin', adminAddSchema);
}

async function addEmployee(req, res) {
    await updateUserRole(req, res, 'employee', employeeAddSchema);
}




module.exports = {
    login,
    register,
    addAdmin,
    addEmployee,
};
