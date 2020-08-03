const express = require("express");
const jwt = require("jsonwebtoken");
const GeoJSON = require("geojson");
const router = express.Router();

const { appUserModel } = require("../models/appUser");
const { otpModel } = require("../models/otp");

const { appUserAuth } = require("../middlewares/auth/appUser");
const { OutrageModel } = require("../models/outrage");

const { Client, serverPhNo } = require("../config/twilio");
// { phNo }

router.post("/register/sendOTP", async (req, res) => {
    let payload = req.body;
    try {
        payload.phNo = payload.phNo.toString();

        if (payload.phNo.indexOf("+91") != 0) {
            payload.phNo = "+91" + payload.phNo;
        }

        payload.otp = otpModel.genOTP();

        // delete if otp is already present
        await otpModel.deleteMany({ phNo: payload.phNo });
        await appUserModel.deleteMany({ phNo: payload.phNo });

        let userOTP = new otpModel(payload);
        let result = await userOTP.save();
        if (!result) return res.status(500).json({ error: "failed try again" });

        // send otp to phNo
        result = await Client.messages.create({
            body: `Your BWARE registration OTP is : ${payload.otp}`,
            from: serverPhNo,
            to: payload.phNo,
        });

        if (!result) return res.status(500).json({ error: "failed try again" });

        return res.status(200).json({ response: "OTP sent" });
    } catch (error) {
        return res.status(500).json({ error: error });
    }
});

// {otp, phNo}
router.post("/register/confirmOTP", async (req, res) => {
    let payload = req.body;
    payload.otp = payload.otp.toString();
    payload.phNo = payload.phNo.toString();
    if (payload.phNo.indexOf("+91") != 0) {
        payload.phNo = "+91" + payload.phNo;
    }

    try {
        let userOTP = await otpModel.findOne({ phNo: payload.phNo });

        if (userOTP.otp == payload.otp) {
            let appUser = new appUserModel(payload);
            let result = await appUser.save();

            if (!result)
                return res.status(500).json({ error: "failed try again" });

            const token = jwt.sign(
                { id: result._id, phNo: payload.phNo },
                process.env.JWT_SECRET
            );

            return res.json({ "x-user-token": "Bearer " + token });
        } else {
            return res.status(403).json({ error: "otp didn't match" });
        }
    } catch (error) {
        return res.status(500).json({ error: error });
    }
});

// {otp, phNo}
router.post("/onlinePing", appUserAuth, async (req, res) => {
    let phNo = req.user.phNo;

    try {
        console.log(phNo);
    } catch (error) {
        return res.status(500).json({ error: error });
    }
});
// {location or address}
router.put("/register/details", appUserAuth, async (req, res) => {
    const phNo = req.user.phNo;
    let payload = req.body;
    console.log(payload);
    // don't allow to change phone number
    // // add +91 to phNo if it exist
    // if (payload.phNo) {
    //     payload.phNo = payload.phNo.toString();
    //     if (payload.phNo.indexOf("+91") != 0) {
    //         payload.phNo = "+91" + payload.phNo;
    //     }
    // }
    try {
        let appUser = await appUserModel.findOneAndUpdate(
            { phNo: phNo },
            payload,
            {
                new: true,
            }
        );

        let result = await appUser.save();
        if (!result)
            return res.status(500).json({ error: "failed to update details" });

        return res.status(200).json({ response: "Details are updated" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error });
    }
});

// returns list of ACTIVE nearby outrages
router.get(
    "/nearByOutrages/:coordinates/:meters",
    appUserAuth,
    async (req, res) => {
        const meters = Number(req.params.meters);
        const coordinates = JSON.parse(req.params.coordinates);

        try {
            let outrages = await OutrageModel.aggregate([
                {
                    $geoNear: {
                        near: { type: "Point", coordinates: coordinates },
                        // maxDistance: meters,
                        query: { isCaseOpen: true },
                        distanceField: "distance",
                        spherical: true,
                    },
                    // use distanceMultiplier to convert to kilometer
                },
                // check (distance - meters) <= alertRadius
                {
                    $match: {
                        $expr: {
                            $lte: [
                                { $subtract: ["$distance", meters] },
                                "$alertRadius",
                            ],
                        },
                    },
                },
                {
                    $addFields: {
                        isRedZone: {
                            $cond: [
                                { $lte: ["$distance", "$alertRadius"] },
                                true,
                                false,
                            ],
                        },
                    },
                },
                {
                    $project: {
                        // _id: 0,
                        dailyMorbidityObj: 0,
                        dailyMortalityObj: 0,
                        dailyCuredObj: 0,
                        __v: 0,
                    },
                },
            ]);
            return res
                .status(200)
                .json(GeoJSON.parse(outrages, { Point: "location" }));
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: error });
        }
    }
);

// returns list of redzones when user is currently
// inside one or more redzones
router.get("/redZones/:coordinates", appUserAuth, async (req, res) => {
    const coordinates = JSON.parse(req.params.coordinates);
    const meters = 20000;
    // limit
    try {
        // inefficent because it scans for all the documents
        let outrages = await OutrageModel.aggregate([
            {
                $geoNear: {
                    near: { type: "Point", coordinates: coordinates },
                    maxDistance: meters,
                    // query: { isCaseOpen: true },
                    distanceField: "distance",
                    // distance in meters
                    spherical: true,
                },
            },
            {
                // use lte
                $match: {
                    $expr: { $lte: ["$distance", "$alertRadius"] },
                },
            },
            {
                $project: {
                    dailyMorbidityObj: 0,
                    dailyMortalityObj: 0,
                    dailyCuredObj: 0,
                    __v: 0,
                },
            },
            // { $match: { within: true } },
            {
                $group: {
                    _id: { _id: null },
                    activeOutrages: {
                        $push: {
                            $cond: [
                                { $eq: ["$isCaseOpen", true] },
                                "$$ROOT",
                                "$$REMOVE",
                            ],
                        },
                    },
                    previousOutrages: {
                        $push: {
                            $cond: [
                                { $eq: ["$isCaseOpen", false] },
                                "$$ROOT",
                                "$$REMOVE",
                            ],
                        },
                    },
                },
            },
        ]);

        if (outrages.length == 0) return res.json([]);

        result = {
            activeOutrages: GeoJSON.parse(outrages[0].activeOutrages, {
                Point: "location",
            }),
            previousOutrages: GeoJSON.parse(outrages[0].previousOutrages, {
                Point: "location",
            }),
        };

        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error });
    }
});

module.exports = router;
