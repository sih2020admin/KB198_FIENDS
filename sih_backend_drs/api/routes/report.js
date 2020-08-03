const express = require("express");
const router = express.Router();
let cors = require("cors");
let json2xls = require("json2xls");

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
router.use(json2xls.middleware);

const { OutrageModel } = require("../models/outrage");
const { StateModel, DistrictModel } = require("../models/place");

let keys;
const populateCountObj = function (arr, outrageObj, startDate, endDate) {
    arr.forEach((e) => {
        if (e.dailyMorbidityObj) {
            keys = Object.keys(e.dailyMorbidityObj).sort();
            keys.forEach((key) => {
                if (new Date(key) < startDate || new Date(key) > endDate)
                    return;
                if (key in e.dailyMorbidityObj) {
                    if (!(key in outrageObj.dailyMorbidityObj))
                        outrageObj.dailyMorbidityObj[key] =
                            e.dailyMorbidityObj[key];
                    else
                        outrageObj.dailyMorbidityObj[key] +=
                            e.dailyMorbidityObj[key];
                }
            });
        }

        if (e.dailyMortalityObj) {
            keys = Object.keys(e.dailyMortalityObj).sort();
            keys.forEach((key) => {
                if (new Date(key) < startDate || new Date(key) > endDate)
                    return;

                if (key in e.dailyMortalityObj) {
                    if (!(key in outrageObj.dailyMortalityObj))
                        outrageObj.dailyMortalityObj[key] =
                            e.dailyMortalityObj[key];
                    else
                        outrageObj.dailyMortalityObj[key] +=
                            e.dailyMortalityObj[key];
                }
            });
        }

        if (e.dailyCuredObj) {
            keys = Object.keys(e.dailyCuredObj).sort();
            keys.forEach((key) => {
                if (new Date(key) < startDate || new Date(key) > endDate)
                    return;
                if (key in e.dailyCuredObj) {
                    if (!(key in outrageObj.dailyCuredObj))
                        outrageObj.dailyCuredObj[key] = e.dailyCuredObj[key];
                    else outrageObj.dailyCuredObj[key] += e.dailyCuredObj[key];
                }
            });
        }
    });
};

function populate(outrage, outragesArr, locationDetails, startDate, endDate) {
    outrage.dailyMorbidityObj = {};
    outrage.dailyMortalityObj = {};
    outrage.dailyCuredObj = {};

    populateCountObj(outragesArr, outrage, startDate, endDate);
    outrage.morbidityCount = Object.values(outrage.dailyMorbidityObj).reduce(
        (a, b) => a + b,
        0
    );
    outrage.mortalityCount = Object.values(outrage.dailyMortalityObj).reduce(
        (a, b) => a + b,
        0
    );
    outrage.curedCount = Object.values(outrage.dailyCuredObj).reduce(
        (a, b) => a + b,
        0
    );

    outrage.dailyActiveObj = {};
    Object.keys(outrage.dailyMorbidityObj)
        .sort()
        .forEach((e) => {
            outrage.dailyActiveObj[e] =
                outrage.dailyMorbidityObj[e] -
                outrage.dailyCuredObj[e] -
                outrage.dailyMortalityObj[e];
        });

    outrage.activeCount = Object.values(outrage.dailyActiveObj).reduce(
        (a, b) => a + b,
        0
    );

    // let stateDetails = await StateModel.findOne({ state: state }).lean();
    if ("population" in locationDetails) {
        outrage["population"] = locationDetails.population;
        outrage["area"] = locationDetails.area;
        outrage["location"] = locationDetails.location;

        outrage["morbidityRate"] =
            outrage.morbidityCount / locationDetails.population;

        outrage["mortalityRate"] =
            outrage.mortalityCount / locationDetails.population;
        outrage["curedRate"] = outrage.curedCount / locationDetails.population;
        outrage["activeRate"] =
            outrage.activeCount / locationDetails.population;
    }

    outrage["population"] = locationDetails.population;
    if (locationDetails.area)
        outrage["populationDensity"] = Math.round(
            locationDetails.population / locationDetails.area
        );
}

const normalizeDailyCountObj = function (obj) {
    let keys = Object.keys(obj).sort();
    for (let i = 1; i < keys.length; i++) {
        obj[keys[i]] += obj[keys[i - 1]];
    }
};
// GET
// get report of a disease in a STATE without active and previous outrages
router.get("/getDetails/:state/:disease/:date1/:date2", async (req, res) => {
    const startDate = new Date(req.params.date1);
    const endDate = new Date(req.params.date2);
    const disease = req.params.disease;
    const state = req.params.state;
    try {
        let outrage = await OutrageModel.aggregate([
            {
                $match: {
                    disease: disease,
                    state: state,
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
                    description: 1,
                    guidelines: 1,
                },
            },
        ]).allowDiskUse(true);
        if (outrage.length == 0) outrage = {};
        else outrage = outrage[0];

        let outragesArr = await OutrageModel.find({
            state: state,
            disease: disease,
        });
        let stateDetails = await StateModel.findOne({ state: state }).lean();
        populate(outrage, outragesArr, stateDetails, startDate, endDate);

        // normalize counts
        normalizeDailyCountObj(outrage.dailyMorbidityObj);
        normalizeDailyCountObj(outrage.dailyMortalityObj);
        normalizeDailyCountObj(outrage.dailyCuredObj);

        return res.json(outrage);
    } catch (error) {
        console.log(error);
        return res.json({ error: error });
    }
});

// GET
// get report of a disease in a DISTRICT without previous and active outrages
router.get(
    "/getDetails/:state/:district/:disease/:date1/:date2",
    async (req, res) => {
        const startDate = new Date(req.params.date1);
        const endDate = new Date(req.params.date2);
        const disease = req.params.disease;
        const state = req.params.state;
        const district = req.params.district;
        try {
            let outrage = await OutrageModel.aggregate([
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
                                                {
                                                    $lte: ["$endDate", endDate],
                                                },
                                            ],
                                        },
                                    ],
                                },
                            },
                            {
                                // endDate: { $gte: startDate },
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
                        _id: null,
                        morbidityCount: { $sum: "$morbidityCount" },
                        mortalityCount: { $sum: "$mortalityCount" },
                        curedCount: { $sum: "$curedCount" },

                        description: { $first: "$description" },
                        guidelines: { $first: "$guidelines" },
                        state: { $first: "$state" },
                        district: { $first: "$district" },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        district: 1,
                        state: 1,
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
            if (outrage.length == 0) return res.status(400).json([]);
            else outrage = outrage[0];

            let outragesArr = await OutrageModel.find({
                state: state,
                district: district,
                disease: disease,
            });

            let districtDetails = await DistrictModel.findOne({
                state: state,
                district: district,
            });
            populate(outrage, outragesArr, districtDetails, startDate, endDate);
            // normalize counts
            normalizeDailyCountObj(outrage.dailyMorbidityObj);
            normalizeDailyCountObj(outrage.dailyMortalityObj);
            normalizeDailyCountObj(outrage.dailyCuredObj);
            return res.json(outrage);
        } catch (error) {
            console.log(error);
            return res.json({ error: error });
        }
    }
);

function populateWithpopulationData(placeObj, locationDetails) {
    if ("population" in locationDetails) {
        placeObj["population"] = locationDetails.population;
        placeObj["area"] = locationDetails.area;
        placeObj["location"] = locationDetails.location;
        placeObj["morbidityRate"] =
            placeObj.morbidityCount / locationDetails.population;
        placeObj["mortalityRate"] =
            placeObj.mortalityCount / locationDetails.population;
        placeObj["curedRate"] =
            placeObj.curedCount / locationDetails.population;
        placeObj["activeRate"] =
            placeObj.activeCount / locationDetails.population;
    }
    placeObj["population"] = locationDetails.population;
    if (locationDetails.area)
        placeObj["populationDensity"] = Math.round(
            locationDetails.population / locationDetails.area
        );
}
// all states
router.get(
    "/softcopy/states/:disease/:date1/:date2/:fileType",
    async (req, res) => {
        const startDate = new Date(req.params.date1);
        const endDate = new Date(req.params.date2);
        const disease = req.params.disease;
        const fileType = req.params.fileType;
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
                                                {
                                                    $gte: [
                                                        "$endDate",
                                                        startDate,
                                                    ],
                                                },
                                                {
                                                    $lte: ["$endDate", endDate],
                                                },
                                            ],
                                        },
                                    ],
                                },
                            },
                            {
                                // endDate: { $gte: startDate },
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
                        startDate: { $first: "$startDate" },
                        endDate: { $first: "$endDate" },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        state: "$_id.state",
                        morbidityCount: 1,
                        mortalityCount: 1,
                        curedCount: 1,
                        activeCount: { $sum: "$morbidityCount" },
                        startDate: 1,
                        endDate: 1,
                    },
                },
            ]).allowDiskUse(true);
            if (outrages.length == 0) return res.status(400).json([]);

            let details = await StateModel.find();
            let stateDetails = {};
            details.forEach((state) => {
                stateDetails[state.state] = state;
            });
            outrages.forEach((stateObj) => {
                populateWithpopulationData(
                    stateObj,
                    stateDetails[stateObj.state]
                );
            });

            // make it downloadable
            let filename = `all_places_${startDate
                .toISOString()
                .slice(0, 10)}_${endDate.toISOString().slice(0, 10)}`;
            if (fileType == "json") {
                filename = filename + ".json";
                var json = JSON.stringify(outrages);
                var mimetype = "application/json";
                res.setHeader("Content-Type", mimetype);
                res.setHeader(
                    "Content-disposition",
                    "attachment; filename=" + filename
                );
                return res.send(json);
            } else if (fileType == "xls")
                return res.xls(filename + ".xls", outrages);
        } catch (error) {
            console.log(error);
            return res.json({ error: error });
        }
    }
);

// get softcopy of all districts
router.get(
    "/softcopy/districts/:disease/:date1/:date2/:fileType",
    async (req, res) => {
        const startDate = new Date(req.params.date1);
        const endDate = new Date(req.params.date2);
        const disease = req.params.disease;
        const fileType = req.params.fileType;
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
                                                {
                                                    $gte: [
                                                        "$endDate",
                                                        startDate,
                                                    ],
                                                },
                                                {
                                                    $lte: ["$endDate", endDate],
                                                },
                                            ],
                                        },
                                    ],
                                },
                            },
                            {
                                // endDate: { $gte: startDate },
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
                        _id: { state: "$state", district: "$district" },
                        morbidityCount: { $sum: "$morbidityCount" },
                        mortalityCount: { $sum: "$mortalityCount" },
                        curedCount: { $sum: "$curedCount" },
                        startDate: { $first: "$startDate" },
                        endDate: { $first: "$endDate" },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        state: "$_id.state",
                        district: "$_id.district",
                        morbidityCount: 1,
                        mortalityCount: 1,
                        curedCount: 1,
                        activeCount: { $sum: "$morbidityCount" },
                        startDate: 1,
                        endDate: 1,
                    },
                },
            ]).allowDiskUse(true);
            if (outrages.length == 0) return res.status(400).json([]);

            let details = await DistrictModel.find();
            let districtDetails = {};
            details.forEach((districtDetail) => {
                districtDetails[
                    districtDetail.state + districtDetail.district
                ] = districtDetail;
            });
            outrages.forEach((districtObj) => {
                // console.log(districtObj, districtDetail);
                districtObj = populateWithpopulationData(
                    districtObj,
                    districtDetails[districtObj.state + districtObj.district]
                );
            });

            // make it downloadable
            let filename = `all_places_${startDate
                .toISOString()
                .slice(0, 10)}_${endDate.toISOString().slice(0, 10)}`;
            if (fileType == "json") {
                filename = filename + ".json";
                var json = JSON.stringify(outrages);
                var mimetype = "application/json";
                res.setHeader("Content-Type", mimetype);
                res.setHeader(
                    "Content-disposition",
                    "attachment; filename=" + filename
                );
                return res.send(json);
            } else if (fileType == "xls")
                return res.xls(filename + ".xls", outrages);
        } catch (error) {
            console.log(error);
            return res.json({ error: error });
        }
    }
);

// get softcopy of all places
router.get(
    "/softcopy/places/:disease/:date1/:date2/:fileType",
    async (req, res) => {
        const startDate = new Date(req.params.date1);
        const endDate = new Date(req.params.date2);
        const disease = req.params.disease;
        const fileType = req.params.fileType;
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
                                                {
                                                    $gte: [
                                                        "$endDate",
                                                        startDate,
                                                    ],
                                                },
                                                {
                                                    $lte: ["$endDate", endDate],
                                                },
                                            ],
                                        },
                                    ],
                                },
                            },
                            {
                                // endDate: { $gte: startDate },
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
                        _id: {
                            state: "$state",
                            district: "$district",
                            place: "$place",
                        },
                        morbidityCount: { $sum: "$morbidityCount" },
                        mortalityCount: { $sum: "$mortalityCount" },
                        curedCount: { $sum: "$curedCount" },
                        startDate: { $first: "$startDate" },
                        endDate: { $first: "$endDate" },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        state: "$_id.state",
                        district: "$_id.district",
                        place: "$_id.place",
                        morbidityCount: 1,
                        mortalityCount: 1,
                        curedCount: 1,
                        activeCount: { $sum: "$morbidityCount" },
                        startDate: 1,
                        endDate: 1,
                    },
                },
            ]).allowDiskUse(true);
            if (outrages.length == 0) return res.status(400).json([]);

            // make it downloadable
            let filename = `all_places_${startDate
                .toISOString()
                .slice(0, 10)}_${endDate.toISOString().slice(0, 10)}`;
            if (fileType == "json") {
                filename = filename + ".json";
                var json = JSON.stringify(outrages);
                var mimetype = "application/json";
                res.setHeader("Content-Type", mimetype);
                res.setHeader(
                    "Content-disposition",
                    "attachment; filename=" + filename
                );
                return res.send(json);
            } else if (fileType == "xls")
                return res.xls(filename + ".xls", outrages);
        } catch (error) {
            console.log(error);
            return res.json({ error: error });
        }
    }
);
module.exports = router;
