import React, { useEffect, useState } from "react";
import axios from "axios";
import Authentication from "../service/auth";


function EditRedZone(props){


    const [clicked, setClicked] = useState(false);
  const [clickedId, setClickedId] = useState("");
  const [redZone, setRedZone] = useState([]);
  
  const officalToken = Authentication.getToken();
  const [updateOutrage, setUpdateOutrage] = useState({
    maxAllowedPopulation: "",
    alertPhNo: "",
    redzoneId: "",
   
    alertRadius: "",
   
  });
  const [isLoad, SetIsLoad] = useState(true);

  const proxyurl = "https://cors-anywhere.herokuapp.com/";
  const url =
    "https://sih-drs-prototype-backend-2.herokuapp.com/api/outrages/virtualRedzones/";

  useEffect(() => {
    axios
      .get(proxyurl + url, {
        headers: {
          "x-official-token": `${officalToken}`
        }
      })
      .then(res => {
        setRedZone(res.data);
        console.log(res.data);
        SetIsLoad(false);
      })
      .catch(err=>{
          console.log(err)
      })
  }, []);

  function handleChange(event, item) {
    const { name, value } = event.target;
    setUpdateOutrage(prevData => {
      return {
        ...prevData,
        [name]: value,
        redzoneId: clickedId
      };
    });
  }
  function clickHandler(index) {
    setClickedId(index);
    setClicked(!clicked);
  }
  function getDateDetail(input) {
    const event = new Date(input);

    return event.toLocaleDateString("en-US", { day: "numeric", month: "long" });
  }
  async function SubmitHandle(idvalue) {
    console.log(updateOutrage);

    try {
      const response = await axios.put(
        proxyurl +
          "https://sih-drs-prototype-backend-2.herokuapp.com/api/outrages/virtualRedzones/edit",
        updateOutrage,
        {
          headers: {
            "x-official-token": `${officalToken}`
          }
        }
      );
      console.log("👉 Returned data:", response);
      setUpdateOutrage({
        maxAllowedPopulation: "",
        alertPhNo: "",
        redzoneId: "",
        alertRadius: "",
      });
      props.getId(123);
      props.getStatus("success", "RedZone Edited");
    } catch (e) {
      props.getStatus("error", "RedZone Edited");
      console.log(`😱 Axios request failed: ${e}`);
    }
  }
  
  function createList(value, index) {
    return (
      <div className="card shadow" key={index}>
        <div
          className="card-body mb-0"
          onClick={() => {
            clickHandler(value._id);
          }}
        >
          <div className="Level-table">
            
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
         
            <div className="Level-table">
            <h4 style={{ color: "#6f4a8e" }} className="level-table-item">
                Max Allowed : {value.maxAllowedPopulation}
            </h4>
            <h4 style={{ color: "#6f4a8e" }} className="level-table-item">
              Alert Radius :{value.alertRadius}
            </h4>
            
             </div>

        </div>

         {clicked && clickedId === value._id && (
          <div className={"expand-input  open px-3"}>
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


  return (
    <div>
      <div className="container">
        <div className="row mt-3 edit-area">
          <div className="col-md-12">
            {isLoad && (
              <div id="spinner" class="loader-container">
                <div class="loading" />
              </div>
            )}
            {redZone.map(createList)}
          </div>
        </div>
      </div>
    </div>
  );

}
export default EditRedZone