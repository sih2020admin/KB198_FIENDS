const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const Client = require("twilio")(accountSid, authToken);
const serverPhNo = process.env.TWILIO_PHONE_NO;

module.exports = { Client, serverPhNo };
