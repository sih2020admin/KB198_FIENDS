import React, { useState, useEffect } from "react";
import { useSpring, animated } from "react-spring";
import reportHelp from "../service/reportHelp";
import mapHelp from "../service/mapHelp";
import { BrowserRouter as Router, Redirect } from "react-router-dom";

function Outbreak(props) {
  const fade = useSpring({ opacity: 1, from: { opacity: 0 } });

  const [isClicked, setIsClicked] = useState(false);
  const [clickId, setClickedId] = useState("");
  const [isReportClick, setReportClick] = useState(false);

  function emptyCard() {
    return (
      <div className={props.card}>
        <div className="card-body text-center h-50 p-1">
          <p className="text-capitalize">No Item Founded </p>
        </div>
      </div>
    );
  }

  function cardClick(input, item) {
    // console.log(item.location);
    props.getDetail(item.location, 8);
    console.log(item.location);

    mapHelp.setLocation(true, item.location, input);
    setClickedId(input);
    setIsClicked(!isClicked);
  }

  async function reportHandler(id, item) {
    const done = await reportHelp.setId(item);
    if (done) {
      setReportClick(true);
    }
    // console.log(item);
  }

  function getDateDetail(input) {
    const event = new Date(input);

    return event.toLocaleDateString();
  }

  function List(item, index) {
    return (
      <div
        style={fade}
        className={props.card}
        key={index}
        onClick={() => {
          cardClick(index, item);
        }}
      >
        <div
          style={{ animationDelay: "1000ms" }}
          className=" text-center h-50 p-1 fadeInUp"
        >
          {/* <h5>{item.disease}</h5> */}
          {/* info d-flex justify-content-center <p className="text-capitalize">{item.description}</p> */}
          <div
            className="Level my-auto fadeInUp"
            style={{ animationDelay: "500ms" }}
          >
            <div
              style={{ animationDelay: "750ms" }}
              className="level-item p-2 fadeInUp "
            >
              {}
              <h4 className="m-0">Date: {getDateDetail(item.startDate)}</h4>
              <h4 className="m-0">
                Place:
                {item.place.substring(0, item.place.indexOf(","))}
              </h4>
            </div>
            <div
              style={{ animationDelay: "750ms" }}
              className="level-item is-confirmed fadeInUp"
            >
              <h4 className="m-0">Confirmed</h4>
              <h1 className="m-0">
                {item.morbidityCount === "" ? 0 : item.morbidityCount}
              </h1>
            </div>

            <div
              style={{ animationDelay: "750ms" }}
              className="level-item is-active fadeInUp"
            >
              <h4 className="m-0">Active</h4>
              <h1 className="m-0">
                {item.morbidityCount - item.curedCount - item.mortalityCount}
              </h1>
            </div>
            <div
              style={{ animationDelay: "750ms" }}
              className="level-item is-recovered fadeInUp"
            >
              <h4 className="m-0">Recovery</h4>
              <h1 className="m-0">
                {item.curedCount === "" ? 0 : item.curedCount}{" "}
              </h1>
            </div>
            <div
              style={{ animationDelay: "750ms" }}
              className="level-item is-deceased fadeInUp"
            >
              <h4 className="m-0">Death</h4>
              <h1 className="m-0">
                {item.mortalityCount === "" ? 0 : item.mortalityCount}{" "}
              </h1>
            </div>
          </div>
          {/* {clickId === index && isClicked && (
            <button
              onClick={() => reportHandler(item._id, item)}
              className="btn btn-primary my-2"
            >
              Report
            </button>
          )} */}
        </div>
      </div>
    );
  }

  return (
    <div className="outbreak-area">
      {isReportClick && <Redirect to="/report" />}
      {props.active.length > 0 ? props.active.map(List) : emptyCard()}
    </div>
  );

  // return ;
}

export default Outbreak;
