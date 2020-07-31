import React, { useState, useEffect } from "react";
import axios from "axios";
import Authentication from "../service/auth";
import AutoComplete from "./AutoComplete";

function AddRedZone(props){


    const [stateName, setStateName] = useState("");

  const [districtArray, setDistrictArray] = useState([]);

  const [stateArray, setStateArray] = useState([]);

  const officalToken = Authentication.getToken();

  const [redZone, addRedZone] = useState({
    maxAllowedPopulation: "",
    alertPhNo: "",
    state: "",
    place: "",
    district: "",
    alertRadius: "",
    location: [78, 12],
    
  });

  const proxyurl = "https://cors-anywhere.herokuapp.com/";
  const url =
    "https://sih-drs-prototype-backend-2.herokuapp.com/api/getLocationDetails/states";
  useEffect(() => {
    fetch(proxyurl + url)
      .then(response => response.json())
      .then(response => {
        setStateArray(response);
      })
      .catch(error => {
        console.log(error.name);
      });
  }, []);

  
  const districturl =
    "https://sih-drs-prototype-backend-2.herokuapp.com/api/getLocationDetails/" +
    decodeURI(stateName) +
    "/districts";
  useEffect(() => {
    fetch(proxyurl + districturl)
      .then(response => response.json())
      .then(response => {
        setDistrictArray(response);
      })
      .catch(error => {
        console.log(error.name);
      });
  }, [stateName, districturl]);

  function optionList(name, index) {
    return (
      <option value={name} key={index}>
        {" "}
        {name}{" "}
      </option>
    );
  }

  function handleChange(event) {
    const { name, value } = event.target;

    if (name === "state") {
      setStateName(value);
    }

    addRedZone(prevData => {
      return {
        ...prevData,
        [name]: value
      };
    });
  }
  async function formHandle(event) {
    event.preventDefault();
    console.log(redZone, officalToken);

    try {
      const response = await axios.post(
        proxyurl +
          "https://sih-drs-prototype-backend-2.herokuapp.com/api/outrages/addVirtualRedzone/",
        redZone,
        {
          headers: {
            "x-official-token": `${officalToken}`
          }
        }
      );
      console.log("👉 Returned data:", response);
      
      props.getId(123);
      props.getStatus("success", "RedZone Added");
      addRedZone({maxAllowedPopulation: "",
      alertPhNo: "",
      state: "",
      place: "",
      district: "",
      alertRadius: "",
      location: [78, 12]})
    } catch (e) {
      props.getStatus("error", "RedZone Added");
      console.log(`😱 Axios request failed: ${e}`);
    }
  }

  function getLocation(input) {
    props.getLocation(input.location);

    addRedZone(prevData => {
        return {
          ...prevData,
          place: input.place,
          location: input.location
        };
      });

    // console.log(input);
  }
//   onSubmit={formHandle}
  return (
    <div className="my-0 add-outrage p-0">
      <h1 className="outrage-title my-0"> Add Outrage </h1>
      <form className="form-outrage"  onSubmit={formHandle}>
        <div className="styled-input">
          <input
            placeholder="max Allowed Population"
            name="maxAllowedPopulation"
            // class="change"
            onChange={event => handleChange(event)}
            type="text"
            // value={outrage.disease}
            // autoComplete={props.autoComplete}
          />
          {/* <label> Disease Details </label> */}
          <span />
        </div>
        <div className="styled-input">
          {/* {props.label && (
        <label>{props.label}</label>
      )} */}
          <select
            onChange={event => handleChange(event)}
            name="state"
            className="selectbox"
          >
            <option>Select the State </option>
            {stateArray.map(optionList)}
          </select>
          <span />
          {/* {error && (
        <p className="error">{error}</p>
      )} */}
        </div>

        <div className="styled-input">
          {/* {props.label && (
        <label>{props.label}</label>
      )} */}
          <select
            onChange={event => handleChange(event)}
            name="district"
            className=""
          >
            <option className="changeOption">Select the District </option>
            {districtArray.map(optionList)}
          </select>
          {/* {error && (
        <p className="error">{error}</p>
      )} */}
        </div>

        <AutoComplete getLocation={getLocation} />

        <div className="styled-input">
          {/* {props.label && (
        <label>{props.label}</label>
      )} */}
          <input
            placeholder="Alert Radius"
            name="alertRadius"
            onChange={event => handleChange(event)}
            type="number"
            // value={outrage.alertRadius}

            // autoComplete={props.autoComplete}
          />
          <span />
          {/* {error && (
        <p className="error">{error}</p>
      )} */}
        </div>
        
        <div className="styled-input">
          <input
            placeholder="Phone Number"
            name="alertPhNo"
            // class="change"
            onChange={event => handleChange(event)}
            type="text"
            // value={outrage.disease}
            // autoComplete={props.autoComplete}
          />
          {/* <label> Disease Details </label> */}
          <span />
        </div>

        <button className="butt my-3 ml-5" type="submit">
          Submit
        </button>
      </form>
    </div>
  );



}
export default AddRedZone;