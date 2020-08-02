import React, { useState } from "react";
import axios from "axios";

function AutoComplete(props) {
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState([]);
  const [location, setLocation] = useState({ place: "", location: [] });

  function handleSearchChange(event) {
    const { value, name } = event.target;
    setIsLoading(true);
    // console.log(value);

    setSearch(value);

    //  clearTimeout(timeoutId);

    // Launch a new request in 1000ms
    const timeoutId = setTimeout(() => {
      performSearch();
    }, 1000);
  }

  function performSearch() {
    if (search === "") {
      setIsLoading(false);
      setResult([]);
      // this.setState({
      //   results: [],
      //   isLoading: false
      // });
      // return;
      return;
    }
    axios
      .get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${search}.json?access_token=${"pk.eyJ1IjoibWMxMDBzIiwiYSI6ImNqb2E2ZTF3ODBxa3czd2xldHp1Z2FxbGYifQ.U4oatm5RsTXXHQLz5w66dQ"}`
      )
      .then(response => {
        setResult(response.data.features);
        setIsLoading(false);
        // this.setState({
        //   results: response.data.features,
        //   isLoading: false
        // });
      });
  }

  function handleItemClicked(place) {
    console.log(place.geometry.coordinates);

    setSearch(place.place_name);
    setResult([]);
    setLocation({
      place: place.place_name,
      location: place.geometry.coordinates
    });

    props.getLocation({
      place: place.place_name,
      location: place.geometry.coordinates
    });
  }

  return (
    <div className="styled-input">
      <input
        className=""
        type="text"
        value={search}
        onChange={handleSearchChange}
        placeholder="Type an address"
      />
      <span />
      <ul className="AutocompletePlace-results">
        {result.map(place => (
          <li
            key={place.id}
            className="AutocompletePlace-items"
            onClick={() => handleItemClicked(place)}
          >
            {place.place_name}
          </li>
        ))}
        {/* {isLoading && <li className="AutocompletePlace-items">Loading...</li>} */}
      </ul>
    </div>
  );
}

export default AutoComplete;
