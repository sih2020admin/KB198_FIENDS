import React, { useState, useEffect } from "react";
import ArrowDropDownCircleOutlinedIcon from "@material-ui/icons/ArrowDropDownCircleOutlined";
import Outbreak from "./Outbreak";
import DistrictTable from "./DistrictTable";
// import Tooltip from "@material-ui/core/Tooltip";
import { Button, Tooltip } from "@material-ui/core";
import { useHistory } from "react-router-dom";
function Table(props) {
  const [showactivedetail, setShowactiveDetail] = useState(false);
  const [showprevdetail, setShowpreveDetail] = useState(false);
  const [clickedState, SetClickedState] = useState();
  const [showDistrictState, setShowDistrict] = useState(false);
  const [Districtlevel, setDistrictLevel] = useState([]);
  const [disease, setDisease] = useState(props.disease);
  const [isLoad, SetIsLoad] = useState(false);

  const history = useHistory();

  useEffect(() => {
    console.log("Table on fire");
  }, []);

  // const [LanLat, SetLanLat] = useState({ lan: 23.563987, lat: 77.6953125 });

  function showPrev(stateName, item) {
    SetClickedState(stateName);
    setShowpreveDetail(!showprevdetail);
    setShowactiveDetail(false);
    setShowDistrict(false);
    // mapSource(item);
  }

  function showActive(stname, item) {
    SetClickedState(stname);
    setShowactiveDetail(!showactivedetail);
    setShowpreveDetail(false);
    setShowDistrict(false);
    console.log(item);
    // mapSource(item);
  }

  function navReport(state) {
    console.log(state, disease);
    window.open("/report/" + state + "/all/" + disease);
  }

  function showDistict(stateName) {
    setShowactiveDetail(false);
    setShowpreveDetail(false);
    SetIsLoad(true);
    var todayDate = new Date().toISOString().slice(0, 10);

    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    const url =
      "https://sih-drs-prototype-backend-2.herokuapp.com/api/outrages/getDetails/" +
      encodeURI(stateName) +
      "/districts/" +
      encodeURI(disease) +
      "/2020-02-20/" +
      todayDate;
    // decodeURI(str)
    console.log(url);

    fetch(proxyurl + url)
      .then(response => response.json())
      .then(response => {
        setDistrictLevel(response);

        SetIsLoad(false);
        setShowDistrict(!showDistrictState);
      })
      .catch(error => {
        console.log(error.name);
      });

    // SetClickedState(stateName);
  }

  function setLocation(item) {}

  function getDisDetail(input, zooml) {
    props.getDetail(input, 9);
  }

  function getDetail(input, zooml) {
    props.getDetail(input, 7);
  }

  function trail(item, index) {
    const { activeOutrages, previousOutrages, state } = item;

    return (
      <div
        key={index}
        className=" m-auto "
        onClick={() => {
          setLocation(item);
        }}
      >
        <div className="shadow bg-light Level-table">
          <div className="level-table-item my-auto">
            {" "}
            <h2> {state} </h2>
          </div>

          <div
            className="level-table-item"
            onClick={() => {
              showActive(state, activeOutrages);
            }}
          >
            <h2>
              {" "}
              Active{" "}
              <i className="badge badge-danger">
                {" "}
                {activeOutrages.length}{" "}
              </i>{" "}
              <i className="far fa-caret-square-down text-primary" />
            </h2>

            {/* <ArrowDropDownCircleOutlinedIcon />{" "} */}
          </div>
          <div
            className="level-table-item"
            onClick={() => {
              showPrev(state, item);
            }}
          >
            <h2>
              Previous{" "}
              <i className="badge badge-warning"> {previousOutrages.length} </i>{" "}
              <i className="far fa-caret-square-down text-primary" />
            </h2>

            {/* <ArrowDropDownCircleOutlinedIcon /> */}
          </div>
        </div>

        {clickedState === state && (showactivedetail || showprevdetail) ? (
          <div>
            <div className="d-flex justify-content-between">
              <h1 className=" disease-Name text-info ">
                {disease}
                <Tooltip title={item.description} arrow>
                  <Button>
                    <i className="fas fa-info-circle" />
                  </Button>
                </Tooltip>
              </h1>
              <div
                className="btn btn-sm my-auto btn-outline-primary d-row"
                onClick={() => {
                  navReport(state, item.disease);
                }}
              >
                Show Report
              </div>

              <div
                className="btn btn-sm my-auto btn-outline-dark d-row"
                onClick={() => {
                  showDistict(state);
                }}
              >
                Show District
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
        {/* && showDistrictState clickedState === state &&  */}
        {isLoad && clickedState === state && (
          <div id="spinner" class="loader-container">
            <div className="loading" />
          </div>
        )}

        {clickedState === state && showDistrictState ? (
          <DistrictTable
            getDetail={getDisDetail}
            stateName={state}
            DistrictArray={Districtlevel}
            disease={disease}
          />
        ) : null}

        {clickedState === state && showactivedetail ? (
          <Outbreak
            getDetail={getDetail}
            active={activeOutrages}
            style={{ animationDelay: "1000ms" }}
            card={" mb-1 shadow-sm active-card fadeInUp"}
          />
        ) : null}
        {clickedState === state && showprevdetail ? (
          <Outbreak
            getDetail={getDetail}
            active={previousOutrages}
            card={"mb-1 shadow-sm prev-card"}
          />
        ) : null}
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-12 fadeInUp" style={{ animationDelay: "500ms" }}>
          {props.stateLevelDetail.map(trail)}
        </div>
      </div>
    </div>
  );

  // return <div>{props.stateLevelDetail.map(trail)}</div>;
}

export default Table;
