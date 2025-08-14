const mongoose = require('mongoose');
const { Schema } = mongoose;

const activityManagerSchema = new Schema({
    id: { type: String, required: true, unique: true },
    managerName: { type: String, required: true },
    email: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('ActivityManager', activityManagerSchema);