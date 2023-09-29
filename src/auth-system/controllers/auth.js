const jwt = require('jsonwebtoken');
const { createUser, getUserByEmail, updateUser } = require('../models/user');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const { isEmail } = require('validator');
const nodemailer = require('nodemailer');

// Set up email transporter
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'your_email@gmail.com',
        pass: 'your_password'
    }
});



async function register(req, res) {
    try {
        const { error } = signupSchema.validate(req.body);
        if (error) throw new Error(error.details[0].message);

        const email = req.body.email;
        const password = req.body.password;


        const mailOptions = {
            from: 'your_email@gmail.com', // Replace with your Gmail email address
            to: email,
            subject: 'Registration Complete',
            text: `You have successfully registered. Email: ${email}, Password: ${password}`
        };


    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}



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

function generateToken(user) {
    return jwt.sign(
        {
            email: user.email,
            role: user.role,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_SECRET_TIME_LIMIT,
        }
    );
}
async function login(req, res) {
    try {
        const { error } = loginSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const { email, password } = req.body;
        const user = await getUserByEmail(email);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication failed!'
            });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (isValidPassword) {
            const token = generateToken(user);

            return res.status(200).json({
                success: true,
                message: 'Login successful!',
                access_token: token,
                data: user,
            });
        } else {
            return res.status(401).json({
                success: false,
                message: 'Authentication failed!'
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
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
        const mailOptions = {
            from: 'your_email@gmail.com', // Replace with your Gmail email address
            to: email,
            subject: 'Registration Complete',
            text: `You have successfully registered. Email: ${email}, Password: ${password}`
        };
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
         // Send the email
         transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
                res.status(500).json({ error: 'Email could not be sent due to a problem.' });
            } else {
                console.log('Email sent successfully: ' + info.response); 

                res.status(201).json({ success: true, message: 'User created and email sent successfully' });
            }
        });
        // res.status(201).json({
        //     success: true,
        //     message: 'User created successfully'
        // });
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
        return res.status(500).json({
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
