const mongoose = require('mongoose');
const { Schema } = mongoose;

const activityDestinationSchema = new Schema({
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
}, { timestamps: true });

activityDestinationSchema.index({ name: 'text' }, { default_language: 'english', language_override: 'language' });

module.exports = mongoose.model('ActivityDestination', activityDestinationSchema);