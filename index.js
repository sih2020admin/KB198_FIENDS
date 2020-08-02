const express = require("express");
const mongoose = require("mongoose");
let morgan = require("morgan");
require("dotenv").config();
const port = process.env.PORT || 55555;

const db_str = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@cluster0-twrax.mongodb.net/sih-backend-prototype-2?retryWrites=true&w=majority`;

const mongoConnection = mongoose
    .connect(db_str, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    })
    .then(() => {
        console.log(`Connected to db`);
    })
    .catch((err) => {
        console.log("error : " + err);
    });

const app = express();
app.set("trust proxy", 1);

app.use(morgan("tiny"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const officials = require("./api/routes/officials");
const appUsers = require("./api/routes/appUsers");
const place = require("./api/routes/placeDetails");
const getLocation = require("./api/routes/getLocationDetails");
const report = require("./api/routes/report");

app.use("/api/outrages", officials);
app.use("/api/appUsers", appUsers);
app.use("/api/report", report);

// to add states,districts,are population,area,geo
app.use("/api/place", place);
app.use("/api/getLocationDetails", getLocation);

app.listen(port, () => {
    console.log("connected to server");
    console.log(port);
});
