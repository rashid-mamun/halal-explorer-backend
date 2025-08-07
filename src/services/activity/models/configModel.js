const mongoose = require('mongoose');
const { Schema } = mongoose;

const configSchema = new Schema({
    id: { type: String, required: true, unique: true },
    type: { type: String, required: true }, // e.g., 'halalActivityStructure'
    data: { type: Schema.Types.Mixed, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Config', configSchema);