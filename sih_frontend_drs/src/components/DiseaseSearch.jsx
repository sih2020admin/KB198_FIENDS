import React, { useState } from "react";
import SearchBtn from "./SearchBtn";
import { BrowserRouter as Router, Redirect } from "react-router-dom";
function Diseaseearch(props) {
  const [disName, setDisName] = useState("");

  function searchDetail(name) {
    setDisName(name);
    // console.log(name);
    props.setBoolDis(true);
    props.getDiseaseName(name);
    // props.getName(name);
  }

  return (
    <div className="App">
      <div className="disease-page-top d-flex justify-content-between">
        <h4 className="d-row"> Bware Team </h4>
        <h5 className="d-row"> i </h5>
      </div>

      <div className="banner-img d-flex justify-content-center mt-0">
        <img
          className="img-fluid d-row "
          alt="Banner"
          src="https://www.vippng.com/png/detail/125-1256253_formal-report-writing-report-writing-png.png"
        />
      </div>
      <h2 className="p-3 text-center">
        {" "}
        Get Zoonatic Disease Assessment Report{" "}
      </h2>
      <div className="disease-search-btn" />
      <SearchBtn getName={searchDetail} />
    </div>
  );
}

export default Diseaseearch;
