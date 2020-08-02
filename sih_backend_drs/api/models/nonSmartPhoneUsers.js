const mongoose = require("mongoose");
const { Client, serverPhNo } = require("../config/twilio");

const nonSmartPhoneUserSchema = new mongoose.Schema(
    {
        phNo: {
            type: String,
            minlength: 10,
            maxlength: 13,
            required: true,
        },
        location: {
            type: [Number, Number],
        },
        state: {
            type: String,
            maxlength: 255,
        },
        state: {
            type: String,
            maxlength: 255,
        },
        place: {
            type: String,
            maxlength: 255,
            required: true,
        },
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
    },
    { timestamps: true }
);
nonSmartPhoneUserSchema.index({ location: "2dsphere" });

nonSmartPhoneUserSchema.statics.sendSms = async function (phNoArr, message) {
    try {
        phNoArr.forEach(async (phNo) => {
            await Client.messages.create({
                body: message,
                from: serverPhNo,
                to: phNo,
            });
        });
    } catch (error) {
        return null;
    }
};

const NonSmartPhoneUserModel = mongoose.model(
    "nonSmartPhoneUsers",
    nonSmartPhoneUserSchema
);

module.exports.NonSmartPhoneUserModel = NonSmartPhoneUserModel;
