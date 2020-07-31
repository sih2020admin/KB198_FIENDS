import React from "react";
import { useState, useEffect } from "react";
import MapGL, { Source, Layer, Marker,Popup } from "@urbica/react-map-gl";
// import mapHelp from "../service/mapHelp";
// import DiseaseName from "../service/util";
import "mapbox-gl/dist/mapbox-gl.css";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
// import mapHelp from "../service/mapHelp";

import axios from "axios";
import RoomIcon from "@material-ui/icons/Room";
import Authentication from "../service/auth";
// import { green } from "@material-ui/core/colors";
function OutrageMap(props) {
  const TOKEN =
    "pk.eyJ1IjoiaWFtbWFjIiwiYSI6ImNrNzJ3aTg0NDAzNmYzZm4zMXFoZmYzdWIifQ._Wn8fA0nn-EQmtMfvoluDw";

  const [viewport, setViewport] = useState({
    width: "100%",
    height: "100vh",
    latitude: 9.7577,
    longitude: 78.4376,
    zoom: 5
  });
    const changeOptions = {
    duration: 1000
  };
  const style = {
    padding: "10px",
    color: "#fff",
    cursor: "pointer",
    outline:"none",
    background: "#1978c8",
    borderRadius: "50%",
    border:"0"
  };

  const [markerLoc, setMarkerLoc] = useState([]);
  const [temp, setTemp] = useState(false);

  const [locationArray, setLocationArray] = useState([]);
   // const [markerLoc, setMarkerLoc] = useState([]);
   const [viewportChangeMethod, setViewportChangeMethod] = useState("flyTo");

  const [selected, setSelected] = useState(null);
  const officalToken = Authentication.getToken();
  const proxyurl = "https://cors-anywhere.herokuapp.com/";
  const url =
    "https://sih-drs-prototype-backend-2.herokuapp.com/api/outrages/viewOutrages";

  useEffect(() => {
    if (props.markerLoc.length > 0) {
      setMarkerLoc(props.markerLoc);
      setTemp(true);
      setViewport({
        width: "100%",
        height: "100vh",
        latitude: props.markerLoc[1],
        longitude: props.markerLoc[0],
        zoom: 9
      });
    }

    

    axios
      .get(proxyurl + url, {
        headers: {
          "x-official-token": `${officalToken}`
        }
      })
      .then(res => {
        setLocationArray(res.data);
        // console.log(res.data);
      }).catch(err=>{
        console.log(err)
      })
  }, [props.id, officalToken, props.markerLoc]);

  // function changeMap(nextViewport) {
  //   setViewport(nextViewport);
  // }

  return (
    <div>
      <MapGL
        style={{ width: "100%", height: "100vh" }}
        mapStyle="mapbox://styles/mapbox/light-v9"
        accessToken={TOKEN}
        latitude={viewport.latitude}
        longitude={viewport.longitude}
        zoom={viewport.zoom}
        onViewportChange={setViewport}
        viewportChangeMethod={viewportChangeMethod}
        viewportChangeOptions={changeOptions}
      >
        {temp && (
          <Marker latitude={markerLoc[1]} longitude={markerLoc[0]}>
            <div className="marker">
              <ArrowDownwardIcon color="primary" style={{ fontSize: 40 }} />{" "}
            </div>
          </Marker>
        )}
        {locationArray.map((dis, index) => (
          // console.log(dis.location[1], dis.location[0])

          <Marker
            key={index}
            latitude={dis.location[1]}
            longitude={dis.location[0]}
            // onDragEnd={onDragEnd}
            draggable
          >
            <div className="marker">
              {" "}
              <button
                // className="marker-btn"
                style={style}
                onClick={e => {
                  e.preventDefault();
                  setSelected(dis);
                }}
              >
               
              </button>
            </div>
          </Marker>
        ))}
        {selected && (
          <Popup
            longitude={selected.location[0]}
            latitude={selected.location[1]}
            onClose={() => {
              setSelected(null);
            }}
          >
            {" "}
            <div className="card shadow-sm prev-card">
              <div className="card-body text-center h-50 p-1">
                {/* <h5>{item.disease}</h5> */}
                {/* <p className="text-capitalize">{item.description}</p> */}
                <div className="info d-flex justify-content-center">
                  <div className="d-row active mx-2">
                    <p className="m-0">
                      {selected.curedCount === "" ? 0 : selected.curedCount}
                    </p>
                    <p className="m-0">Active</p>
                  </div>
                  <div className="d-row recovery mx-2">
                    <p className="m-0">
                      {selected.morbidityCount === ""
                        ? 0
                        : selected.morbidityCount}{" "}
                    </p>
                    <p className="m-0">Recovery</p>
                  </div>
                  <div className="d-row death mx-2">
                    <p className="m-0">
                      {selected.mortalityCount === ""
                        ? 0
                        : selected.mortalityCount}{" "}
                    </p>
                    <p className="m-0">Death</p>
                  </div>
                </div>
              </div>
            </div>
          </Popup>
        )}
        </MapGL>
    </div>
  );
}

export default OutrageMap;
