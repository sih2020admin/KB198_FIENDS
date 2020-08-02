// temp router to add state,district,places detiils

const express = require("express");
const router = express.Router();

const { StateModel, DistrictModel, PlaceModel } = require("../models/place");

// {
//     "state" : "Andhra Pradesh",
//     "population": 49506799,
//     "capital": "Amaravati",
//     "area": 160205,
//     "location": [  80.64, 16.5 ]
// }
router.post("/addState", async (req, res) => {
    let payload = req.body;
    try {
        let place = new StateModel(payload);
        let result = await place.save();
        return res.json(result);
    } catch (error) {
        console.log(error);
    }
});

router.post("/addState/many", async (req, res) => {
    let payload = req.body.states; //array of states
    // console.log(payload);

    let new_arr = [];

    try {
        let temp;
        payload.forEach((e) => {
            temp = {};
            temp.state = e.states_name;
            temp.location = JSON.parse(e.coordinates_name).reverse();
            temp.area = Number(e.states_area);
            temp.population = Number(e.states_population);

            new_arr.push(temp);
        });
        console.log(new_arr);

        let result = await StateModel.insertMany(new_arr);
        return res.json(result);
    } catch (error) {
        console.log(error);
    }
});

// {
//     "state" : "Tamil Nadu",
//     "district": "Kanyakumari",
//     "capital": "Nagercoil",
//     "population": 1863178,
//     "area": 1685,
//     "location": [ 80.27, 13.09]
// }
router.post("/addDistrict", async (req, res) => {
    let payload = req.body;
    try {
        let district = new DistrictModel(payload);
        let result = await district.save();
        return res.json(result);
    } catch (error) {
        console.log(error);
    }
});


router.post("/addDistrict/many", async (req, res) => {
    let state = req.body.state;
    let payload = req.body.districts; //array of districts
    // console.log(payload);

    let new_arr = [];

    try {
        let temp;
        payload.forEach((e) => {
            console.log(e);
            
            temp = {};
            temp.state = state;
            temp.district = e.districts_name;
            temp.location = JSON.parse(e.districts_coordinates).reverse();
            temp.area = Number(e.districts_area);
            temp.population = Number(e.districts_population);

            new_arr.push(temp);
        });
        // console.log(new_arr);

        let result = await DistrictModel.insertMany(new_arr);
        return res.json(result);
    } catch (error) {
        console.log(error);
    }
});
// {
//     "state" : "Tamil Nadu",
//     "district": "Kanyakumari",
//     "place": "Plcae name",
//     "location": [ 77.4336, 8.1426 ]
//     "pincode" : 9595959
// }
router.post("/addPlace", async (req, res) => {
    let payload = req.body;
    try {
        let place = new PlaceModel(payload);
        let result = await place.save();
        return res.json(result);
    } catch (error) {
        console.log(error);
    }
});

router.get("/temp", async (req, res) => {
    let payload = req.body;
    try {
        let place = await StateModel.find();
        return res.json(place);
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;
