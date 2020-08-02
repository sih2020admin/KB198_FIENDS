const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();
const GeoJSON = require("geojson");

const bcryptjs = require("bcryptjs");
let cors = require("cors");

router.use(
    cors({
        origin: [
            "http://localhost:5555",
            "http://localhost:3000",
            "https://tempautocomplete.herokuapp.com",
            "https://bwaredrs.co",
        ],
        credentials: true,
    })
);

const {
    OutrageModel,
    LocationHistoryAlertModel,
    VirtualRedzoneModel,
} = require("../models/outrage");
const { OfficialUserModel } = require("../models/officialUser");
const { appUserModel } = require("../models/appUser");
const { NonSmartPhoneUserModel } = require("../models/nonSmartPhoneUsers");
const { DiseaseModel } = require("../models/disease");

const {
    StateModel,
    DistrictModel,
    PlaceModel,
    countryModel,
} = require("../models/place");

const { officialWebAuth } = require("../middlewares/auth/officialWebAuth");
const { NewKeyList } = require("twilio/lib/rest/api/v2010/account/newKey");

router.post("/login", async (req, res) => {
    const payload = req.body;
    try {
        let user = await OfficialUserModel.findOne({ email: payload.email });
        if (!user) return res.status(500).json({ error: "incorrect email" });

        let result = await bcryptjs.compare(payload.password, user.password);

        if (!result)
            return res.status(500).json({ error: "password incorrect" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        return res.json({ "x-official-token": "Bearer " + token });
    } catch (error) {
        return res.status(500).json({ error: error });
    }
});

router.post("/register", async (req, res) => {
    const payload = req.body;
    try {
        let salt = await bcryptjs.genSalt(10);
        payload.password = await bcryptjs.hash(payload.password, salt);

        let user = await OfficialUserModel.findOne({ email: payload.email });
        if (user)
            return res
                .status(500)
                .json({ error: "this email is already registered" });

        user = new OfficialUserModel(payload);

        let result = await user.save();

        if (!result) return res.status(500).json({ error: "failed try again" });

        const token = jwt.sign({ id: result._id }, process.env.JWT_SECRET);
        return res.json({ "x-official-token": "Bearer " + token });
    } catch (error) {
        return res.status(500).json({ error: error });
    }
});

router.get("/getOutrage/:outrageId", async (req, res) => {
    const outrageId = req.params.outrageId;
    try {
        let outrage = await OutrageModel.findById(
            OutrageModel.base.Types.ObjectId(outrageId)
        );
        return res.json(outrage);
    } catch (error) {
        return res.status(500).json({ error: error });
    }
});

const sendAlertToNearByUsers = async function (
    location,
    payload,
    maxDistance = 50000,
    locationHistoryFlag
) {
    try {
        let nearbyUsers = await appUserModel.aggregate([
            {
                $geoNear: {
                    near: { type: "Point", coordinates: location },
                    maxDistance: parseInt(maxDistance),
                    distanceField: "distance",
                    // distanceMultiplier: 0.001,
                    spherical: true,
                },
                // use distanceMultiplier to convert to kilometer
            },
            {
                $project: {
                    location: 1,
                    fcmRegToken: 1,
                    distance: 1,
                },
            },
        ]);

        // fetch reg token of users
        let userRegToken = nearbyUsers.map((e) => e.fcmRegToken);
        // remove undefined fields
        userRegToken = userRegToken.filter((e) => e);

        obj = payload.body;
        obj.title = payload.title;

        // obj = req.body;
        // obj.title = outrage.disease + " disease Alert";
        payload = {
            data: {
                obj: JSON.stringify(obj),
                flag: locationHistoryFlag,
            },
        };
        if (userRegToken.length > 0)
            result = appUserModel.sendAlert(userRegToken, payload);
    } catch (error) {
        console.log(error);
    }
};

router.post(
    "/addOutrage/locationHistoryAlert",
    officialWebAuth,
    async (req, res) => {
        payload = req.body;
        payload.startDate = new Date(payload.startDate);
        payload.endDate = new Date(payload.endDate);
        try {
            let outrage = await OutrageModel.findById(
                OutrageModel.base.Types.ObjectId(payload.outrage)
            );
            if (!outrage)
                return res
                    .status(400)
                    .json({ error: "forbidden, no outrage found" });
            let outrageAlert = new LocationHistoryAlertModel(req.body);
            let result = await outrageAlert.save();
            if (!result) {
                return res.status(400).json({ error: "failed, try again" });
            }

            req.body.disease = outrage.disease;
            req.body.description = req.body.message;
            delete req.body.message;
            sendAlertToNearByUsers(
                result.location,
                {
                    body: req.body,
                    title: outrage.disease + " disease Alert",
                    disease: outrage.disease,
                },
                50000,
                "true"
            );
            return res.json(result);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "failed, try again" });
        }
    }
);

const sendAlertToNearByNonSmartPhoneUsers = async function (
    location,
    message,
    maxDistance
) {
    try {
        let nearbyUsers = await NonSmartPhoneUserModel.aggregate([
            {
                $geoNear: {
                    near: { type: "Point", coordinates: location },
                    maxDistance: maxDistance,
                    distanceField: "distance",
                    // distanceMultiplier: 0.001,
                    spherical: true,
                },
                // use distanceMultiplier to convert to kilometer
            },
            {
                $project: {
                    phNo: 1,
                    distance: 1,
                },
            },
        ]);
        // fetch reg token of users
        console.log(nearbyUsers);
        let phNoArr = nearbyUsers.map((e) => e.phNo);

        // remove undefined fields
        phNoArr = phNoArr.filter((e) => e);
        NonSmartPhoneUserModel.sendSms(phNoArr, message);
    } catch (error) {
        console.log(error);
    }
};
router.post("/addOutrage", officialWebAuth, async (req, res) => {
    let payload = req.body;
    payload.addedBy = req.user["_id"];
    try {
        payload.dailyMorbidityObj = {};
        payload.dailyMortalityObj = {};
        payload.dailyCuredObj = {};

        if ("morbidityCount" in payload)
            payload.dailyMorbidityObj[payload.startDate] = parseInt(
                payload.morbidityCount
            );

        if ("mortalityCount" in payload)
            payload.dailyMortalityObj[payload.startDate] = parseInt(
                payload.mortalityCount
            );
        if ("curedCount" in payload)
            payload.dailyCuredObj[payload.startDate] = parseInt(
                payload.curedCount
            );

        let disease = await DiseaseModel.findOne({ disease: payload.disease });
        if (!disease) return res.status(400).json({ error: "Invalid disease" });

        payload.description = disease.description;
        payload.guidelines = disease.guidelines;
        let outrage = new OutrageModel(payload);
        let result = await outrage.save();

        if (!result) return res.status(500).json({ error: "failed try again" });

        // alert radius 50km by default
        // can be changed with maxDistance argument
        sendAlertToNearByUsers(
            payload.location,
            {
                body: payload,
                title: payload.disease + " disease Alert",
            },
            payload.alertRadius,
            "false"
        );
        let message =
            "Alert for " +
            payload.disease +
            " is issued in your area. Please Follow these steps." +
            "\n" +
            "Guidelines: " +
            payload.guidelines +
            "\n";
        sendAlertToNearByNonSmartPhoneUsers(
            payload.location,
            message,
            parseInt(payload.alertRadius)
        );
        return res.json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error });
    }
});

//
router.get("/viewOutrages", officialWebAuth, async (req, res) => {
    try {
        userId = req.user._id;

        let outrages = await OutrageModel.find({
            addedBy: OutrageModel.base.Types.ObjectId(userId),
        });
        if (!outrages)
            res.status(403).json({
                error: "Outrage not found/Unauthorized access",
            });

        return res.json(outrages);
    } catch (error) {
        return res.status(500).json({ error: error });
    }
});

//
router.get(
    "/addOutrage/viewCount/:date/:id",
    officialWebAuth,
    async (req, res) => {
        let date = req.params.date;
        let id = req.params.id;
        try {
            let outrage = await OutrageModel.findById(id);
            if (!outrage)
                res.status(403).json({
                    error: "Outrage not found/Unauthorized access",
                });

            if (date in outrage.dailyMorbidityObj) {
                let countDetails = {
                    date: date,
                    morbidiyCount: outrage.dailyMorbidityObj[date],
                    mortalityCount: outrage.dailyMortalityObj[date],
                    curedCount: outrage.dailyCuredObj[date],
                };
                return res.json(countDetails);
            } else {
                return res.status(403).json({ error: "date not present" });
            }
        } catch (error) {
            return res.status(500).json({ error: error });
        }
    }
);

// not completed
// id, enddate, Mortality, morbidity, discription
router.put("/addOutrage/updateCount", officialWebAuth, async (req, res) => {
    let payload = req.body;
    const id = payload.id;
    const date = payload.date;
    const userId = req.user.id;
    try {
        let outrage = await OutrageModel.findOne({
            _id: OutrageModel.base.Types.ObjectId(id),
            addedBy: OutrageModel.base.Types.ObjectId(userId),
        });
        if (!outrage.isCaseOpen)
            res.status(403).json({
                error: "closed cases are not allowed to modify",
            });

        if (!outrage)
            res.status(403).json({
                error: "Outrage not found/Unauthorized access",
            });

        if ("description" in payload) outrage.description = payload.description;
        if ("guidelines" in payload) outrage.guidelines = payload.guidelines;
        if (!"morbidityCount" in payload) payload.morbidityCount = 0;
        outrage.morbidityCount += parseInt(payload.morbidityCount);
        if (!"mortalityCount" in payload) payload.mortalityCount = 0;

        outrage.mortalityCount += parseInt(payload.mortalityCount);
        if (!"curedCount" in payload) payload.curedCount = 0;

        outrage.curedCount += parseInt(payload.curedCount);

        if (
            date in outrage.dailyMorbidityObj &&
            outrage.dailyMorbidityObj[date]
        ) {
            outrage.dailyMorbidityObj[date] += parseInt(payload.morbidityCount);
        } else {
            outrage.dailyMorbidityObj[date] = parseInt(payload.morbidityCount);
        }
        if (
            date in outrage.dailyMortalityObj &&
            outrage.dailyMortalityObj[date]
        ) {
            outrage.dailyMortalityObj[date] += parseInt(payload.mortalityCount);
        } else {
            outrage.dailyMortalityObj[date] = parseInt(payload.mortalityCount);
        }
        if (date in outrage.dailyCuredObj && outrage.dailyCuredObj[date]) {
            outrage.dailyCuredObj[date] += parseInt(payload.curedCount);
        } else {
            outrage.dailyCuredObj[date] = parseInt(payload.curedCount);
        }

        outrage.markModified("dailyMortalityObj");
        outrage.markModified("dailyMorbidityObj");
        outrage.markModified("dailyCuredObj");

        let result = await outrage.save();
        return res.json(result);
    } catch (error) {
        console.log(error);
        return res.json({ error: error });
    }
});

router.put("/addOutrage/closeOutrage", officialWebAuth, async (req, res) => {
    let payload = req.body;
    let userId = req.user.id;
    try {
        let outrage = await OutrageModel.findOne({
            _id: OutrageModel.base.Types.ObjectId(payload.id),
            addedBy: OutrageModel.base.Types.ObjectId(userId),
        });
        if (!outrage)
            res.status(403).json({
                error: "Outrage not found/Unauthorized access",
            });

        outrage.isCaseOpen = false;
        outrage.endDate = new Date();
        outrage.report = payload.report;
        let result = await outrage.save();
        return res.json(result);
    } catch (error) {
        return res.json({ error: error });
    }
});

router.post("/addOutrage/remove", officialWebAuth, async (req, res) => {
    let userId = req.user.id;
    let outrageId = req.body.outrageId;
    try {
        let result = await OutrageModel.findOneAndDelete({
            _id: OutrageModel.base.Types.ObjectId(outrageId),
            addedBy: OutrageModel.base.Types.ObjectId(userId),
        });
        if (!result) return res.status(500).json({ error: "failed" });
        return res.json(result);
    } catch (error) {
        return res.status(500);
    }
});

// GET
// get list of all diseases
router.get("/diseases/all", async (req, res) => {
    const startDate = new Date(req.params.date1);
    const endDate = new Date(req.params.date2);

    try {
        // let outrages = await OutrageModel.distinct("disease");
        let outrages = await DiseaseModel.distinct("disease");
        return res.json(outrages);
    } catch (error) {
        return res.json({ error: error });
    }
});

router.get("/getDetails/country/:disease/:date1/:date2", async (req, res) => {
    const disease = req.params.disease;
    const startDate = new Date(req.params.date1);
    const endDate = new Date(req.params.date2);
    try {
        let country = await OutrageModel.aggregate([
            {
                $match: {
                    disease: disease,

                    $or: [
                        {
                            $and: [
                                { startDate: { $gte: startDate } },
                                { startDate: { $lte: endDate } },
                            ],
                        },
                        {
                            $and: [
                                { startDate: { $lte: startDate } },
                                { endDate: { $gte: endDate } },
                            ],
                        },
                        {
                            $expr: {
                                $cond: [
                                    { $ifNull: ["$endDate", true] },
                                    {
                                        $lte: ["$startDate", endDate],
                                    },
                                    {
                                        $and: [
                                            { $gte: ["$endDate", startDate] },
                                            { $lte: ["$endDate", endDate] },
                                        ],
                                    },
                                ],
                            },
                        },
                        {
                            $and: [
                                { endDate: { $gte: startDate } },
                                { endDate: { $lte: endDate } },
                            ],
                        },
                    ],
                },
            },
            {
                $group: {
                    _id: { _id: null },
                    morbidityCount: {
                        $sum: "$morbidityCount",
                    },
                    mortalityCount: {
                        $sum: "$mortalityCount",
                    },
                    curedCount: {
                        $sum: "$curedCount",
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                },
            },
        ]).allowDiskUse(true);
        if (country.length == 0) return res.status(400).json([]);
        else country = country[0];

        let countryDetails = await countryModel
            .findOne({ country: "India" })
            .lean();
        country["activeCount"] = country.morbidityCount - country.curedCount;
        country["morbidityRate"] =
            country.morbidityCount / countryDetails.population;

        country["mortalityRate"] =
            country.mortalityCount / countryDetails.population;
        country["curedRate"] = country.curedCount / countryDetails.population;
        country["activeRate"] = country.activeCount / countryDetails.population;

        country["population"] = countryDetails.population;

        country["populationDensity"] = Math.round(
            countryDetails.population / countryDetails.area
        );

        return res.json(country);
    } catch (error) {
        return res.json({ error: error });
    }
});

const normalizeDailyCountObj = function (obj) {
    let keys = Object.keys(obj).sort();
    for (let i = 1; i < keys.length; i++) {
        obj[keys[i]] += obj[keys[i - 1]];
    }
};
// GET
// get details of a disease in STATE level
router.get("/getDetails/states/:disease/:date1/:date2", async (req, res) => {
    const startDate = new Date(req.params.date1);
    const endDate = new Date(req.params.date2);
    const disease = req.params.disease;
    try {
        let outrages = await OutrageModel.aggregate([
            {
                $match: {
                    disease: disease,

                    $or: [
                        {
                            $and: [
                                { startDate: { $gte: startDate } },
                                { startDate: { $lte: endDate } },
                            ],
                        },
                        {
                            $and: [
                                { startDate: { $lte: startDate } },
                                { endDate: { $gte: endDate } },
                            ],
                        },
                        {
                            $expr: {
                                $cond: [
                                    { $ifNull: ["$endDate", true] },
                                    {
                                        $lte: ["$startDate", endDate],
                                    },
                                    {
                                        $and: [
                                            { $gte: ["$endDate", startDate] },
                                            { $lte: ["$endDate", endDate] },
                                        ],
                                    },
                                ],
                            },
                        },
                        {
                            $and: [
                                { endDate: { $gte: startDate } },
                                { endDate: { $lte: endDate } },
                            ],
                        },
                    ],
                },
            },
            {
                $group: {
                    _id: { state: "$state" },
                    morbidityCount: { $sum: "$morbidityCount" },
                    mortalityCount: { $sum: "$mortalityCount" },
                    curedCount: { $sum: "$curedCount" },

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
                    description: { $first: "$description" },
                    guidelines: { $first: "$guidelines" },
                },
            },
            {
                $project: {
                    _id: 0,
                    state: "$_id.state",
                    activeOutrages: 1,
                    previousOutrages: 1,
                    morbidityCount: 1,
                    mortalityCount: 1,
                    curedCount: 1,
                    activeCount: {
                        $subtract: [
                            "$morbidityCount",
                            {
                                $sum: ["$curedCount", "$mortalityCount"],
                            },
                        ],
                    },
                    description: 1,
                    guidelines: 1,
                },
            },
        ]).allowDiskUse(true);
        let result = await StateModel.find().lean();
        let stateDetails = {};
        result.forEach((e) => {
            stateDetails[e.state] = e;
        });

        outrages.forEach((stateObj) => {
            details = stateDetails[stateObj.state];
            if ("population" in details) {
                stateObj["population"] = details.population;
                stateObj["area"] = details.area;
                stateObj["location"] = details.location;

                stateObj["morbidityRate"] =
                    stateObj.morbidityCount / details.population;

                stateObj["mortalityRate"] =
                    stateObj.mortalityCount / details.population;
                stateObj["curedRate"] =
                    stateObj.curedCount / details.population;
                stateObj["activeRate"] =
                    stateObj.activeCount / details.population;
            }

            stateObj["population"] = details.population;
            if (details.area)
                stateObj["populationDensity"] = Math.round(
                    details.population / details.area
                );

            stateObj.activeOutrages.forEach((element) => {
                // normalize counts
                normalizeDailyCountObj(element.dailyMorbidityObj);
                normalizeDailyCountObj(element.dailyMortalityObj);
                normalizeDailyCountObj(element.dailyCuredObj);
            });
            stateObj.previousOutrages.forEach((element) => {
                // normalize counts
                normalizeDailyCountObj(element.dailyMorbidityObj);
                normalizeDailyCountObj(element.dailyMortalityObj);
                normalizeDailyCountObj(element.dailyCuredObj);
            });
        });
        // console.log(outrages);

        return res.json(outrages);
    } catch (error) {
        console.log(error);
        return res.json({ error: error });
    }
});

// get list of a specific disease within given dates
router.get("/getDetails/:disease/:date1/:date2", async (req, res) => {
    const startDate = new Date(req.params.date1);
    const endDate = new Date(req.params.date2);
    const disease = req.params.disease;
    try {
        let outrages = await OutrageModel.aggregate([
            {
                $match: {
                    disease: disease,
                    $or: [
                        {
                            $and: [
                                { startDate: { $gte: startDate } },
                                { startDate: { $lte: endDate } },
                            ],
                        },
                        {
                            $and: [
                                { startDate: { $lte: startDate } },
                                { endDate: { $gte: endDate } },
                            ],
                        },
                        {
                            $expr: {
                                $cond: [
                                    { $ifNull: ["$endDate", true] },
                                    {
                                        $lte: ["$startDate", endDate],
                                    },
                                    {
                                        $and: [
                                            { $gte: ["$endDate", startDate] },
                                            { $lte: ["$endDate", endDate] },
                                        ],
                                    },
                                ],
                            },
                        },
                        {
                            $and: [
                                { endDate: { $gte: startDate } },
                                { endDate: { $lte: endDate } },
                            ],
                        },
                    ],
                },
            },
        ]).allowDiskUse(true);
        outrages.forEach((element) => {
            // normalize counts
            normalizeDailyCountObj(element.dailyMorbidityObj);
            normalizeDailyCountObj(element.dailyMortalityObj);
            normalizeDailyCountObj(element.dailyCuredObj);
        });

        // outrages = GeoJSON.parse(outrages, { Point: "location" });
        return res.json(outrages);
    } catch (error) {
        console.log(error);
        return res.json({ error: error });
    }
});

// get morbidity count of state,district,place individually
router.get(
    "/getDetails/individualCount/:state/:district/:place/:disease/:date1/:date2",
    async (req, res) => {
        const startDate = new Date(req.params.date1);
        const endDate = new Date(req.params.date2);
        const disease = req.params.disease;
        const state = req.params.state;
        const district = req.params.district;
        const place = req.params.place;
        try {
            let result = await OutrageModel.aggregate([
                {
                    $match: {
                        state: state,
                        disease: disease,

                        $or: [
                            {
                                $and: [
                                    { startDate: { $gte: startDate } },
                                    { startDate: { $lte: endDate } },
                                ],
                            },
                            {
                                $and: [
                                    { startDate: { $lte: startDate } },
                                    { endDate: { $gte: endDate } },
                                ],
                            },
                            {
                                $expr: {
                                    $cond: [
                                        { $ifNull: ["$endDate", true] },
                                        {
                                            $lte: ["$startDate", endDate],
                                        },
                                        {
                                            $and: [
                                                {
                                                    $gte: [
                                                        "$endDate",
                                                        startDate,
                                                    ],
                                                },
                                                { $lte: ["$endDate", endDate] },
                                            ],
                                        },
                                    ],
                                },
                            },
                            {
                                $and: [
                                    { endDate: { $gte: startDate } },
                                    { endDate: { $lte: endDate } },
                                ],
                            },
                        ],
                    },
                },

                {
                    $group: {
                        _id: { state: "$state" },
                        state: { $sum: "$morbidityCount" },
                        district: {
                            $sum: {
                                $cond: [
                                    { $eq: ["$district", district] },
                                    "$morbidityCount",
                                    0,
                                ],
                            },
                        },
                        place: {
                            $sum: {
                                $cond: [
                                    { $eq: ["$district", district] },
                                    {
                                        $cond: [
                                            { $eq: ["$place", place] },
                                            "$morbidityCount",
                                            0,
                                        ],
                                    },
                                    0,
                                ],
                            },
                        },
                    },
                },
                {
                    $project: {
                        _id: 0,
                    },
                },
            ]).allowDiskUse(true);
            if (result.length == 0) return res.status(400).json([]);

            return res.json(result[0]);
        } catch (error) {
            console.log(error);
            return res.json({ error: error });
        }
    }
);

// GET
// get details of a disease in DISTRICT level
router.get(
    "/getDetails/:state/districts/:disease/:date1/:date2",
    async (req, res) => {
        const startDate = new Date(req.params.date1);
        const endDate = new Date(req.params.date2);
        const disease = req.params.disease;
        const state = req.params.state;
        try {
            let outrages = await OutrageModel.aggregate([
                {
                    $match: {
                        state: state,
                        disease: disease,

                        $or: [
                            {
                                $and: [
                                    { startDate: { $gte: startDate } },
                                    { startDate: { $lte: endDate } },
                                ],
                            },
                            {
                                $and: [
                                    { startDate: { $lte: startDate } },
                                    { endDate: { $gte: endDate } },
                                ],
                            },
                            {
                                $expr: {
                                    $cond: [
                                        { $ifNull: ["$endDate", true] },
                                        {
                                            $lte: ["$startDate", endDate],
                                        },
                                        {
                                            $and: [
                                                {
                                                    $gte: [
                                                        "$endDate",
                                                        startDate,
                                                    ],
                                                },
                                                { $lte: ["$endDate", endDate] },
                                            ],
                                        },
                                    ],
                                },
                            },
                            {
                                $and: [
                                    { endDate: { $gte: startDate } },
                                    { endDate: { $lte: endDate } },
                                ],
                            },
                        ],
                    },
                },

                {
                    $group: {
                        _id: { district: "$district" },
                        morbidityCount: { $sum: "$morbidityCount" },
                        mortalityCount: { $sum: "$mortalityCount" },
                        curedCount: { $sum: "$curedCount" },

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
                        description: { $first: "$description" },
                        guidelines: { $first: "$guidelines" },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        district: "$_id.district",
                        activeOutrages: 1,
                        previousOutrages: 1,
                        morbidityCount: 1,
                        mortalityCount: 1,
                        curedCount: 1,
                        activeCount: {
                            $subtract: [
                                "$morbidityCount",
                                {
                                    $sum: ["$curedCount", "$mortalityCount"],
                                },
                            ],
                        },
                        description: 1,
                        guidelines: 1,
                    },
                },
            ]).allowDiskUse(true);
            let result = await DistrictModel.find().lean();
            let districtDetails = {};
            result.forEach((e) => {
                districtDetails[e.district] = e;
            });

            outrages.forEach((districtObj) => {
                details = districtDetails[districtObj.district];

                if ("population" in details) {
                    districtObj["population"] = details.population;
                    districtObj["area"] = details.area;
                    districtObj["location"] = details.location;

                    districtObj["morbidityRate"] =
                        districtObj.morbidityCount / details.population;

                    districtObj["mortalityRate"] =
                        districtObj.mortalityCount / details.population;
                    districtObj["curedRate"] =
                        districtObj.curedCount / details.population;
                    districtObj["activeRate"] =
                        districtObj.activeCount / details.population;

                    districtObj["population"] = details.population;
                }
                if (details.area)
                    districtObj["populationDensity"] = Math.round(
                        details.population / details.area
                    );

                districtObj.activeOutrages.forEach((element) => {
                    // normalize counts
                    normalizeDailyCountObj(element.dailyMorbidityObj);
                    normalizeDailyCountObj(element.dailyMortalityObj);
                    normalizeDailyCountObj(element.dailyCuredObj);
                });
                districtObj.previousOutrages.forEach((element) => {
                    // normalize counts
                    normalizeDailyCountObj(element.dailyMorbidityObj);
                    normalizeDailyCountObj(element.dailyMortalityObj);
                    normalizeDailyCountObj(element.dailyCuredObj);
                });
            });
            return res.json(outrages);
        } catch (error) {
            console.log(error);
            return res.json({ error: error });
        }
    }
);

// GET
// get details of a disease in PLACE level
router.get(
    "/getDetails/places/:state/:district/:disease/:date1/:date2",
    async (req, res) => {
        const startDate = new Date(req.params.date1);
        const endDate = new Date(req.params.date2);
        const disease = req.params.disease;
        const state = req.params.state;
        const district = req.params.district;
        try {
            let outrages = await OutrageModel.aggregate([
                {
                    $match: {
                        state: state,
                        district: district,
                        disease: disease,

                        $or: [
                            {
                                $and: [
                                    { startDate: { $gte: startDate } },
                                    { startDate: { $lte: endDate } },
                                ],
                            },
                            {
                                $and: [
                                    { startDate: { $lte: startDate } },
                                    { endDate: { $gte: endDate } },
                                ],
                            },
                            {
                                $expr: {
                                    $cond: [
                                        { $ifNull: ["$endDate", true] },
                                        {
                                            $lte: ["$startDate", endDate],
                                        },
                                        {
                                            $and: [
                                                {
                                                    $gte: [
                                                        "$endDate",
                                                        startDate,
                                                    ],
                                                },
                                                { $lte: ["$endDate", endDate] },
                                            ],
                                        },
                                    ],
                                },
                            },
                            {
                                $and: [
                                    { endDate: { $gte: startDate } },
                                    { endDate: { $lte: endDate } },
                                ],
                            },
                        ],
                    },
                },
                {
                    $group: {
                        _id: { place: "$place" },
                        morbidityCount: { $sum: "$morbidityCount" },
                        mortalityCount: { $sum: "$mortalityCount" },
                        curedCount: { $sum: "$curedCount" },

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
                {
                    $project: {
                        _id: 0,
                        place: "$_id.place",
                        activeOutrages: 1,
                        previousOutrages: 1,
                        morbidityCount: 1,
                        mortalityCount: 1,
                        curedCount: 1,
                        activeCount: {
                            $subtract: [
                                "$morbidityCount",
                                {
                                    $sum: ["$curedCount", "$mortalityCount"],
                                },
                            ],
                        },
                        description: 1,
                        guidelines: 1,
                    },
                },
            ]).allowDiskUse(true);

            outrages.forEach((placeObj) => {
                placeObj.activeOutrages.forEach((element) => {
                    // normalize counts
                    normalizeDailyCountObj(element.dailyMorbidityObj);
                    normalizeDailyCountObj(element.dailyMortalityObj);
                    normalizeDailyCountObj(element.dailyCuredObj);
                });
                placeObj.previousOutrages.forEach((element) => {
                    // normalize counts
                    normalizeDailyCountObj(element.dailyMorbidityObj);
                    normalizeDailyCountObj(element.dailyMortalityObj);
                    normalizeDailyCountObj(element.dailyCuredObj);
                });
            });
            return res.json(outrages);
        } catch (error) {
            return res.status(500).json({ error: error });
        }
    }
);

const { Client, serverPhNo } = require("../config/twilio");
setInterval(async () => {
    let redzones = await VirtualRedzoneModel.find({ isCaseOpen: true });
    let appUsers, totalCount, result, percent, actualCount, count;
    redzones.forEach(async (redzone) => {
        totalCount = await appUserModel.countDocuments({
            "address.district": redzone.district,
        });

        appUsers = await appUserModel.aggregate([
            {
                $geoNear: {
                    near: { type: "Point", coordinates: redzone.location },
                    maxDistance: redzone.alertRadius,
                    distanceField: "distance",
                    spherical: true,
                },
                // use distanceMultiplier to convert to kilometer
            },
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    count: 1,
                },
            },
        ]);
        if (appUsers.length == 0) return;
        count = appUsers[0].count;
        percent = count / totalCount;
        actualCount = count / percent;
        // console.log(actualCount, count, totalCount);
        if (actualCount >= redzone.maxAllowedPopulation) {
            // send alert to the phNo
            result = await Client.messages.create({
                body: `RedZone alert : More than ${actualCount} people might be entered the containment zone at ${redzone.place}  `,
                from: serverPhNo,
                to: redzone.alertPhNo,
            });
            console.log(result);
        }
    });
}, 60000);

// post
// add virtual redzone
router.post("/addVirtualRedzone", officialWebAuth, async (req, res) => {
    let payload = req.body;
    try {
        payload.alertPhNo = payload.alertPhNo.toString();

        if (payload.alertPhNo.indexOf("+91") != 0) {
            payload.alertPhNo = "+91" + payload.alertPhNo;
        }
        payload.addedBy = req.user["_id"];
        let redzone = new VirtualRedzoneModel(payload);
        let result = await redzone.save();
        if (!result) return res.status(403).json({ error: "failed" });
        return res.json(redzone);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error });
    }
});
// get
// get list of redzones added by the user
router.get("/virtualRedzones", officialWebAuth, async (req, res) => {
    let user = req.user;
    try {
        let redzone = await VirtualRedzoneModel.find({ addedBy: user["_id"] });
        if (!redzone) return res.json([]);
        return res.json(redzone);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error });
    }
});

router.post("/virtualRedzones/remove", officialWebAuth, async (req, res) => {
    let user = req.user;
    let redzoneId = req.body.redzoneId;
    try {
        let result = await VirtualRedzoneModel.findOneAndDelete({
            _id: redzoneId,
            addedBy: user["_id"],
        });
        if (!result) return res.status(500).json({ error: "failed" });
        return res.json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error });
    }
});

router.put("/virtualRedzones/edit", officialWebAuth, async (req, res) => {
    let user = req.user;
    let redzoneId = req.body.redzoneId;
    let payload = req.body;
    try {
        let result = await VirtualRedzoneModel.findOneAndUpdate(
            { _id: redzoneId, addedBy: user["_id"] },
            payload,
            {
                new: true,
            }
        );
        if (!result) return res.status(500).json({ error: "failed" });
        return res.json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error });
    }
});

router.put("/virtualRedzones/close", officialWebAuth, async (req, res) => {
    let user = req.user;
    let redzoneId = req.body.redzoneId;
    try {
        let result = await VirtualRedzoneModel.findOneAndUpdate(
            { _id: redzoneId, addedBy: user["_id"] },
            { isCaseOpen: fasle },
            {
                new: true,
            }
        );
        if (!result) return res.status(500).json({ error: "failed" });
        return res.json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error });
    }
});

const { otpModel } = require("../models/otp");

// {
//     phNo:
// }
router.post(
    "/nonSmartPhoneUsers/register/sendOTP",
    // officialWebAuth,
    async (req, res) => {
        let payload = req.body;
        try {
            payload.otp = otpModel.genOTP();

            payload.phNo = payload.phNo.toString();

            if (payload.phNo.indexOf("+91") != 0) {
                payload.phNo = "+91" + payload.phNo;
            }
            // delete if otp is already present
            await otpModel.deleteMany({ phNo: payload.phNo });
            await NonSmartPhoneUserModel.deleteMany({ phNo: payload.phNo });

            let userOTP = new otpModel(payload);
            let result = await userOTP.save();
            if (!result)
                return res.status(500).json({ error: "failed try again" });

            // send otp to phNo
            result = await Client.messages.create({
                body: `Your BWARE registration OTP is : ${payload.otp}`,
                from: serverPhNo,
                to: payload.phNo,
            });

            if (!result)
                return res.status(500).json({ error: "failed try again" });

            return res.status(200).json({ response: "OTP sent" });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: error });
        }
    }
);

router.post(
    "/nonSmartPhoneUsers/register/confirmOTP",
    officialWebAuth,
    async (req, res) => {
        let user = req.user;
        let payload = req.body;
        try {
            payload.phNo = payload.phNo.toString();

            if (payload.phNo.indexOf("+91") != 0) {
                payload.phNo = "+91" + payload.phNo;
            }
            let userOTP = await otpModel.findOne({
                phNo: payload.phNo,
                otp: payload.otp,
            });
            if (!userOTP) {
                return res.status(403).json({ error: "otp not found" });
            }
            payload.addedBy = user["_id"];
            let nonSmartPhoneUser = new NonSmartPhoneUserModel(payload);
            let result = await nonSmartPhoneUser.save();
            if (!result) return res.status(500).json({ error: "failed" });

            return res.json(result);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: error });
        }
    }
);

router.get("/getDetails/:disease", async (req, res) => {
    let disease = req.params.disease;
    try {
        let details = await DiseaseModel.findOne({
            disease: disease,
        });
        if (!details) {
            return res.status(403).json({ error: "disase not found" });
        }

        return res.json(details);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error });
    }
});

router.get("/getDetails/symptoms/symptomsArr", async (req, res) => {
    let disease = req.params.disease;
    try {
        let diseases = await DiseaseModel.find();
        if (!diseases)
            return res.status(403).json({ error: "disease db is empty" });

        let symptoms = [];
        let commonWords = ["is", "and", "to", "of", "the", "or", "in"];
        diseases.forEach((disease) => {
            disease.symptoms.humans.forEach((humanSymptoms) => {
                humanSymptoms.split(" ").forEach((symptom) => {
                    word = symptom.replace(",", "");
                    flag = 0;
                    commonWords.forEach((w) => {
                        if (w == word) flag = 1;
                    });
                    if (flag != 1) symptoms.push(word);
                });
            });
            disease.symptoms.animals.forEach((animalSymptoms) => {
                animalSymptoms.split(" ").forEach((symptom) => {
                    word = symptom.replace(",", "");
                    flag = 0;
                    commonWords.forEach((w) => {
                        if (w == word) flag = 1;
                    });
                    if (flag != 1) symptoms.push(word);
                });
            });
        });
        return res.json(symptoms);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error });
    }
});

router.post("/getDetails/symptoms/findPossibleDisease", async (req, res) => {
    let payload = req.body;

    try {
        let diseases = await DiseaseModel.find();
        if (!diseases)
            return res.status(403).json({ error: "disease db is empty" });

        let hashTable = {};
        let symptoms;
        let commonWords = ["is", "and", "to", "of", "the", "or", "in"];
        diseases.forEach((disease) => {
            symptoms = [];
            disease.symptoms.humans.forEach((humanSymptoms) => {
                humanSymptoms.split(" ").forEach((symptom) => {
                    word = symptom.replace(",", "").toLowerCase();
                    flag = 0;
                    commonWords.forEach((w) => {
                        if (w.toLowerCase() == word) flag = 1;
                    });
                    if (flag != 1) symptoms.push(word);
                });
            });
            disease.symptoms.animals.forEach((animalSymptoms) => {
                animalSymptoms.split(" ").forEach((symptom) => {
                    word = symptom.replace(",", "").toLowerCase();
                    flag = 0;
                    commonWords.forEach((w) => {
                        if (w.toLowerCase() == word) flag = 1;
                    });
                    if (flag != 1) symptoms.push(word);
                });
            });
            hashTable[disease.disease] = symptoms;
        });

        let result = [];
        let count;
        Object.keys(hashTable).forEach((disease) => {
            count = 0;
            payload.symptoms.forEach((symptom) => {
                if (hashTable[disease].indexOf(symptom) > -1) {
                    count += 1;
                }
            });
            if (count > 0) result.push([count, disease]);
        });
        result = result.sort(function (a, b) {
            return b[0] - a[0];
        });
        return res.json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error });
    }
});

module.exports = router;
