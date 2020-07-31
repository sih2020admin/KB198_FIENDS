import React, { useState, useEffect } from "react";
// import ArrowDropDownCircleOutlinedIcon from "@material-ui/icons/ArrowDropDownCircleOutlined";
import Outbreak from "./Outbreak";
import { Button, Tooltip } from "@material-ui/core";
function PlaceTable(props) {
  const [showactivedetail, setShowactiveDetail] = useState(false);
  const [showprevdetail, setShowpreveDetail] = useState(false);
  const [clickedState, SetClickedState] = useState();

  function showPrev(stateName) {
    SetClickedState(stateName);
    setShowpreveDetail(!showprevdetail);
    setShowactiveDetail(false);
  }

  function showActive(stname) {
    SetClickedState(stname);
    setShowactiveDetail(!showactivedetail);
    setShowpreveDetail(false);
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
    const { activeOutrages, previousOutrages, place } = item;

    return (
      <div className="ml-2 text-left" key={index}>
        <div
          className="shadow  Level-table "
          style={{ backgroundColor: "#b9bbdf", color: "#ffffdd" }}
        >
          <div
            style={{ color: "#ffffdd" }}
            className="level-table-item my-auto"
          >
            {" "}
            {place}{" "}
          </div>
          <div
            className="level-table-item"
            onClick={() => {
              showActive(place);
            }}
          >
            <h2 style={{ color: "#ffffdd" }}>
              {" "}
              Active{" "}
              <i className="badge badge-danger">
                {" "}
                {activeOutrages.length}{" "}
              </i>{" "}
              <i class="far fa-caret-square-down text-primary" />
            </h2>
          </div>
          <div
            className="level-table-item"
            onClick={() => {
              showPrev(place);
            }}
          >
            <h2 style={{ color: "#ffffdd" }}>
              Previous{" "}
              <i className="badge badge-warning"> {previousOutrages.length} </i>{" "}
              <i class="far fa-caret-square-down text-primary" />
            </h2>
          </div>
        </div>
        {clickedState === place && (showactivedetail || showprevdetail) ? (
          <div>
            <div className="d-flex justify-content-between">
              {/* <h1 className=" disease-Name text-info ">
                {item.disease}
                <Tooltip title={item.description} arrow>
                  <Button>
                    <i class="fas fa-info-circle" />
                  </Button>
                </Tooltip>
              </h1> */}
              {/* <div
                className="btn btn-sm my-auto btn-outline-primary d-row"
                // onClick={() => {
                //   showDistict(state);
                // }}
              >
                Show Report
              </div> */}
            </div>
            <div class="Level mb-3">
              <div
                class="level-item is-confirmed fadeInUp"
                style={{ animationDelay: "750ms" }}
              >
                <h5>Confirmed</h5>

                <h1>{item.morbidityCount}</h1>
              </div>
              <div
                class="level-item is-active fadeInUp"
                style={{ animationDelay: "750ms" }}
              >
                <h5>Active</h5>

                <h1>{item.activeCount}</h1>
              </div>
              <div
                class="level-item is-recovered fadeInUp"
                style={{ animationDelay: "750ms" }}
              >
                <h5>Recovered</h5>

                <h1>{item.curedCount}</h1>
              </div>
              <div
                class="level-item is-deceased fadeInUp"
                style={{ animationDelay: "750ms" }}
              >
                <h5>Deceased</h5>
                <h1>{item.mortalityCount}</h1>
              </div>
            </div>
          </div>
        ) : null}
        {clickedState === place && showactivedetail ? (
          <Outbreak
            getDetail={getDetail}
            active={activeOutrages}
            style={{ animationDelay: "1000ms" }}
            card={" my-3 shadow-sm active-card fadeInUp"}
          />
        ) : null}
        {clickedState === place && showprevdetail ? (
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

export default PlaceTable;
