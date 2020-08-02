import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Token } from "./StartFile";

function RegisterPage(props) {
  const value = useContext(Token);

  // useEffect(() => {
  //   // console.log(props.fkey);
  //   console.log("My I am " + value);
  // }, []);

  const [registerDetails, setregisterDetails] = useState({
    email: "",
    password: "",
    name: "",
    state: "",
    district: "",
    role: ""
  });

  const [stateName, setStateName] = useState("");

  const [districtArray, setDistrictArray] = useState([]);

  const [stateArray, setStateArray] = useState([]);

  const proxyurl = "https://cors-anywhere.herokuapp.com/";
  const url =
    "https://sih-drs-prototype-backend-2.herokuapp.com/api/getLocationDetails/states";
  useEffect(() => {
    fetch(proxyurl + url)
      .then(response => response.json())
      .then(response => {
        setStateArray(response);
      })
      .catch(error => {
        console.log(error.name);
      });
  }, []);
  decodeURI(stateName);
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

  function optionList(name, index) {
    return (
      <option value={name} key={index}>
        {" "}
        {name}{" "}
      </option>
    );
  }

  function handleChange(event) {
    const { name, value } = event.target;

    if (name === "state") {
      setStateName(value);
      console.log("statechange" + value);
    }

    setregisterDetails(prevData => {
      return {
        ...prevData,
        [name]: value
      };
    });
  }

  async function submitHandler(event) {
    // console.log(registerDetails);
    try {
      const response = await axios.post(
        proxyurl +
          "https://sih-drs-prototype-backend-2.herokuapp.com/api/outrages/register/",
        registerDetails
      );
      console.log(registerDetails);
      console.log("👉 Returned data:", response);
    } catch (e) {
      console.log(`😱 Axios request failed: ${e}`);
    }
  }

  return (
    <div className="container">
      <div class="container login-container">
        <div class="myCard">
          <div class="row">
            <div class="col-md-6">
              <div class="myLeftCtn">
                <div class="myForm text-center needs-validation">
                  <header>Create new account</header>
                  <div class="form-group">
                    <i class="fas fa-user" />
                    <input
                      name="name"
                      class="myInput"
                      type="text"
                      placeholder="Name"
                      onChange={handleChange}
                    />
                    <div class="invalid-feedback">
                      Please fill out this field.
                    </div>
                  </div>

                  <div class="form-group">
                    <i class="fas fa-envelope" />
                    <input
                      class="myInput"
                      placeholder="Email"
                      name="email"
                      type="text"
                      onChange={handleChange}
                      required
                    />
                    <div class="invalid-feedback">
                      Please fill out this field.
                    </div>
                  </div>

                  <div class="form-group">
                    <i class="fas fa-lock" />
                    <input
                      class="myInput"
                      type="password"
                      name="password"
                      placeholder="Password"
                      onChange={handleChange}
                      required
                    />

                    <div class="invalid-feedback">
                      Please fill out this field.
                    </div>
                  </div>

                  <div className="form-group ">
                    <i class="fas fa-lock" />
                    <select
                      onChange={handleChange}
                      name="state"
                      className="myInput"
                    >
                      <option>Select the State </option>
                      {stateArray.map(optionList)}
                    </select>
                  </div>

                  <div className="form-group ">
                    <i class="fas fa-lock" />
                    <select
                      onChange={handleChange}
                      name="district"
                      className="myInput"
                    >
                      {districtArray.map(optionList)}
                    </select>
                  </div>
                  <div class="form-group">
                    <i class="fas fa-user" />
                    <input
                      name="role"
                      type="text"
                      onChange={handleChange}
                      id="form-password"
                      placeholder="Role"
                      className="myInput"
                    />
                    <div class="invalid-feedback">
                      Please fill out this field.
                    </div>
                  </div>

                  <input
                    type="submit"
                    onClick={submitHandler}
                    class="butt"
                    value="Register"
                  />
                </div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="myRightCtn">
                <div class="box">
                  <header>Hello World!</header>

                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam.
                  </p>
                  <input type="button" class="butt_out" value="Learn More" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;

// <div className="row ">
// <div className="col-md-12 d-flex justify-content-center">
//   <div className="login-container">
//     <h2 id="title">Register</h2>
//     <div className="items">
//       <input
//         name="name"
//         type="text"
//         id="form-text"
//         placeholder="Name"
//         onChange={handleChange}
//       />

//       <div className="items">
//         <input
//           name="email"
//           type="email"
//           id="form-text"
//           placeholder="email"
//           onChange={handleChange}
//         />
//         <input
//           name="password"
//           type="password"
//           onChange={handleChange}
//           id="form-password"
//           placeholder="Password"
//         />
//         <select
//           onChange={handleChange}
//           name="state"
//           className="selectbox form-control"
//         >
//           <option>Select the State </option>
//           {stateArray.map(optionList)}
//         </select>
//         <select
//           onChange={handleChange}
//           name="district"
//           className="selectbox"
//         >
//           {districtArray.map(optionList)}
//         </select>

//         <input
//           name="role"
//           type="text"
//           onChange={handleChange}
//           id="form-password"
//           placeholder="Role"
//         />

//         <button onClick={submitHandler}>Sign Up</button>
//         <a id="sign" type="submit" href="/">
//           Sign IN
//         </a>
//       </div>
//     </div>
//   </div>
// </div>
// </div>
