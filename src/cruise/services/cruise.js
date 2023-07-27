const { v4: uuidv4 } = require('uuid');
const { getClient } = require('../../config/database');

async function saveCruiseEnquiry(enquiryData) {
    try {
        const client = await getClient();
        const db = client.db(process.env.DB_NAME);
        const collection = db.collection('cruise_enquiries');


        const existingEnquiry = await collection.findOne(enquiryData);
        if (existingEnquiry) {
            return {
                success: false,
                message: 'Duplicate enquiry. Enquiry with the same data already exists.',
                data: existingEnquiry,
            };
        }

        const result = await collection.insertOne(enquiryData);
        console.log(JSON.stringify(result, null, 2));
        if (result.acknowledged && result.insertedId) {
            return {
                success: true,
                message: 'Save cruise enquiry successfully.',
                data: { _id: result.insertedId, ...enquiryData },
            };
        }
        else {
            return {
                success: false,
                message: 'Failed to save cruise enquiry',
            };
        }
    } catch (err) {
        console.error('Failed to save cruise enquiry:', err);
        return {
            success: false,
            message: 'Failed to save cruise enquiry',
        };
    }
}
async function getAllCruiseEnquiries() {
    try {
        const client = await getClient();
        const db = client.db(process.env.DB_NAME);
        const collection = db.collection('cruise_enquiries');

        const cruiseEnquiries = await collection.find({}).toArray();
        return {
            success: true,
            data: cruiseEnquiries
        };
    } catch (err) {
        console.error('Failed to fetch cruise enquiries:', err);
        return {
            success: false,
            message: 'FFailed to fetch cruise enquiries.',
        };
    }
}

module.exports = {
    saveCruiseEnquiry,
    getAllCruiseEnquiries,
};
