import React, { useState, useEffect } from "react";
import axios from "axios";
import Authentication from "../service/auth";
import AutoComplete from "./AutoComplete";

function Addoutrage(props) {
  // console.log("token " + props.officalToken);

  const [stateName, setStateName] = useState("");

  const [districtArray, setDistrictArray] = useState([]);

  const [stateArray, setStateArray] = useState([]);

  const officalToken = Authentication.getToken();

  const [showList, setShowList] = useState(false);
  const [search, setSearch] = useState("");

  const [DiseaseArray, setDiseaseArray] = useState([]);
 

  const [outrage, addOutrage] = useState({
    morbidityCount: "",
    mortalityCount: "",
    curedCount: "",
    disease: "",
    state: "",
    place: "",
    district: "",
    alertRadius: "",
    location: [78, 12],
    startDate: ""
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

    if(stateName !== ""){
      fetch(proxyurl + districturl)
      .then(response => response.json())
      .then(response => {
        setDistrictArray(response);
      })
      .catch(error => {
        console.log(error.name);
      });
    }
   
  }, [stateName, districturl]);

  const Diseaseurl =
  "https://sih-drs-prototype-backend-2.herokuapp.com/api/outrages/diseases/all";
useEffect(() => {
  
  try {
    axios.get(proxyurl + Diseaseurl).then(res => {
      console.log(res.data);
      setDiseaseArray(res.data);
    });
  } catch (e) {
    console.log(e);
  }
}, []);

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

    if(name==="disease"){
      value === "" ? setShowList(false) : setShowList(true);
      setSearch(value);
    }

    addOutrage(prevData => {
      return {
        ...prevData,
        [name]: value
      };
    });
  }
 
  async function formHandle(event) {
    event.preventDefault();
    console.log(outrage, officalToken);

    try {
      const response = await axios.post(
        proxyurl +
          "https://sih-drs-prototype-backend-2.herokuapp.com/api/outrages/addOutrage/",
        outrage,
        {
          headers: {
            "x-official-token": `${officalToken}`
          }
        }
      );
      console.log("👉 Returned data:", response);
      addOutrage({
        morbidityCount: "",
        mortalityCount: "",
        curedCount: "",
        disease: "",
        state: "",
        place: "",
        district: "",
        alertRadius: "",
        location: [78, 12],
        startDate: ""
      });
      props.getId(123);
      props.getStatus("success", "Outrage Added");
    } catch (e) {
      props.getStatus("error", "Outrage Added");
      console.log(`😱 Axios request failed: ${e}`);
    }
  }

  function getLocation(input) {
    props.getLocation(input.location);

    addOutrage(prevData => {
      return {
        ...prevData,
        place: input.place,
        location: input.location
      };
    });
  }



  function inputOnChange(event) {
    const { value } = event.target;

    value === "" ? setShowList(false) : setShowList(true);

    setSearch(value);
  }

  async function ListHandler(item) {
    console.log(item)
    outrage.disease = item;
    // addOutrage(prevData => {
    //   return {
    //     ...prevData,
    //     [dummy]:item,
    //     // location: input.location
    //   };
    // });
    // setSearch(item);
    // const save = await DiseaseName.setDisease(item);
    // props.getName(item);
    setShowList(false);
  }

  
  function DisplayList(item, index) {
    return (
   
      <div className="AutocompletePlace-items" key={index}>
        <div
          className=""
          onClick={() => {
            ListHandler(item);
          }}
          key={index}
          value={item}
        >
          {" "}
          {item}{" "}
        </div>
      </div>

    );
  }


  function inputOnChange(event) {
    const { value } = event.target;

    value === "" ? setShowList(false) : setShowList(true);

    setSearch(value);
  }

  // async function ListHandler(item) {
  //   console.log(item)
  //   // setSearch(item);
  //   // const save = await DiseaseName.setDisease(item);
  //   // props.getName(item);
  //   setShowList(false);
  // }

  // async function SubmitHandler() {
  //   // const save = await DiseaseName.setDisease(search);
  //   // props.getName(search);
  // }

  function DisplayList(item, index) {
    return (
   
      <li className="AutocompletePlace-items" key={index}>
        <div
          className="result"
          onClick={() => {
            ListHandler(item);
          }}
          key={index}
          value={item}
        >
          {" "}
          {item}{" "}
        </div>
      </li>
    
    );
  }




  return (
    <div className="my-0 add-outrage p-0">
      <h1 className="outrage-title my-0"> Add Outrage </h1>
      <form className="form-outrage" onSubmit={formHandle}>
        <div className="styled-input">

           <input
              className="sea"
              name="disease"
              type="text"
              placeholder="Enter Disease Name Some"
              // onClick={inputHandler}
              onChange={event => handleChange(event)}
              value={outrage.disease}
              autoComplete="off"
            />

          {/* <input
            placeholder="Disease Name"
            name="disease"
            // class="change"
            onChange={event => handleChange(event)}
            type="text"
            value={outrage.disease}
            // autoComplete={props.autoComplete}
          /> */}
          {/* <label> Disease Details </label> */}
          <span />
          {showList &&(
          <ul className="AutocompletePlace-results">
          {DiseaseArray.filter(
            vaule => vaule.toLowerCase().indexOf(search.toLowerCase()) > -1
          ).map(DisplayList)}</ul>)}
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
            value={outrage.alertRadius}

            // autoComplete={props.autoComplete}
          />
          <span />
          {/* {error && (
        <p className="error">{error}</p>
      )} */}
        </div>
        <div className="styled-input">
          {/* {props.label && (
        <label>{props.label}</label>
      )} */}
          <input
            placeholder="startDate"
            name="startDate"
            onChange={event => handleChange(event)}
            type="date"
            value={outrage.startDate}
            style={{ textAlign: "center" }}

            // autoComplete={props.autoComplete}
          />
          <span />
          {/* {error && (
        <p className="error">{error}</p>
      )} */}
        </div>

        <div className="styled-input">
          {/* {props.label && (
        <label>{props.label}</label>
      )} */}
          <input
            placeholder="Morbidity Count"
            name="morbidityCount"
            onChange={event => handleChange(event)}
            type="text"
            value={outrage.morbidityCount}

            // autoComplete={props.autoComplete}
          />
          <span />
          {/* {error && (
        <p className="error">{error}</p>
      )} */}
        </div>

        <div className="styled-input">
          {/* {props.label && (
        <label>{props.label}</label>
      )} */}
          <input
            placeholder="Mortality Count"
            name="mortalityCount"
            onChange={event => handleChange(event)}
            type="text"
            value={outrage.mortalityCount}

            // autoComplete={props.autoComplete}
          />
          <span />
          {/* {error && (
        <p className="error">{error}</p>
      )} */}
        </div>
        <div className="styled-input">
          {/* {props.label && (
        <label>{props.label}</label>
      )} */}
          <input
            placeholder="Cured Count"
            name="curedCount"
            onChange={event => handleChange(event)}
            type="text"
            value={outrage.curedCount}

            // autoComplete={props.autoComplete}
          />
          <span />
          {/* {error && (
        <p className="error">{error}</p>
      )} */}
        </div>

        <button className="butt my-3 ml-5" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}

export default Addoutrage;
