import React, { useEffect, useState } from "react";
import axios from "axios";
import Authentication from "../service/auth";
import AreaAutoComplete from "./AreaAutoComplete";


function LocationAlert(props) {
  const [outrage, setOutrage] = useState([]);
  const [clicked, setClicked] = useState(false);
  const [clickedId, setClickedId] = useState("");
  const [closed, setClosed] = useState(false);
  const [Oplace, setPlace] = useState(null);
  const [Olocation, setLocation] = useState([]);

  const [newLoctionalert,SetNewLoctionAlert] = useState(
    {
      place: "",
      location: [],
      alertRadius: "",
      startDate: "",
      endDate: "",
      message: ""
    }
  )

  const [closeOutrage, setCloseOutrage] = useState({
    outrage: "",
    place: "",
    location: [],
    alertRadius: "",
    startDate: "",
    endDate: "",
    message: ""
  });

  const [isLoad, SetIsLoad] = useState(true);

  const officalToken = Authentication.getToken();

  const proxyurl = "https://cors-anywhere.herokuapp.com/";
  const url =
    "https://sih-drs-prototype-backend-2.herokuapp.com/api/outrages/viewOutrages";
  useEffect(() => {
    axios
      .get(proxyurl + url, {
        headers: {
          "x-official-token": `${officalToken}`
        }
      })
      .then(res => {
        setOutrage(res.data);
        SetIsLoad(false);
      })
      .catch(err=>{
        console.log(err)
      });
  }, [isLoad]);

  function handleChange(event) {
    const { name, value } = event.target;

    setCloseOutrage(prevData => {
      return {
        ...prevData,
        [name]: value,
        outrage: clickedId,
        place: Oplace,
        location: Olocation
      };
    });
  }

  function newHandleChange(event){
    const { name, value } = event.target;
    SetNewLoctionAlert(prevData => {
    return {  ...prevData,
      [name]: value,
    }
    })
  }

  async function SubmitHandle() {
    console.log(closeOutrage);
    setClosed(true);

    try {
      const response = await axios.post(
        proxyurl +
          "https://sih-drs-prototype-backend-2.herokuapp.com/api/outrages/addOutrage/locationHistoryAlert",
        closeOutrage,
        {
          headers: {
            "x-official-token": `${officalToken}`
          }
        }
      );
      console.log("👉 Returned data:", response);
      setClosed(false);
      props.getStatus("success", "Location Based Alert Added");
      props.getId(123);
    } catch (e) {
      props.getStatus("error", "Location Based Alert Added");
      console.log(`😱 Axios request failed: ${e}`);
    }
  }

  function clickHandler(index, outPlace, outLocation) {
    // console.log(index);
    setClosed(false);
    setClickedId(index);
    setPlace(outPlace);
    setLocation(outLocation);
    setClicked(!clicked);
  }
  function getDateDetail(input) {
    const event = new Date(input);

    return event.toLocaleDateString("en-US", { day: "numeric", month: "long" });
  }

  function createList(value, index) {
    return (
      <div className="card shadow" key={index}>
        <div
          className="card-body mb-0"
          onClick={() => {
            clickHandler(value._id, value.place, value.location);
          }}
        >
          <h1 className=" disease-Name text-center p-0 text-info my-0">
            {value.disease}
          </h1>
          <div className="Level-table">
            <h4 className="level-table-item">
              Start Date:{" "}
              <span style={{ color: "#878ecd" }}>
                {" "}
                {getDateDetail(value.startDate)}{" "}
              </span>{" "}
            </h4>
            <h1 style={{ color: "#878ecd" }} className="level-table-item">
              {" "}
              {value.place.substring(0, value.place.indexOf(","))}
            </h1>
            <h4 style={{ color: "#6f4a8e" }} className="level-table-item">
              {value.district}
            </h4>
            <h4 style={{ color: "#6f4a8e" }} className="level-table-item">
              {value.state}
            </h4>
            <h4 className="level-table-item">
              {value.isCaseOpen ? (
                <span style={{ color: "#fa7d09", fontSize: "18px" }}>
                  {" "}
                  Case Open
                </span>
              ) : (
                <div>
                  {" "}
                  End Date:{" "}
                  <span style={{ color: "#fa7d09", fontSize: "18px" }}>
                    {" "}
                    {getDateDetail(value.startDate)}{" "}
                  </span>{" "}
                </div>
              )}
            </h4>
          </div>
        </div>

        {clicked && clickedId === value._id && (
          <div className="expand-input open p-3">
            <div className="styled-input">
              <label className="mx-3">Start Date </label>
              <input
                placeholder="Date"
                name="startDate"
                onChange={event => handleChange(event, value)}
                type="date"
                // value={outrage.disease}
                // autoComplete={props.autoComplete}
              />
            </div>
            <div className="styled-input">
              <label className="mx-3">End Date </label>
              <input
                placeholder="Date"
                name="endDate"
                onChange={event => handleChange(event, value)}
                type="date"
              />
            </div>
            <div className="styled-input">
              <label className="mr-3">Alert Radius </label>
              <input
                placeholder="Alert Radius"
                name="alertRadius"
                onChange={event => handleChange(event, value)}
                type="number"
              />
            </div>
            <div className="styled-input">
              <label className="mr-3">Message </label>
              <input
                placeholder="message"
                name="message"
                onChange={event => handleChange(event, value)}
                type="text"
              />
            </div>
            <button
              class="butt my-3 ml-5"
              onClick={() => {
                SubmitHandle(value._id);
              }}
            >
              Update
            </button>
          </div>
        )}
      </div>
    );
  }

  function getLocation(input) {
    props.getLocation(input.location);

    SetNewLoctionAlert(prevData => {
      return {
        ...prevData,
        place: input.place,
        location: input.location
      };
    });
  }

  async function AddNewAlert(){
    console.log(newLoctionalert)
    try {
      const response = await axios.post(
        proxyurl +
          "https://sih-drs-prototype-backend-2.herokuapp.com/api/outrages/addOutrage/locationHistoryAlert",
          newLoctionalert,
        {
          headers: {
            "x-official-token": `${officalToken}`
          }
        }
      );
      console.log("👉 Returned data:", response);
      setClosed(false);
      props.getStatus("success", "Location Based Alert Added");
      props.getId(123);
    } catch (e) {
      props.getStatus("error", "Location Based Alert Added");
      console.log(`😱 Axios request failed: ${e}`);
    }
  }


  return (
    <div>
      <div className="container">
        <div className="row location-alert">
          <div className="col-md-12">
          <div className='loction-form my-3'>
            <h1 className="text-info text-center ">Add New Location Alert</h1>
          <div className="expand-input open p-3">
          <div className="styled-input">

          <AreaAutoComplete getLocation={getLocation}/>

        </div>
            <div className="styled-input">
              <label className="mx-3">Start Date </label>
              <input
                placeholder="Date"
                name="startDate"
                onChange={event => newHandleChange(event)}
                type="date"
                // value={outrage.disease}
                // autoComplete={props.autoComplete}
              />
            </div>
            <div className="styled-input">
              <label className="mx-3">End Date </label>
              <input
                placeholder="Date"
                name="endDate"
                onChange={event => newHandleChange(event)}
                type="date"
              />
            </div>
            <div className="styled-input">
              <label className="mr-3">Alert Radius </label>
              <input
                placeholder="Alert Radius"
                name="alertRadius"
                onChange={event => newHandleChange(event)}
                type="number"
              />
            </div>
            <div className="styled-input">
              <label className="mr-3">Message </label>
              <input
                placeholder="message"
                name="message"
                onChange={event => newHandleChange(event)}
                type="text"
              />
            </div>
            <button
              class="butt my-3 ml-5"
              onClick={() => {
                AddNewAlert();
              }}
            >
              Add Alert
            </button>
          </div>
          </div>
            {isLoad && (
              <div id="spinner" class="loader-container">
                <div class="loading" />
              </div>
            )}
            {outrage.map(createList)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LocationAlert;
