import React from "react";
import { useState, useEffect } from "react";
import DiseaseName from "../service/util";
// import ReactMapGL, {
//   FlyToInterpolator,
//   Marker,
//   Source,
//   Popup,
//   Layer
// } from "react-map-gl";
import MapGL, { Source, Layer, Marker,Popup } from "@urbica/react-map-gl";
// import mapHelp from "../service/mapHelp";
// import DiseaseName from "../service/util";
import "mapbox-gl/dist/mapbox-gl.css";
import axios from "axios";
import RoomIcon from "@material-ui/icons/Room";
// import { green } from "@material-ui/core/colors";
function Map(props) {
  const TOKEN =
    "pk.eyJ1IjoiaWFtbWFjIiwiYSI6ImNrNzJ3aTg0NDAzNmYzZm4zMXFoZmYzdWIifQ._Wn8fA0nn-EQmtMfvoluDw";

  const [viewport, setViewport] = useState({
    width: "100%",
    height: "100vh",
    latitude: 78.7577,
    longitude: 9.4376,
    zoom: 5
    // transitionInterpolator: new FlyToInterpolator({
    //   speed: 2
    // }),
    // transitionDuration: "auto"
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
    border:"0",
    boxShadow:"10px 10px 10px 10p rgba(126, 255, 245,0.5)"
  };

  // const [markerLoc, setMarkerLoc] = useState([]);
  const [viewportChangeMethod, setViewportChangeMethod] = useState("flyTo");

  const [locationArray, setLocationArray] = useState([]);

  const [selected, setSelected] = useState(null);
  var todayDate = new Date().toISOString().slice(0, 10);

  const [diseaseName , setDiseaseName] = useState(props.disease);

  useEffect(()=>{
    if(diseaseName === ""){
      if(DiseaseName.getDisease() !== ""){
        setDiseaseName(DiseaseName.getDisease())
      }
    }
  },[])


  useEffect(() => {
    // console.log("mapdis " + DiseaseName.getDisease());



    if (props.disease !== "") {
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    const url =
      "https://sih-drs-prototype-backend-2.herokuapp.com/api/outrages/getDetails/" +
      props.disease +
      "/2020-07-14/"+todayDate;
      try {
        axios.get(proxyurl + url).then(res => {
          // setOutrage(res.data);
          setLocationArray(res.data);
          // console.log(res.data);
          // SetIsLoad(false);
        });
      } catch (err) {
        console.log(err);
      }
    // console.log("site");
  }else{
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    const url =
      "https://sih-drs-prototype-backend-2.herokuapp.com/api/outrages/getDetails/" +
      DiseaseName.getDisease() +
      "/2020-07-14/"+todayDate;
      try {
        axios.get(proxyurl + url).then(res => {
          // setOutrage(res.data);
          setLocationArray(res.data);
          // console.log(res.data);
          // SetIsLoad(false);
        });
      } catch (err) {
        console.log(err);
      }
  }

    if (props.disease !== "") {
      
    }

    // }

    setViewport({
      width: "100%",
      height: "100vh",
      latitude: props.lat,
      longitude: props.lon,
      zoom: props.zoom
      // transitionInterpolator: new FlyToInterpolator({
      //   speed: 2
      // }),
      // transitionDuration: "auto"
    });
  }, [props.lon, props.lat, props.zoom, props.markerLoc,diseaseName,props.disease]);

  function changeMap(nextViewport) {
    setViewport(nextViewport);
  }
  const data = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: [
        [-122.48369693756104, 37.83381888486939],
        [-122.48348236083984, 37.83317489144141],
        [-122.48339653015138, 37.83270036637107],
        [-122.48356819152832, 37.832056363179625],
        [-122.48404026031496, 37.83114119107971],
        [-122.48404026031496, 37.83049717427869],
        [-122.48348236083984, 37.829920943955045],
        [-122.48356819152832, 37.82954808664175],
        [-122.48507022857666, 37.82944639795659],
        [-122.48610019683838, 37.82880236636284],
        [-122.48695850372314, 37.82931081282506],
        [-122.48700141906738, 37.83080223556934],
        [-122.48751640319824, 37.83168351665737],
        [-122.48803138732912, 37.832158048267786],
        [-122.48888969421387, 37.83297152392784],
        [-122.48987674713133, 37.83263257682617],
        [-122.49043464660643, 37.832937629287755],
        [-122.49125003814696, 37.832429207817725],
        [-122.49163627624512, 37.832564787218985],
        [-122.49223709106445, 37.83337825839438],
        [-122.49378204345702, 37.83368330777276]
      ]
    }
  };
  

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
                      {selected.morbidityCount === ""
                        ? 0
                        : selected.morbidityCount}{" "}
                    </p>
                    <p className="m-0">Confrimed</p>
                  </div>
                  <div className="d-row recovery mx-2">
                   
                    <p className="m-0">
                      {selected.curedCount === "" ? 0 : selected.curedCount}
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

      {/* <ReactMapGL
        mapboxApiAccessToken={TOKEN}
        mapStyle={"mapbox://styles/mapbox/light-v10"}
        {...viewport}
        onViewportChange={changeMap}
      >
      
      </ReactMapGL>  */}
    </div>
  );
}

export default Map;

// {/* {locationArray.map((dis, index) => (
//           // console.log(dis.location[1], dis.location[0])

//           <Marker
//             key={index}
//             latitude={dis.location[1]}
//             longitude={dis.location[0]}
//           >
//             <div className="marker">
//               {" "}
//               <button
//                 className="marker-btn"
//                 onClick={e => {
//                   e.preventDefault();
//                   setSelected(dis);
//                 }}
//               >
//                 <RoomIcon
//                   color="primary"
//                   style={{ fontSize: 40, color: "green" }}
//                 />{" "}
//               </button>
//             </div>
//           </Marker>
//         ))} */}


