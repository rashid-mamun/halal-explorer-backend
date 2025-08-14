const mongoose = require('mongoose');
const { Schema } = mongoose;

const terminalSchema = new Schema({
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    content: { type: Schema.Types.Mixed, required: true },
    countryCode: { type: String, required: true },
    coordinates: {
        latitude: { type: Number },
        longitude: { type: Number },
    },
    language: { type: String, required: true },
}, { timestamps: true });

// Create text index for search
terminalSchema.index({ name: 'text' }, { default_language: 'english', language_override: 'language' });

module.exports = {
    Terminal: mongoose.model('Terminal', terminalSchema),
};