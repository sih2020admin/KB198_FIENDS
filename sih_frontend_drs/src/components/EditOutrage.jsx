import React, { useEffect, useState } from "react";
import axios from "axios";
import Authentication from "../service/auth";

function EditOutrage(props) {
  const [clicked, setClicked] = useState(false);
  const [clickedId, setClickedId] = useState("");
  const [outrage, setOutrage] = useState([]);
  const [morbi, setMorbi] = useState(null);
  const [moti, setMoti] = useState(null);
  const [cured, setCured] = useState(null);

  const [updateOutrage, setUpdateOutrage] = useState({
    morbidityCount: "",
    mortalityCount: "",
    curedCount: "",
    id: "",
    date: ""
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
        console.log(res.data);
        SetIsLoad(false);
      })
      .catch(err=>{
        console.log(err)
      })
  }, []);

  function HandleDate(dateValue, item) {
    const { dailyMorbidityObj, dailyMortalityObj, dailyCuredObj } = item;

    if (dailyMorbidityObj[dateValue] !== undefined) {
      setMorbi(dailyMorbidityObj[dateValue]);

      setMoti(dailyMortalityObj[dateValue]);
      setCured(dailyCuredObj[dateValue]);
    } else {
      setMorbi(0);
      setMoti(0);
      setCured(0);
    }
  }

  function handleChange(event, item) {
    const { name, value } = event.target;

    if (name === "date") {
      HandleDate(value, item);
    }

    setUpdateOutrage(prevData => {
      return {
        ...prevData,
        [name]: value,
        id: clickedId
      };
    });
  }

  async function SubmitHandle(idvalue) {
    console.log(updateOutrage);

    try {
      const response = await axios.put(
        proxyurl +
          "https://sih-drs-prototype-backend-2.herokuapp.com/api/outrages/addOutrage/updateCount",
        updateOutrage,
        {
          headers: {
            "x-official-token": `${officalToken}`
          }
        }
      );
      console.log("👉 Returned data:", response);
      setUpdateOutrage({
        morbidityCount: "",
        mortalityCount: "",
        curedCount: "",
        id: "",
        date: ""
      });
      props.getId(123);
      props.getStatus("success", "Outrage Edited");
    } catch (e) {
      props.getStatus("error", "Outrage Edited");
      console.log(`😱 Axios request failed: ${e}`);
    }
  }

  function clickHandler(index) {
    setMorbi(0);
    setMoti(0); 
    setCured(0);
    setClickedId(index);
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
            clickHandler(value._id);
          }}
        >
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

          <div className="show-content mt-0 Level">
            <h1 className=" disease-Name text-info level-table-item mt-0">
              {value.disease}
            </h1>
            <div
              style={{ animationDelay: "750ms" }}
              className="level-item  is-confirmed fadeInUp"
            >
              <h4 className="m-0">Confirmed</h4>
              <h1 className="m-0">
                {value.mortalityCount === "" ? 0 : value.mortalityCount}
              </h1>
            </div>
            <div
              class="level-item is-recovered fadeInUp"
              style={{ animationDelay: "750ms" }}
            >
              <h4 className="m-0">Recovery</h4>
              <h1 className="m-0">{value.curedCount}</h1>
            </div>
            <div
              class="level-item is-deceased fadeInUp"
              style={{ animationDelay: "750ms" }}
            >
              <h4 className="m-0">Deceased</h4>

              <h1 className="m-0">{value.morbidityCount}</h1>
            </div>
          </div>

          {/* <div className="show-content d-flex justify-content-left">
            <div className="d-row d-row  mx-2">{value.disease}</div>
            <div className="d-row d-row active mx-2">{value.state}</div>
            <div className="d-row d-row recovery mx-2">{value.district}</div>
            <div className="d-row d-row death mx-2">{value.place}</div>
          </div> */}
        </div>

        {clicked && clickedId === value._id && (
          <div className={"expand-input  open px-3"}>
            <div className="styled-input">
              <label className="mx-2">Date</label>
              <input
                placeholder="Date"
                name="date"
                onChange={event => handleChange(event, value)}
                type="date"
                value={updateOutrage.date}
                // autoComplete={props.autoComplete}
              />
              <span />
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="styled-input">
                  <label className="edit-label">Pervious morbidityCount </label>
                  <input
                    placeholder="morbidityCount"
                    name="morbidityCount"
                    // onChange={event => handleChange(event)}
                    type="text"
                    value={morbi}
                    // autoComplete={props.autoComplete}
                    disabled
                  />
                  <span />
                </div>
              </div>
              <div className="col-md-6">
                <div className="styled-input">
                  <label>Current morbidityCount </label>
                  <input
                    placeholder="morbidityCount"
                    name="morbidityCount"
                    onChange={event => handleChange(event)}
                    type="number"
                    value={updateOutrage.morbidiyCount}
                    // autoComplete={props.autoComplete}
                  />
                  <span />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="styled-input">
                  <label>Pervious mortalityCount </label>
                  <input
                    placeholder="mortalityCount"
                    name="mortalityCount"
                    // onChange={event => handleChange(event)}
                    type="number"
                    value={moti}
                    disabled
                    // autoComplete={props.autoComplete}
                  />
                  <span />
                </div>
              </div>
              <div className="col-md-6">
                <div className="styled-input">
                  <label>Current mortalityCount </label>
                  <input
                    placeholder="mortalityCount"
                    name="mortalityCount"
                    onChange={event => handleChange(event)}
                    type="number"
                    value={updateOutrage.mortalityCount}
                    // autoComplete={props.autoComplete}
                  />
                  <span />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="styled-input">
                  <label>Pervious cured Count </label>
                  <input
                    placeholder="curedCount"
                    name="curedCount"
                    // onChange={event => handleChange(event)}
                    type="text"
                    value={cured}
                    disabled
                    // autoComplete={props.autoComplete}
                  />
                  <span />
                </div>
              </div>
              <div className="col-md-6">
                <div className="styled-input">
                  <label>Current cured Count </label>
                  <input
                    placeholder="curedCount"
                    name="curedCount"
                    onChange={event => handleChange(event)}
                    type="number"
                    value={updateOutrage.curedCount}
                    // autoComplete={props.autoComplete}
                  />
                  <span />
                </div>
              </div>
            </div>

            <button
              className="butt my-3 ml-5"
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
            {outrage.map(createList)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditOutrage;
