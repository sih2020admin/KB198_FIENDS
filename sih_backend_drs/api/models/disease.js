const mongoose = require("mongoose");

const diseaseSchema = new mongoose.Schema({
    disease: {
        type: String,
        maxlength: 4096,
    },
    description: {
        type: String,
        maxlength: 4096,
    },
    guidelines: {
        type: String,
        maxlength: 4096,
    },
    symptoms: {
        humans: {
            type: [String],
        },
        animals: {
            type: [String],
        },
    },
    treatments: {
        humans: {
            type: [String],
        },
        animals: {
            type: [String],
        },
    },
    severity: {
        type: String,
        maxlength: 255,
    },
});

const DiseaseModel = mongoose.model("Diseases", diseaseSchema);

module.exports.DiseaseModel = DiseaseModel;
