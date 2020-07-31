import React, { useState, useEffect } from "react";
// import CancelIcon from '@material-ui/icons/Cancel';
// import SearchIcon from "@material-ui/icons/Search";
// import FilterListIcon from "@material-ui/icons/FilterList";
import DiseaseName from "../service/util";
import axios from "axios";

function DiseaseSearchBAr(props) {
  const [showList, setShowList] = useState(false);
  const [search, setSearch] = useState("");

  const [DiseaseArray, setDiseaseArray] = useState([]);

  //const DiseaseArray = ["malaria", "coroan", "fue", "fever"];

  const proxyurl = "https://cors-anywhere.herokuapp.com/";
  const url =
    "https://sih-drs-prototype-backend-2.herokuapp.com/api/outrages/diseases/all";
  useEffect(() => {
    console.log("asdsadasdadassdas");
    try {
      axios.get(proxyurl + url).then(res => {
        console.log(res.data);
        setDiseaseArray(res.data);
      });
    } catch (e) {
      console.log(e);
    }
    // fetch(proxyurl + url)
    //   .then(response => response.json())
    //   .then(response => {
    //     setDiseaseArray(response);
    //     console.log(response);
    //   })
    //   .catch(error => {
    //     console.log(error.name);
    //   });
  }, []);

  // function getDisease

  function inputHandler() {}

  function inputOnChange(event) {
    const { value } = event.target;

    value === "" ? setShowList(false) : setShowList(true);

    setSearch(value);
  }

  async function ListHandler(item) {
    setSearch(item);
    const save = await DiseaseName.setDisease(item);
    props.getName(item);
    setShowList(false);
  }

  // async function SubmitHandler() {
  //   // const save = await DiseaseName.setDisease(search);
  //   // props.getName(search);
  // }

  function DisplayList(item, index) {
    return (
      // <div className="disease-list">
      <div className="results" key={index}>
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
              placeholder="Enter Disease Name"
              onClick={inputHandler}
              onChange={inputOnChange}
              value={search}
              autoComplete="off"
            />
          </div>
        </div>
        <div className="col-md-2 mt-4 pr-0 ml-0">
          {/* <button
            className="btn btn-primary  sear-btn ml-0"
            onClick={SubmitHandler}
          >
            {" "}
            <SearchIcon />{" "}
          </button>{" "} */}
        </div>
      </div>

      <div className="search-wrappe">
        {/* <input
          type="text"
          name="focus"
          required
          className="search-box"
          placeholder="Enter search term"
          onClick={inputHandler}
          onChange={inputOnChange}
          value={search}
        />
        <button className="close-icon" type="reset" /> */}

        {/* <button
          className="btn btn-info ml-2"
          type="button"
          id="dropdownMenuButton"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          <FilterListIcon />{" "}
        </button>
        <div className="dropdown-menu p-3" aria-labelledby="dropdownMenuButton">
          <p className="m-0">Start Date </p>
          <input type="date" className="form-control" />
          <p className="m-0">End Date </p>
          <input type="date" className="form-control" />
        </div> */}
        {/* </form> */}
      </div>
      <div className="w-75 m-auto shadow">
        {showList &&
          DiseaseArray.filter(
            vaule => vaule.toLowerCase().indexOf(search.toLowerCase()) > -1
          ).map(DisplayList)}
      </div>
    </div>
  );
}

export default DiseaseSearchBAr;
