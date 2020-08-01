import React, { useState, useEffect, useContext } from "react";
import DiseaseName from "../service/util";
import axios from "axios";
import Table from "./Table";
import SearchBar from "./SearchBar";

function DashBoardTable(props) {
  const [statelevel, setStateLevel] = useState([]);
  const [disease, setDisease] = useState(DiseaseName.getDisease());
  const [isLoad, SetIsLoad] = useState(true);
  const [totalCount, setTotalCount] = useState({
    active: 0,
    confrim: 0,
    recovery: 0,
    death: 0
  });
  const [city, setCity] = useState("India"); // const [isLoad, setIsLoad] = useState(true);
  var todayDate = new Date().toISOString().slice(0, 10);
  useEffect(() => {
    const Pproxyurl = "https://cors-anywhere.herokuapp.com/";
    const Countryurl =
      "https://sih-drs-prototype-backend-2.herokuapp.com/api/outrages/getDetails/country/" +
      disease +
      "/2020-02-20/"+todayDate;

    if (disease !== "") {
      try {
        axios.get(Pproxyurl + Countryurl).then(res => {
          console.log(res.data);
          setTotalCount({
            active: res.data.activeCount,
            confrim: res.data.morbidityCount,
            recovery: res.data.curedCount,
            death: res.data.mortalityCount
          });
        });
      } catch (e) {
        console.log(e);
      }
    }

    // console.log(res.data);
  }, [disease]);

  function TatalCountOfDiseae() {}

  // DiseaseName.getDisease()

  function managestate(input) {
    SetIsLoad(true);
    setDisease(input);
    props.getDisease(input);
  }

  function getDetail(input, zooml) {
    props.getDetail(input, zooml);
  }
  var todayDate = new Date().toISOString().slice(0, 10);

  const proxyurl = "https://cors-anywhere.herokuapp.com/";
  const url =
    "https://sih-drs-prototype-backend-2.herokuapp.com/api/outrages/getDetails/states/" +
    DiseaseName.getDisease() +
    "/2020-02-20/" +
    todayDate;
  useEffect(() => {
    if (disease !== "") {
      fetch(proxyurl + url)
        .then(response => response.json())
        .then(response => {
          setStateLevel(response);
          console.log(response);
          SetIsLoad(false);
        })
        .catch(error => {
          console.log(error.name);
        });
    }
  }, [disease, url]);
  // disease, url]
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-12">
          <SearchBar getName={managestate} />
          {isLoad && (
            <div id="spinner" className="loader-container">
              <div className="loading" />
            </div>
          )}
          {!isLoad && (
            <div className="mb-4">
              <h1 className="text-center">{city} Level</h1>
              <div className="Level">
                <div
                  className="level-item is-confirmed fadeInUp"
                  style={{ animationDelay: "750ms" }}
                >
                  <h5>Confirmed</h5>
                  <h1>{totalCount.confrim}</h1>
                </div>
                <div
                  className="level-item is-active fadeInUp"
                  style={{ animationDelay: "750ms" }}
                >
                  <h5>Active</h5>
             
                  <h1>{(totalCount.confrim)-(totalCount.recovery)-(totalCount.death)}</h1>
                </div>
                <div
                  className="level-item is-recovered fadeInUp"
                  style={{ animationDelay: "750ms" }}
                >
                  <h5>Recovered</h5>
    
                  <h1>{totalCount.recovery}</h1>
                </div>
                <div
                  className="level-item is-deceased fadeInUp"
                  style={{ animationDelay: "750ms" }}
                >
                  <h5>Deceased</h5>

                  <h1>{totalCount.death}</h1>
                </div>
              </div>

              <h1 className="text-center" style={{ color: "#878ecd" }}>
                State Level
              </h1>

              <Table
                getTotalCount={setTotalCount}
                getDetail={getDetail}
                stateLevelDetail={statelevel}
                disease={disease}
                getCity={setCity}
              />
            </div>
          )}
          {/* getPosition={getLanLat} */}
        </div>
      </div>
    </div>
  );
}

export default DashBoardTable;
