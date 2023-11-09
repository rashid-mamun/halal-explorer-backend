const { getClient } = require('../../config/database');
const bcrypt = require('bcrypt');
const COLLECTION_NAME = 'users';
async function createUser(email, password, role,managerInfo) {
    const client = getClient();
    const db = client.db(process.env.DB_NAME);
    const users = db.collection(COLLECTION_NAME);
    await users.createIndex({ email: 1 }, { unique: true });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
        email,
        password: hashedPassword,
        role,
        managerInfo
    };
    const result = await users.insertOne(user);
    if (!result.acknowledged) {
        return {
            success: false
        }
    }
    return {
        success: true
    };
}

async function getUserByEmail(email) {
    const client = getClient();
    const db = client.db(process.env.DB_NAME);
    const users = db.collection(COLLECTION_NAME);

    return users.findOne({ email });
}
async function updateUser(email, newRole) {
    const client = getClient();
    const db = client.db(process.env.DB_NAME);
    const users = db.collection(COLLECTION_NAME);

    try {
        const result = await users.updateOne(
            { email },
            { $set: { role: newRole } }
        );

        if (result.modifiedCount === 0) {
            return {
                success: false,
                message: 'User not found or role not updated'
            };
        }

        return {
            success: true,
            message: 'User role updated successfully'
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: 'Internal server error'
        };
    }
}


module.exports = {
    createUser,
    getUserByEmail,
    updateUser,
};

