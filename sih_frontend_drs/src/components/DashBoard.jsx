import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";
import DashBoardTable from "./DashBoardTable";
// import DiseaseName from "./StartFile";
import Map from "./MapBox";
import Trail from "./Trail";
function DashBoard(props) {
  // const disName = useContext(DiseaseName);

  const [lat, setLat] = useState(9);
  const [lon, setLon] = useState(78);
  const [zoom, setZoom] = useState(5);
  const [disease, setDisease] = useState("");
  // const [disease, setDisease] = useState(props.DiseaseName);

  useEffect(() => {
    console.log("dahboaerd");
  }, []);

  function getDetail(input, zooml) {
    // console.log("getlocation" + input[0]);
    setLon(input[0]);
    setLat(input[1]);
    console.log(zooml);
    setZoom(zooml);
    //   setLocation(input);
    // setRender(true);
    // console.log(lat);
  }

  function getDisease(input) {
    setDisease(input);
  }

  return (
    <div>
      {/* DiseaseName={props.diseaseName} */}

      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12 m-0 p-0">
            <NavBar />
          </div>
        </div>
      </div>

      <div className="container-fluid">
        <div className="row">
          <div className="col-md-6 p-2 shadow left-side mb-3">
            <DashBoardTable getDisease={getDisease} getDetail={getDetail} />
          </div>
          <div className="col-md-6 shadow p-0 m-0">
            {/* lon={lon} lan={lan}   lat={lat}*/}
            <Map disease={disease} zoom={zoom} lon={lon} lat={lat} />
          </div>
          {/* <Trail key={"231"} lat={lat} data={location} /> */}
        </div>
      </div>
    </div>
  );
}

export default DashBoard;
