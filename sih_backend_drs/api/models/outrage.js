const mongoose = require("mongoose");

const outrageSchema = new mongoose.Schema(
    {
        disease: {
            type: String,
            maxlength: 255,
            required: true,
        },
        place: {
            type: String,
            maxlength: 255,
            required: true,
        },
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
        location: {
            type: [Number, Number],
            required: true,
        },
        alertRadius: {
            type: Number,
            min: 0,
            required: true,
        },
        dailyMorbidityObj: {
            type: Object,
            default: {},
        },
        morbidityCount: {
            type: Number,
            min: 0,
            default: 0,
        },
        dailyMortalityObj: {
            type: Object,
            default: {},
        },
        mortalityCount: {
            type: Number,
            min: 0,
            default: 0,
        },
        dailyCuredObj: {
            type: Object,
            default: {},
        },
        curedCount: {
            type: Number,
            min: 0,
            default: 0,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
        },
        isCaseOpen: {
            type: Boolean,
            default: true,
        },
        guidelines: {
            type: String,
            maxlength: 4096,
        },
        description: {
            type: String,
            maxlength: 4096,
        },
        report: {
            type: String,
            maxlength: 255,
        },
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        // diseaseId:{
        //     type: mongoose.Types.ObjectId,
        // }
    },
    { minimize: false },
    { timestamps: true }
);

const locationBasedAlertSchema = new mongoose.Schema({
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    alertRadius: {
        type: Number,
        min: 0,
        required: true,
    },
    place: {
        type: String,
    },
    location: {
        type: [Number, Number],
        required: true,
    },
    outrage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "outrages",
    },
    message: {
        type: String,
        maxlength: 4096,
    },
});

const virtualRedzoneSchema = new mongoose.Schema({
    isCaseOpen: {
        type: Boolean,
        default: true,
    },
    maxAllowedPopulation: {
        type: Number,
        min: 0,
        required: true,
    },
    alertRadius: {
        type: Number,
        min: 0,
        required: true,
    },
    place: {
        type: String,
    },
    state: {
        type: String,
    },
    district: {
        type: String,
        required: true,
    },
    location: {
        type: [Number, Number],
        required: true,
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    alertPhNo: {
        type: String,
        required: true,
    },
});

outrageSchema.index({ location: "2dsphere" });
virtualRedzoneSchema.index({ location: "2dsphere" });
const OutrageModel = mongoose.model("outrages", outrageSchema);

const LocationHistoryAlertModel = mongoose.model(
    "locationHistoryAlerts",
    locationBasedAlertSchema
);
const VirtualRedzoneModel = mongoose.model(
    "virtaualredzones",
    virtualRedzoneSchema
);

module.exports.OutrageModel = OutrageModel;
module.exports.LocationHistoryAlertModel = LocationHistoryAlertModel;
module.exports.VirtualRedzoneModel = VirtualRedzoneModel;
