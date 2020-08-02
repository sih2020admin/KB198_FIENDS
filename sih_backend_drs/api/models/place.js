const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema({
    state: {
        type: String,
        maxlength: 255,
        required: true,
    },
    district: {
        type: String,
        maxlength: 255,
        required: true,
    },
    place: {
        type: String,
        maxlength: 255,
        required: true,
    },
    city: {
        type: String,
        maxlength: 255,
    },
    pincode: {
        type: String,
        maxlength: 255,
    },
    location: [Number, Number],
});
const districtSchema = new mongoose.Schema({
    state: {
        type: String,
        maxlength: 255,
        required: true,
    },
    district: {
        type: String,
        maxlength: 255,
        required: true,
    },
    capital: {
        type: String,
        maxlength: 255,
    },
    population: {
        type: Number,
    },
    area: {
        type: Number,
    },
    location: [Number, Number],
});
const stateSchema = new mongoose.Schema({
    state: {
        type: String,
        maxlength: 255,
        required: true,
    },
    capital: {
        type: String,
        maxlength: 255,
    },
    population: {
        type: Number,
    },
    area: {
        type: Number,
    },
    location: { type: [Number, Number], required: true },
});

const countrySchema = new mongoose.Schema({
    country: {
        type: String,
        maxlength: 255,
        required: true,
    },
    capital: {
        type: String,
        maxlength: 255,
    },
    population: {
        type: Number,
    },
    area: {
        type: Number,
    },
    location: { type: [Number, Number], required: true },
});

const countryModel = mongoose.model("countryDetails", countrySchema);
const StateModel = mongoose.model("stateDetails", stateSchema);
const DistrictModel = mongoose.model("districtDetails", districtSchema);
const PlaceModel = mongoose.model("placeDetails", placeSchema);

module.exports.countryModel = countryModel;
module.exports.StateModel = StateModel;
module.exports.DistrictModel = DistrictModel;
module.exports.PlaceModel = PlaceModel;
