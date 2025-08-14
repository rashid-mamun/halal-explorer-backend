const mongoose = require('mongoose');
const { Schema } = mongoose;

const dumbHotelSchema = new Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String },
    postal_code: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
    region: { type: Schema.Types.Mixed },
    description_struct: { type: Schema.Types.Mixed },
    images: [{ type: String }],
    star_rating: { type: Number, default: 0 },
    email: { type: String },
    is_closed: { type: Boolean },
    metapolicy_extra_info: { type: Schema.Types.Mixed },
    policy_struct: { type: Schema.Types.Mixed },
    facts: { type: Schema.Types.Mixed },
    hotel_chain: { type: String },
    front_desk_time_start: { type: String },
    front_desk_time_end: { type: String },
    is_gender_specification_required: { type: Boolean },
    amenity_groups: [{ group_name: String, amenities: [String] }],
}, { timestamps: true });

dumbHotelSchema.index({ address: 'text', name: 'text' });

module.exports = mongoose.model('DumbHotel', dumbHotelSchema);