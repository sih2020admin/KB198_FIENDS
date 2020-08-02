const mongoose = require("mongoose");

let otpSchema = new mongoose.Schema({
    phNo: {
        type: String,
        maxlength: 13,
        required: true,
    },
    otp: {
        type: String,
        minlength: 4,
        maxlength: 4,
        required: true,
    },
    createdAt: {
        type: Date,
        expires: "15m",
        default: Date.now,
    },
});
otpSchema.statics.genOTP = () => {
    let otp = "";
    while (otp.length < 4) {
        otp += Math.floor(Math.random() * 9);
    }
    
    return otp;
    

};
const otpModel = mongoose.model("otps", otpSchema);

module.exports.otpModel = otpModel;
