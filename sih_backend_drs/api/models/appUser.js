const mongoose = require("mongoose");

const appUserSchema = new mongoose.Schema(
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
        address: {
            state: {
                type: String,
                maxlength: 255,
            },
            district: {
                type: String,
                maxlength: 255,
            },
            place: {
                type: String,
                maxlength: 255,
            },
            pincode: {
                type: String,
                maxlength: 255,
            },
        },
        fcmRegToken: {
            type: String,
            maxlength: 255,
        },
    },
    { minimize: false },
    { timestamps: true }
);
appUserSchema.index({ location: "2dsphere" });

const admin = require("firebase-admin");
const serviceAccount = require("../config/bwareFirebaseConfig.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://bware-68fe8.firebaseio.com",
});

appUserSchema.statics.sendAlert = function (userRegToken, payload) {
    const options = {
        priority: "high",
        timeToLive: 60 * 60 * 24,
    };

    let topic = "Alert";
    // subscribe to topic.
    admin
        .messaging()
        .subscribeToTopic(userRegToken, topic)
        .then(function (response) {
            console.log("Successfully subscribed to topic:", response);
            admin
                .messaging()
                // .sendToDevice(userRegToken, payload, options)
                .sendToTopic(topic, payload, options)
                .then((response) => {
                    // console.log(userRegToken);
                    admin
                        .messaging()
                        .unsubscribeFromTopic(userRegToken, topic)
                        .then(function (response) {
                            console.log(
                                "Successfully unsubscribed from topic:",
                                response
                            );
                        })
                        .catch(function (error) {
                            console.log(
                                "Error unsubscribing from topic:",
                                error
                            );
                        });
                    console.log(response);
                    return response;
                })
                .catch((error) => {
                    console.log(error);
                });
        })
        .catch(function (error) {
            console.log("Error subscribing to topic:", error);
        });
};

const appUserModel = mongoose.model("appUsers", appUserSchema);

module.exports.appUserModel = appUserModel;
