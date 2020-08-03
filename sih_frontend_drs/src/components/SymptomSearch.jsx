import React, { useState, useEffect } from "react";





import DiseaseName from "../service/util";
import axios from "axios";

function SymptomSearch(props) {
  const [showList, setShowList] = useState(false);
  const [search, setSearch] = useState("");

  const [symptomsArray, setSymptomsArray] = useState(['adsd','erf','malad','cough','head ache']);

  //const DiseaseArray = ["malaria", "coroan", "fue", "fever"];

  const proxyurl = "https://cors-anywhere.herokuapp.com/";
  const url =
    "https://sih-drs-prototype-backend-2.herokuapp.com/api/outrages/diseases/all";
  useEffect(() => {
    console.log("");
    try {
      axios.get(proxyurl + url).then(res => {
        console.log(res.data);
        setSymptomsArray(res.data);
       
      });
    } catch (e) {
      console.log(e);
    }
   
  }, []);

  function getRandom(arr, n) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}
  

  function inputHandler() {}

  function inputOnChange(event) {
    const { value } = event.target;

    value === "" ? setShowList(false) : setShowList(true);

    setSearch(value);
  }

  async function ListHandler(item) {
    setSearch(item);
    // props.setSimilarArray(getRandom(symptomsArray,6))
    // const save = await DiseaseName.setDisease(item);
    props.getName(item);
    setShowList(false);
  }

  

  function DisplayList(item, index) {
    return (
      // <div className="disease-list">
    
        <div
          className="result"
          onClick={() => {
            ListHandler(item);
          }}
          key={index}
          value={item}
        >
          {" "}
          {item}{" "}
        </div>
      // </div>
    );
  }

  return (
    <div>
      <div className="row">
        <div className="col-md-12 mr-0">
          <div
            style={{ animationDelay: "500ms" }}
            className="search-input-wrapper fadeInUp"
          >
            <input
              className="sea"
              type="text"
              placeholder="Enter Any Symptoms"
              onClick={inputHandler}
              onChange={inputOnChange}
              value={search}
              autoComplete="off"
            />
          </div>
        </div>
      </div>

      
      <div className="w-75 m-auto shadow">
        {showList &&
           (<div className="results" style={{maxHeight:"300px",overflow:'auto'}}>
          { symptomsArray.filter(
            vaule => vaule.toLowerCase().indexOf(search.toLowerCase()) > -1
          ).map(DisplayList)}
      </div>)
          }
      </div>
    </div>
  );
}

export default SymptomSearch;
