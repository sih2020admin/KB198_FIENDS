import React, { useState } from "react";
import { Tabs, Tab, AppBar, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
// import Paper from '@material-ui/core/Paper';
import AddOutrage from "./Addoutrage";
import NavBar from "./NavBar";
import EditOutrage from "./EditOutrage";
import LocationAlert from "./LocationAlert";
import DeleteOutrage from "./DeleteOutrage";
import LoginHelp from "../service/loginHelp";
import OutrageMap from "./OutrageMap";
import AddRedZone from "./AddRedZone";
import EditRedZone from "./EditRedZone";
import DeleteRedZone from "./DeleteRedZone";
import OtpForm from "./OtpForm";

import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  Route,
  Link
} from "react-router-dom";

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    fontSize: "24px"
  }
});

function OutragePage() {
  const classes = useStyles();

  const [value, setValue] = useState(0);
  const [id, setId] = useState(null);
  const [status, setStatus] = useState(false);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);
  const [markerLoc, setMarkerLoc] = useState([]);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function getId(input) {
    setId(input);
  }

  function getLocation(input) {
    setMarkerLoc(input);
    console.log("out", input);
  }

  function getStatus(input, info) {
    if (input === "success") {
      setStatus(true);
      setInfo(info);
    } else {
      setError(true);
      setInfo(info);
    }
  }

  const [isLogin, setIsLogin] = useState(LoginHelp.getLogin());

  return (
    <>
      {/* // <AppBar position="static"> */}
      {!isLogin && <Redirect to="/login" />}
      {isLogin && <Redirect to="/outrage" />}
      {isLogin && <NavBar />}

      <div className="container-fluid">
        {status && (
          <div
            class="alert alert-success alert-dismissible fade show"
            role="alert"
          >
            {info} SuccesFully
            <button
              type="button"
              class="close"
              data-dismiss="alert"
              aria-label="Close"
              onClick={()=>{
                setStatus(false)
              }}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        )}
        {error && (
          <div
            class="alert alert-danger alert-dismissible fade show"
            role="alert"
          >
            {info} Failed , Pleae Try Again
            <button
              type="button"
              class="close"
              data-dismiss="alert"
              aria-label="Close"
              onClick={()=>{
                setStatus(false)
              }}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        )}

        <div className="row">
          <div className="col-md-12 p-0 " />
        </div>
        <div className="row">
          <div className="col-md-6 p-0">
            <Paper className={classes.root}>
              <Tabs value={value} onChange={handleChange}   variant="scrollable"
          scrollButtons="on"
          indicatorColor="primary"
          textColor="primary"
          aria-label="scrollable force tabs example">
                <Tab label="ADD Outrage" />
                <Tab label="Edit Outrage" />
                <Tab label="Delete Outrage" />
                <Tab label="Location Alert" />
                <Tab label="Add Redzone" />
                <Tab label="Edit Redzone" />
                <Tab label="Delete Redzone" />
                <Tab label="Moblie Register" />
              </Tabs>
            </Paper>
            {isLogin && value === 0 && (
              <AddOutrage
                getLocation={getLocation}
                getStatus={getStatus}
                getId={getId}
              />
            )}
            {value === 1 && <EditOutrage getStatus={getStatus} getId={getId} />}
            {value === 2 && (
              <DeleteOutrage getStatus={getStatus} getId={getId} />
            )}
            {value === 3 && (
              <LocationAlert getStatus={getStatus} getId={getId} />
            )}
            {value === 4 && (
              <AddRedZone  getLocation={getLocation} getStatus={getStatus} getId={getId} />
            )}
            {value ==5  && (
              <EditRedZone  getLocation={getLocation} getStatus={getStatus} getId={getId} />
            )}
            {value ==6  && (
              <DeleteRedZone  getStatus={getStatus} getId={getId} />
            )}
            {value ==7  && (
              <OtpForm getLocation={getLocation}  getStatus={getStatus} getId={getId} />
            )}
          </div>
          <div className="col-md-6 p-0">
            <OutrageMap markerLoc={markerLoc} id={id} />
          </div>
        </div>
      </div>
    </>
  );
}

export default OutragePage;
