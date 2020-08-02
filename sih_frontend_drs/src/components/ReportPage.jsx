import React, { useEffect, useState } from "react";
// import { Line } from "react-chartjs-2";
import reportHelp from "../service/reportHelp";
import axios from "axios";
import Chart from "./Chart";
// import NavBAr from "./NavBar";
// import PieChart from "./PieChart";
import { useParams, Route } from "react-router-dom";
import DiseaseReport from "./DiseaseReport";

const ans=0;
const expo=0;

function ReportPage(props) {
  var todayDate = new Date().toISOString().slice(0, 10);
  const [stateArray, setStateArray] = useState([]);
  const [morbi, setMorbi] = useState({});
  const [moti, setMoti] = useState({});
  const [cured, setCured] = useState({});
  const [active, setActive] = useState({});
  const [morbiCount, setMorbiCount] = useState("");
  const [motiCount, setMotiCount] = useState("");
  const [curedCount, setCuredCount] = useState("");
  const [activeCount, setActiveCount] = useState("");
  const [population, setPopulation] = useState("");
  const [id, setId] = useState(reportHelp.getId());
  const [isLoad, setLoad] = useState(false);
  const [endDate, setEndDate] = useState(todayDate);
  const [startDate, setStartDate] = useState("2020-03-14");

  const { state, district, disease } = useParams();

  const [navState, setnavState] = useState(state);
  const [navDistrict, setnavDistrict] = useState(district);
  const [navDisease, setnavDisease] = useState(disease);

  const [stateName, setStateName] = useState("");
  const [districtArray, setDistrictArray] = useState([]);
  const [DiseaseArray, setDiseaseArray] = useState([]);

  // const [desc ,setDesc] = useState("")
  // const [guide ,setGuide] = useState("")

  const [diseaseDetail ,  setDiseaseDetail] = useState({});



  useEffect(() => {
    console.log(state, district, disease);
  }, []);

  const proxyurl = "https://cors-anywhere.herokuapp.com/";

  useEffect(()=>{
    const DDurl =
    "https://sih-drs-prototype-backend-2.herokuapp.com/api/outrages/getDetails/"+navDisease;
 
    fetch(proxyurl + DDurl)
      .then(response => response.json())
      .then(response => {
        console.log(response)
        setDiseaseDetail(response);
      })
      .catch(error => {
        console.log(error.name);
      });
  }, [navDisease]);
  

  const Surl =
    "https://sih-drs-prototype-backend-2.herokuapp.com/api/getLocationDetails/states";
  useEffect(() => {
    fetch(proxyurl + Surl)
      .then(response => response.json())
      .then(response => {
        setStateArray(response);
      })
      .catch(error => {
        console.log(error.name);
      });
  }, []);

  const Durl =
    "https://sih-drs-prototype-backend-2.herokuapp.com/api/outrages/diseases/all";
  useEffect(() => {
    try {
      axios.get(proxyurl + Durl).then(res => {
        console.log(res.data);
        setDiseaseArray(res.data);
      });
    } catch (e) {
      console.log(e);
    }
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    if (name === "state") {
      setnavState(value);
      setStateName(value);
      setnavDistrict("all");
    }
    if (name === "district") {
      if (value === "none") {
        setnavDistrict("all");
      } else {
        setnavDistrict(value);
      }
    }
    if (name === "disease") {
      setnavDisease(value);
    }
  }

//  async function calcCount(count,info){
//     const i=0;
//    while(count<1){
//       count=count*10;
//       i++;
//     }
    
//   //  ans=count;
//   //  expo=i;
//    return "<p>"+i+"/"+Math.pow(count,i)+"have"+info+". </p>"
//   }

  const districturl =
    "https://sih-drs-prototype-backend-2.herokuapp.com/api/getLocationDetails/" +
    decodeURI(stateName) +
    "/districts";
  useEffect(() => {
    fetch(proxyurl + districturl)
      .then(response => response.json())
      .then(response => {
        setDistrictArray(response);
      })
      .catch(error => {
        console.log(error.name);
      });
  }, [stateName, districturl]);

  useEffect(() => {
    if (navDistrict === "all") {
      const url =
        "https://sih-drs-prototype-backend-2.herokuapp.com/api/report/getDetails/" +
        encodeURI(navState) +
        "/" +
        encodeURI(navDisease) +
        "/" +
        startDate +
        "/" +
        endDate;
      console.log(url);
      axios.get(proxyurl + url).then(res => {
        // setDiseaseDetail(res.data);
        setMorbi(res.data.dailyMorbidityObj);
        setMoti(res.data.dailyMortalityObj);
        setCured(res.data.dailyCuredObj);
        setActive(res.data.dailyActiveObj);
        setMorbiCount(res.data.morbidityCount);
        setMotiCount(res.data.mortalityCount);
        setCuredCount(res.data.curedCount);
        setActiveCount(res.data.activeCount);
        setPopulation(res.data.population);
        setLoad(true);
      });
    } else {
      const url =
        "https://sih-drs-prototype-backend-2.herokuapp.com/api/report/getDetails/" +
        encodeURI(navState) +
        "/" +
        encodeURI(navDistrict) +
        "/" +
        encodeURI(navDisease) +
        "/" +
        startDate +
        "/" +
        endDate;
      console.log(url);
      axios.get(proxyurl + url).then(res => {
        console.log(res.data);

        setMorbi(res.data.dailyMorbidityObj);
        setMoti(res.data.dailyMortalityObj);
        setCured(res.data.dailyCuredObj);
        setActive(res.data.dailyActiveObj);
        setMorbiCount(res.data.morbidityCount);
        setMotiCount(res.data.mortalityCount);
        setCuredCount(res.data.curedCount);
        setActiveCount(res.data.activeCount);
        setPopulation(res.data.population);
        setLoad(true);
      });
    }

    // console.log(l);
  }, [navDisease, navState, navDistrict, endDate, startDate]);

  function optionList(name, index) {
    return (
      <option value={name} key={index}>
        {" "}
        {name}{" "}
      </option>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row my-3">
      
        <div className="col-md-8 m-0">
          <div className="card shadow m-0">
            <div className="card-body">
              <h1 className="text-center">{disease} Report</h1>
              <nav class="navbar navbar-expand-lg navbar-light bg-light">
                <button
                  class="navbar-toggler"
                  type="button"
                  data-toggle="collapse"
                  data-target="#navbarNavDropdown"
                  aria-controls="navbarNavDropdown"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  <span class="navbar-toggler-icon" />
                </button>
                <div class="collapse navbar-collapse" id="navbarNavDropdown">
                  <ul class="navbar-nav  ml-auto">
                    <li class="nav-item mx-2">
                      <select
                        onChange={event => handleChange(event)}
                        name="disease"
                        className="form-control"
                      >
                        <option>Select the Disease </option>
                        {DiseaseArray.map(optionList)}
                      </select>
                    </li>
                    <li class="nav-item mx-2">
                      <select
                        onChange={event => handleChange(event)}
                        name="state"
                        className="form-control"
                      >
                        <option>Select the State </option>
                        {stateArray.map(optionList)}
                      </select>
                    </li>
                    <li class="nav-item mx-2">
                      <select
                        onChange={event => handleChange(event)}
                        name="district"
                        className="form-control"
                      >
                        <option>Select the District </option>
                        {districtArray.map(optionList)}
                        <option value={"none"}>None</option>
                      </select>
                    </li>
                    <li class="nav-item dropdown">
                      <div
                        class="nav-link dropdown-toggle"
                        id="navbarDropdownMenuLink"
                        role="button"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        Date
                      </div>
                      <div
                        class="dropdown-menu"
                        aria-labelledby="navbarDropdownMenuLink"
                      >
                        <div
                          className="dropdown-item p-3"
                          aria-labelledby="dropdownMenuButton"
                        >
                          <p className="m-0">Start Date </p>
                          <input
                            onChange={event => {
                              setStartDate(event.target.value);
                            }}
                            type="date"
                            className="form-control"
                          />
                          <p className="m-0">End Date </p>
                          <input
                            type="date"
                            onChange={event => {
                              setEndDate(event.target.value);
                            }}
                            className="form-control"
                          />
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </nav>

              <div class="Level">
                <div
                  class="level-item is-confirmed fadeInUp"
                  style={{ animationDelay: "750ms" }}
                >
                  <h5>Confirmed</h5>

                  <h1>{morbiCount}</h1>
                </div>
                <div
                  class="level-item is-active fadeInUp"
                  style={{ animationDelay: "750ms" }}
                >
                  <h5>Active</h5>

                  <h1>{activeCount}</h1>
                </div>
                <div
                  class="level-item is-recovered fadeInUp"
                  style={{ animationDelay: "750ms" }}
                >
                  <h5>Recovered</h5>

                  <h1>{curedCount}</h1>
                </div>
                <div
                  class="level-item is-deceased fadeInUp"
                  style={{ animationDelay: "750ms" }}
                >
                  <h5>Deceased</h5>

                  <h1>{motiCount}</h1>
                </div>
              </div>

              <div className="row">
                <div className="col-md-12 ">
                  <h1 className="text-center">Active Count</h1>
                  <div className="card shadow ">
                    <div
                      className="card-body"
                      style={{ backgroundColor: "#DFEEFF" }}
                    >
                      {isLoad && (
                        <Chart
                          labelColor={"#017CFF"}
                          data={active}
                          color={["rgba(27, 156, 252,1.0)"]}
                          title={"Active Count"}
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-md-12 ">
                  <h1 className="text-center">Mortality Count</h1>
                  <div className="card shadow">
                    <div
                      className="card-body"
                      style={{ backgroundColor: "#FFE0E6" }}
                    >
                      {isLoad && (
                        <Chart
                          labelColor={"#FF093C"}
                          data={moti}
                          color={[" rgba(255, 7, 58, 0.3)"]}
                          title={"Mortality Count"}
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-md-12 ">
                  <h1 className="text-center">Cured Count</h1>
                  <div className="card shadow">
                    <div
                      className="card-body"
                      style={{ backgroundColor: "#A9DBB5" }}
                    >
                      {isLoad && (
                        <Chart
                          labelColor={"#36AC51"}
                          data={cured}
                          color={["rgba(42,167,71,0.8)"]}
                          title={"Cured Count"}
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-md-12 ">
                  <h1 className="text-center">Morbidity Count</h1>
                  <div className="card shadow">
                    <div
                      className="card-body bg-dark"
                      style={{ color: "#fff" }}
                    >
                      {isLoad && (
                        <Chart
                          labelColor={"#FF093C"}
                          data={morbi}
                          color={["rgba(255, 99, 132, 0.6)"]}
                          title={"Morbidity Count"}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card shadow mt-3">
            <div className="card-body">
              <div class="StateMeta">
                <div class="meta-item confirmed cc_cursor">
                  <div class="meta-item-top">
                    <h3>Confirmed Per Million</h3>
                  </div>
                  <h1>{((morbiCount / population) * 100000).toFixed(2)} % </h1>

                  <h5>India has 1,114.74 CPM</h5>
                  <p>
                    ~2,916 out of every 1 million people in Tamil Nadu have
                    tested positive for the virus.
                  </p>
                </div>
                <div class="meta-item active">
                  <div class="meta-item-top">
                    <h3>Active Ratio</h3>
                  </div>
                  <h1>{((activeCount / morbiCount) * 100).toFixed(2)} %</h1>

                  <p>
                    For every 100 confirmed cases, ~25 are currently infected.
                  </p>
                </div>
                <div class="meta-item recovery">
                  <div class="meta-item-top">
                    <h3>Recovery Ratio</h3>
                  </div>
                  <h1>{((curedCount / morbiCount) * 100).toFixed(2)} %</h1>

                  <p>
                    For every 100 confirmed cases, ~74 have recovered from the
                    virus.
                  </p>
                </div>
                <div class="meta-item mortality">
                  <div class="meta-item-top">
                    <h3>Case Fatality Ratio</h3>
                  </div>
                  <h1>{((motiCount / morbiCount) * 100).toFixed(2)} %</h1>

                  <p>
                    For every 100 confirmed cases, ~2 have unfortunately passed
                    away from the virus.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4" >
           {isLoad && <DiseaseReport setDisease={navDisease} setdiseaseDetail={diseaseDetail}/>}   
        </div>
      </div>

    </div>
  );
}

export default ReportPage;
