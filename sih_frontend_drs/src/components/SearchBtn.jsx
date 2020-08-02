import React, { useState, useEffect } from "react";

function SearchBtn(props) {
  const [showList, setShowList] = useState(false);
  const [search, setSearch] = useState("");

  const [DiseaseArray, setDiseaseArray] = useState([]);

  //const DiseaseArray = ["malaria", "coroan", "fue", "fever"];

  const proxyurl = "https://cors-anywhere.herokuapp.com/";
  const url =
    "https://sih-drs-prototype-backend-2.herokuapp.com/api/outrages/diseases/all";
  useEffect(() => {
    fetch(proxyurl + url)
      .then(response => response.json())
      .then(response => {
        setDiseaseArray(response);
      })
      .catch(error => {
        console.log(error.name);
      });
  }, []);

  function inputHandler() {}

  function inputOnChange(event) {
    const { value } = event.target;

    value === "" ? setShowList(false) : setShowList(true);

    setSearch(value);
  }

  function ListHandler(item) {
    setSearch(item);
    setShowList(false);
  }

  function SubmitHandler() {
    props.getName(search);
  }

  function DisplayList(item, index) {
    return (
      <div
        className="disease-list"
        onClick={() => {
          ListHandler(item);
        }}
        key={index}
        value={item}
      >
        {" "}
        {item}{" "}
      </div>
    );
  }

  return (
    <div className="row my-3">
      <div className="col-md-12">
        <div className="wrap shadow">
          <div className="search">
            <input
              type="text"
              className="searchTerm"
              placeholder="What are you looking for?"
              onClick={inputHandler}
              onChange={inputOnChange}
              value={search}
            />
            <button onClick={SubmitHandler} className="searchButton">
              <i className="fa fa-search" />
            </button>
          </div>
          {/* { DiseaseArray.map(DisplayList)} */}
          {/* {showList &&
            DiseaseArray.map(DisplayList)} */}
          {showList &&
            DiseaseArray.filter(
              vaule => vaule.toLowerCase().indexOf(search.toLowerCase()) > -1
            ).map(DisplayList)}
        </div>
      </div>
    </div>
  );
}

export default SearchBtn;
