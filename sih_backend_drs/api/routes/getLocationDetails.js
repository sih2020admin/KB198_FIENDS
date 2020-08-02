const express = require("express");
const router = express.Router();

const { StateModel, DistrictModel, PlaceModel } = require("../models/place");

// returns list of states
router.get("/states", async (req, res) => {
    try {
        // let states = await StateModel.distinct("state");
        let states = await StateModel.distinct("state");
        return res.json(states);
    } catch (error) {
        console.log(error);
    }
});

// returns list of districts within a state
router.get("/:state/districts", async (req, res) => {
    const state = req.params.state;
    try {
        let districts = await DistrictModel.find({ state: state }).distinct(
            "district"
        );
        return res.json(districts);
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;
