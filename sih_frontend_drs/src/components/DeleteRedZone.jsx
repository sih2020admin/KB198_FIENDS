import React, { useEffect, useState } from "react";
import axios from "axios";
import Authentication from "../service/auth";

function DeleteRedZone(props){
    const [outrage, setOutrage] = useState([]);
    const [clicked, setClicked] = useState(false);
    const [closed, setClosed] = useState(false);
    const [clickedId, setClickedId] = useState("");
    const [closeOutrage, setCloseOutrage] = useState({
        redzoneId: "",
        report: "",
     
      });

      const [isLoad, SetIsLoad] = useState(true);

      const officalToken = Authentication.getToken();

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
        setOutrage(res.data);
        SetIsLoad(false);
      }).catch(err=>{
        console.log(err)
      })
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
          "https://sih-drs-prototype-backend-2.herokuapp.com/api/outrages/virtualRedzones/remove",
        { redzoneId: clickedId },
        {
          headers: {
            "x-official-token": `${officalToken}`
          }
        }
      );
      console.log("👉 Returned data:", response);
      SetIsLoad(true);
      props.getId(123);
      props.getStatus("success", "RedZone Deleted");
    } catch (e) {
      props.getStatus("error", "RedZone Deleted");
      console.log(`😱 Axios request failed: ${e}`);
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
              {/* {value.isCaseOpen && (
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
              )} */}
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
        <div className="row delete-outrage mt-3">
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
export default DeleteRedZone;