import React, { useEffect, useState } from "react";
import axios from "axios";
import Authentication from "../service/auth";

function DeleteOutrage(props) {
  const [outrage, setOutrage] = useState([]);
  const [clicked, setClicked] = useState(false);
  const [clickedId, setClickedId] = useState("");
  const [closed, setClosed] = useState(false);

  const [closeOutrage, setCloseOutrage] = useState({
    id: "",
    report: "",
    locationHistoryAler: false
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
        id: clickedId
      };
    });
  }

  async function DeleteHandle() {
    try {
      const response = await axios.post(
        proxyurl +
          "https://sih-drs-prototype-backend-2.herokuapp.com/api/outrages/addOutrage/remove",
        { outrageId: clickedId },
        {
          headers: {
            "x-official-token": `${officalToken}`
          }
        }
      );
      console.log("👉 Returned data:", response);
      SetIsLoad(true);
      props.getId(123);
      props.getStatus("success", "Outrage Deleted");
    } catch (e) {
      props.getStatus("error", "Outrage Deleted");
      console.log(`😱 Axios request failed: ${e}`);
    }
  }

  async function SubmitHandle() {
    console.log(closeOutrage);
    setClosed(true);

    if (closed) {
      if (closeOutrage.report !== "") {
        try {
          const response = await axios.put(
            proxyurl +
              "https://sih-drs-prototype-backend-2.herokuapp.com/api/outrages/addOutrage/closeOutrage",
            closeOutrage,
            {
              headers: {
                "x-official-token": `${officalToken}`
              }
            }
          );
          console.log("👉 Returned data:", response);
          setCloseOutrage({
            id: "",
            report: "",
            locationHistoryAler: false
          });
          props.getId(123);
          setClosed(false);
          props.getStatus("success", "Closed");
        } catch (e) {
          props.getStatus("error", "Closed");
          console.log(`😱 Axios request failed: ${e}`);
        }
      }
    }
  }

  function clickHandler(index) {
    // console.log(index);
    setClosed(false);
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

        <div className={"expand-input  open px-3"}>
          {closed && clickedId === value._id && (
            <div className="p-3">
              {/* <label> Remarks </label> */}
              <textarea
                placeholder="Remarks"
                name="report"
                onChange={event => handleChange(event)}
                type="text"
                // value={outrage.disease}
                // autoComplete={props.autoComplete}
              />
              {/* <span /> */}
            </div>
          )}

          {clicked && clickedId === value._id && (
            <div className="d-flex justify-content-between">
              {value.isCaseOpen && (
                <div
                  className="btn btn-warning d-row m-3 p-2"
                  onClick={() => {
                    SubmitHandle();
                  }}
                >
                  {closed && clickedId === value._id
                    ? "Update and Close"
                    : "Close"}
                </div>
              )}
              <div
                className="btn btn-danger d-row m-3 p-2"
                onClick={() => {
                  DeleteHandle();
                }}
              >
                {" "}
                Delete{" "}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="container">
        <div className="row edit-area mt-3">
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

export default DeleteOutrage;
