const { getClient } = require('../../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const COLLECTION_NAME = 'users';

exports.getOneUser = async (req, res) => {
    try {
        if (req.userEmail !== req.params.email) {
            return res.status(400).json({
                success: false,
                message: 'User is not valid'
            });
        }
        const email = req.params.email;
        const client = getClient();
        const db = client.db(process.env.DB_NAME);
        const usersCollection = db.collection(COLLECTION_NAME);
        const user = await usersCollection.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

exports.updateOneUser = async (req, res) => {
    const profileData = {
        email: req.body.newEmail,
        password: req.body.password,
        role: req.body.role
    };
    try {
        if (req.userRole !== 'admin') {
            return res.status(400).json({
                success: false,
                message: 'User is not valid'
            });
        }
        const email = req.params.email;
        const client = getClient();
        const db = client.db(process.env.DB_NAME);
        const usersCollection = db.collection(COLLECTION_NAME);
        const result = await usersCollection.updateOne(
            { email },
            { $set: profileData }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found or profile not updated',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
        });
    } catch (e) {
        console.error('Error updating user:', e);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

exports.updateOneUserPassword = async (req, res) => {
    try {
        if (req.userEmail !== req.params.email) {
            return res.status(400).json({
                success: false,
                message: 'User is not valid'
            });
        }
        const email = req.params.email;
        const client = getClient();
        const db = client.db(process.env.DB_NAME);
        const usersCollection = db.collection(COLLECTION_NAME);
        const user = await usersCollection.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const newHashedPassword = await bcrypt.hash(req.body.password, 10);
        const isValidPassword = await bcrypt.compare(
            req.body.oldPassword,
            user.password
        );

        if (!isValidPassword) {
            return res.status(400).json({
                success: false,
                message: 'Invalid old password'
            });
        }

        await usersCollection.updateOne(
            { email },
            { $set: { password: newHashedPassword } }
        );

        return res.status(200).json({
            success: true,
            message: 'Password updated successfully!',
        });
    } catch (e) {
        console.error('Error updating password:', e);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

exports.deleteOneUser = async (req, res) => {
    try {
        if (req.userRole !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'User is not authorized to delete users'
            });
        }

        const email = req.params.email;
        const client = getClient();
        const db = client.db(process.env.DB_NAME);
        const usersCollection = db.collection(COLLECTION_NAME);
        const user = await usersCollection.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const deletionResult = await usersCollection.deleteOne({ email });

        if (deletionResult.deletedCount === 1) {
            return res.status(200).json({
                success: true,
                message: 'User deleted successfully',
            });
        } else {
            return res.status(500).json({
                success: false,
                message: 'Failed to delete user'
            });
        }
    } catch (e) {
        console.error('Error deleting user:', e);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

exports.getAllUser = async (req, res) => {
    try {
        const client = getClient();
        const db = client.db(process.env.DB_NAME);
        const usersCollection = db.collection(COLLECTION_NAME);
        const result = await usersCollection.find().toArray();

        return res.status(200).json({
            success: false,
            data: result
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};
