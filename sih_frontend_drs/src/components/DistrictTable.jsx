import React, { useState, useEffect } from "react";
// import ArrowDropDownCircleOutlinedIcon from "@material-ui/icons/ArrowDropDownCircleOutlined";
import Outbreak from "./Outbreak";
import { Button, Tooltip } from "@material-ui/core";
import PlaceTable from "./PlaceTable";
import { useHistory } from "react-router-dom";
function DistrictTable(props) {
  const [showactivedetail, setShowactiveDetail] = useState(false);
  const [showprevdetail, setShowpreveDetail] = useState(false);
  const [clickedState, SetClickedState] = useState();
  const [Placelevel, setPlaceLevel] = useState([]);
  const [isLoad, SetIsLoad] = useState(false);
  const [showDistrictState, setShowDistrict] = useState(false);
  const history = useHistory();
  function showPrev(stateName) {
    SetClickedState(stateName);
    setShowpreveDetail(!showprevdetail);
    setShowactiveDetail(false);
  }

  function navReport(district) {
    // console.log(state, disease);
    history.push(
      "/report/" + props.stateName + "/" + district + "/" + props.disease
    );
  }

  function showActive(stname) {
    SetClickedState(stname);
    setShowactiveDetail(!showactivedetail);
    setShowpreveDetail(false);
  }

  function showDistict(disName) {
    setShowactiveDetail(false);
    setShowpreveDetail(false);
    SetIsLoad(true);
    var todayDate = new Date().toISOString().slice(0, 10);

    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    const url =
      "https://sih-drs-prototype-backend-2.herokuapp.com/api/outrages/getDetails/places/" +
      encodeURI(props.stateName) +
      "/" +
      encodeURI(disName) +
      "/" +
      encodeURI(props.disease) +
      "/2020-02-20/" +
      todayDate;

    console.log(url);

    fetch(proxyurl + url)
      .then(response => response.json())
      .then(response => {
        console.log(response);
        setPlaceLevel(response);
        SetIsLoad(false);
        setShowDistrict(!showDistrictState);
      })
      .catch(error => {
        console.log(error.name);
      });

    // SetClickedState(stateName);
  }

  function emptyCard() {
    return (
      <div className={props.card}>
        <div className="card-body text-center h-50 p-1">
          <p className="text-capitalize">No Item Founded </p>
        </div>
      </div>
    );
  }

  function getDetail(input, zooml) {
    props.getDetail(input, zooml);
  }

  function trail(item,index) {
    const { activeOutrages, previousOutrages, district } = item;

    return (
      <div className="ml-5 text-left" key={index}>
        <div
          className="shadow  Level-table "
          style={{ backgroundColor: "#b9bbdf", color: "#ffffdd" }}
        >
          <div
            style={{ color: "#ffffdd" }}
            className="level-table-item my-auto"
          >
            {" "}
            {district}{" "}
          </div>
          <div
            className="level-table-item"
            onClick={() => {
              showActive(district);
            }}
          >
            <h2 style={{ color: "#ffffdd" }}>
              {" "}
              Active{" "}
              <i className="badge badge-danger">
                {" "}
                {activeOutrages.length}{" "}
              </i>{" "}
              <i className="far fa-caret-square-down text-primary" />
            </h2>
          </div>
          <div
            className="level-table-item"
            onClick={() => {
              showPrev(district);
            }}
          >
            <h2 style={{ color: "#ffffdd" }}>
              Previous{" "}
              <i className="badge badge-warning"> {previousOutrages.length} </i>{" "}
              <i className="far fa-caret-square-down text-primary" />
            </h2>
          </div>
        </div>
        {clickedState === district && (showactivedetail || showprevdetail) ? (
          <div>
            <div className="d-flex justify-content-between">
              <h1 className=" disease-Name text-info ">
                {item.disease}
                <Tooltip title={item.description} arrow>
                  <Button>
                    <i class="fas fa-info-circle" />
                  </Button>
                </Tooltip>
              </h1>
              <div
                className="btn btn-sm my-auto btn-outline-primary d-row"
                onClick={() => {
                  navReport(district);
                }}
              >
                Show Report
              </div>

              <div
                className="btn btn-sm my-auto btn-outline-dark d-row"
                onClick={() => {
                  showDistict(district);
                }}
              >
                Show Place
              </div>
            </div>
            <div className="Level mb-3">
              <div
                className="level-item is-confirmed fadeInUp"
                style={{ animationDelay: "750ms" }}
              >
                <h5>Confirmed</h5>

                <h1>{item.morbidityCount}</h1>
              </div>
              <div
                className="level-item is-active fadeInUp"
                style={{ animationDelay: "750ms" }}
              >
                <h5>Active</h5>

                <h1>{item.activeCount}</h1>
              </div>
              <div
                className="level-item is-recovered fadeInUp"
                style={{ animationDelay: "750ms" }}
              >
                <h5>Recovered</h5>

                <h1>{item.curedCount}</h1>
              </div>
              <div
                className="level-item is-deceased fadeInUp"
                style={{ animationDelay: "750ms" }}
              >
                <h5>Deceased</h5>
                <h1>{item.mortalityCount}</h1>
              </div>
            </div>
          </div>
        ) : null}

        {isLoad && clickedState === district && (
          <div id="spinner" class="loader-container">
            <div className="loading" />
          </div>
        )}

        {clickedState === district && showDistrictState ? (
          <PlaceTable
            getDetail={getDetail}
            // stateName={state}
            DistrictArray={Placelevel}
          />
        ) : null}
        {clickedState === district && showactivedetail ? (
          <Outbreak
            getDetail={getDetail}
            active={activeOutrages}
            style={{ animationDelay: "1000ms" }}
            card={" my-3 shadow-sm active-card fadeInUp"}
          />
        ) : null}
        {clickedState === district && showprevdetail ? (
          <Outbreak
            getDetail={getDetail}
            active={previousOutrages}
            card={"my-3 shadow-sm prev-card fadeInUp"}
          />
        ) : null}
      </div>
    );
  }
  return props.DistrictArray.length > 0
    ? props.DistrictArray.map(trail)
    : emptyCard();
}

export default DistrictTable;
