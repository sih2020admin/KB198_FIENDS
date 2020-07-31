import React, { useState, useEffect } from "react";
import axios from "axios";
import Authentication from "../service/auth";
import AutoComplete from "./AutoComplete";

function OptForm(props) {

  const [otpDetail, setOtpDetail] = useState({
    otp: "",
    phNo: "",
    state: "",
    place: "",
    district: "",
    location: [78, 12],
  });

  

  const [stateName, setStateName] = useState("");

  const [districtArray, setDistrictArray] = useState([]);

  const [phno , setPhno] = useState("");

  const [stateArray, setStateArray] = useState([]);

  const [sendOtp , setSendOtp] = useState(false);

  const officalToken = Authentication.getToken();

  
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

    function getLocation(input) {
        props.getLocation(input.location);
    
        setOtpDetail(prevData => {
            return {
              ...prevData,
              place: input.place,
              location: input.location
            };
          });
    
        // console.log(input);
      }
      async function PostOtp(event) {
        event.preventDefault();
        console.log(otpDetail, officalToken,phno);
    
        try {
          const response = await axios.post(
            proxyurl +
              "https://sih-drs-prototype-backend-2.herokuapp.com/api/outrages/nonSmartPhoneUsers/register/sendOTP/",
              {
  
                "phNo": phno
            }
            ,
            {
              headers: {
                "x-official-token": `${officalToken}`
              }
            }
          );
          console.log("👉 Returned data:", response);
          setSendOtp(true);
          props.getStatus("success", "OTP Register");
        } catch (e) {
          props.getStatus("error", "OTP Register");
          console.log(`😱 Axios request failed: ${e}`);
        }
      }
      async function PostData(event) {
        event.preventDefault();
        console.log(otpDetail, officalToken,phno);
    
        try {
          const response = await axios.post(
            proxyurl +
              "https://sih-drs-prototype-backend-2.herokuapp.com/api/outrages/nonSmartPhoneUsers/register/confirmOTP/",
              otpDetail
            ,
            {
              headers: {
                "x-official-token": `${officalToken}`
              }
            }
          );
          console.log("👉 Returned data:", response);
          // setSendOtp(false);
          setOtpDetail({
            otp: "",
            phNo: "",
            state: "",
            place: "",
            district: "",
            location: [78, 12],
          })
          props.getId(123);
          props.getStatus("success", "Otp Sent");
        } catch (e) {
          props.getStatus("error", "Otp Sent ");
          console.log(`😱 Axios request failed: ${e}`);
        }
      }
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

        if(name === "phNo"){
          setPhno(value);
        }
    
        setOtpDetail(prevData => {
          return {
            ...prevData,
            [name]: value
          };
        });
      }


    // onSubmit={formHandle}
    return (
    <div className="my-0 add-outrage p-0">
      <h1 className="outrage-title my-0">Mobile Register </h1>
      <form className="form-outrage" >
        <div className="styled-input">
          <input
            placeholder="Phone Number"
            name="phNo"
            // class="change"
            onChange={event => handleChange(event)}
            type="text"
            value={otpDetail.phNo}
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

       
        {sendOtp && (<div> <div className="styled-input">
          <input
            placeholder="Enter the OTP"
            name="otp"
            // class="change"
            onChange={event => handleChange(event)}
            type="text"
            value={otpDetail.opt}
            // autoComplete={props.autoComplete}
          />
          {/* <label> Disease Details </label> */}
          <span />
        </div>
        <button className="butt my-3 ml-5" onClick={PostData}>
          Confrim OTP
        </button>
        </div>
         )}
       

       <button className="butt my-3 ml-5" onClick={PostOtp}>
          Send OTP
        </button> 
      </form>
    </div>
  );
}

export default OptForm;