const mongoose = require('mongodb');

// Define parking schema
const parkingSchema = new mongoose.Schema({
    _id: String,
    nameParking: String,
    address: String,
    longitude: Number,
    latitude: Number,
    price: Number,
    maxSlot: Number,
    Value_empty_slot: Number,
    emptySlot: Number,
    lastModified: Date
});

const Parking = mongoose.model('Parking', parkingSchema);

module.exports = Parking;
