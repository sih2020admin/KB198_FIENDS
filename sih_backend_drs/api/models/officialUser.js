const mongoose = require("mongoose");

const officialUserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            maxlength: 255,
            required: true,
        },
        email: {
            type: String,
            maxlength: 255,
            required: true,
        },
        password: {
            type: String,
            maxlength: 255,
            required: true,
        },
        role: {
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

        isApproved: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

const OfficialUserModel = mongoose.model("officialUsers", officialUserSchema);

module.exports.OfficialUserModel = OfficialUserModel;
