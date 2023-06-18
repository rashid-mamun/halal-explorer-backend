const { getClient } = require("../config/database");

const saveOrUpdateManagerInfo = async (managerInfo) => {
    try {
        const client = getClient();
        const db = client.db(process.env.DB_NAME);
        const collection = db.collection('managerInfo');

        const existingManager = await collection.findOne({ id: managerInfo.id });

        if (existingManager) {
            await collection.updateOne({ id: managerInfo.id }, { $set: managerInfo });
        } else {
            // Insert new manager information
            await collection.insertOne(managerInfo);
        }

        const managersData = await collection.find().toArray();
        return {
            success: true,
            message: 'Manager information saved/updated successfully',
            data: managersData,
        };
    } catch (err) {
        return {
            success: false,
            error: 'Failed to save/update manager information',
        };
    }
};

const getAllManagerInfo = async (req) => {
    try {
        const client = getClient();
        const db = client.db(process.env.DB_NAME);
        const collection = db.collection('managerInfo');
        const managersData = await collection.find().toArray();
        const page = req.page;
        const pageNumber = parseInt(page, 10) || 1;
        const pageSize = parseInt(req.pageSize, 10) || 20;
        const totalManagers = managersData.length;

        // Validate page number
        const maxPageNumber = Math.ceil(totalManagers / pageSize);
        if (pageNumber > maxPageNumber) {
            return {
                success: false,
                message: 'Invalid page number',
            };
        }

        // Calculate the offset and limit
        const offset = (pageNumber - 1) * pageSize;
        const limit = pageSize;
        const paginatedData = managersData.slice(offset, offset + limit);
        return {
            success: true,
            message: 'Get manager information  successfully',
            data: paginatedData,
        };

    } catch (error) {
        console.log(error);
        return {
            success: false,
            error: 'Failed to get manager information',
        };
    }
}
const getManagerInfo = async (req) => {
    try {
        const client = getClient();
        const db = client.db(process.env.DB_NAME);
        const collection = db.collection('managerInfo');
        console.log(req.id);
        const manager = await collection.findOne({ id: req.id });

        if (manager) {
            return {
                success: true,
                message: 'Manager information retrieved successfully',
                data: manager,
            };
        } else {
            return {
                success: false,
                message: 'No  manager found with the specified ID',
                error: 'manager not found',
            };
        }
    } catch (error) {
        console.error('Failed to get manager information:', error);
        return {
            success: false,
            message: 'Failed to retrieve manager information',
            error: 'Internal server error',
        };
    }
};

module.exports = {
    saveOrUpdateManagerInfo,
    getManagerInfo,
    getAllManagerInfo
};
