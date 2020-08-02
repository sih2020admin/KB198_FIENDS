import React, { useState } from "react";
import { Link } from "react-router-dom";
import Authentication from "../service/auth";
import LoginHelp from "../service/loginHelp";
import NavBar from "./NavBar";
import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  Route
} from "react-router-dom";

import axios from "axios";

function LoginPage(props) {
  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: ""
  });

  const [isLogin, setIsLogin] = useState(false);

  const [error, setError] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setLoginDetails(prevData => {
      return {
        ...prevData,
        [name]: value
      };
    });
  }
  const proxyurl = "https://cors-anywhere.herokuapp.com/";
  // const config = {
  //   withCredentials: true
  // };

  async function submitHandler() {
    try {
      console.log("loading")
      const response = await axios.post(
        proxyurl +
          "https://sih-drs-prototype-backend-2.herokuapp.com/api/outrages/login/",
        loginDetails
        // { withCredentials: true }
      );

      // console.log("👉 Returned data:", response);
      const { data } = response;

      if (response.status === 200) {
        props.setToken(data["x-official-token"]);
        // props.setToken(data["x-official-token"]);

        Authentication.setToken(data["x-official-token"]);
        LoginHelp.setLogin(true);
        setIsLogin(true);
        props.isAuth(true);
      } else {
        setError(true);
      }
    } catch (e) {
      setError(true);
      console.log(`😱 Axios request failed: ${e}`);
    }
  }

  return (
    <div>
      <NavBar />
      <div className="container-fluid ">
        {isLogin && <Redirect to="/outrage" />}
        {error && (
          <div className="alert alert-danger" role="alert">
            Login Falied
          </div>
        )}

        <div className="container login-container mt-5">
          <div className="myCard">
            <div className="row">
              <div className="col-md-6">
                <div className="myLeftCtn">
                  <div className="myForm text-center needs-validation">
                    <header> Login </header>
                    {/* <div class="form-group">
                    <i class="fas fa-user" />
                    <input
                      class="myInput"
                      type="text"
                      placeholder="Username"
                      required
                    />
                    <div class="invalid-feedback">
                      Please fill out this field.
                    </div>
                  </div> */}

                    <div className="form-group">
                      <i className="fas fa-envelope" />
                      <input
                        className="myInput"
                        placeholder="Email"
                        name="email"
                        type="text"
                        onChange={handleChange}
                        required
                      />
                      <div className="invalid-feedback">
                        Please fill out this field.
                      </div>
                    </div>

                    <div className="form-group">
                      <i className="fas fa-lock" />
                      <input
                        className="myInput"
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        required
                      />
                      <div className="invalid-feedback">
                        Please fill out this field.
                      </div>
                    </div>

                    <input
                      type="submit"
                      onClick={submitHandler}
                      className="butt"
                      value="Log In"
                    />

                    <div className="form-group mt-4 w-100">
                      <Link className="butt w-100" to="/register">
                        {" "}
                        Sign Up{" "}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="myRightCtn">
                  <div className="box">
                    <header>Hello World!</header>

                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam.
                    </p>
                    <input type="button" className="butt_out" value="Learn More" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

//       <div className="row ">
//   <div className="col-md-12 d-flex justify-content-center">
//     <div className="login-container d-row">
//       <h2 id="title">Login</h2>

//       <div className="items">
//         <input
//           name="email"
//           type="text"
//           id="form-text"
//           placeholder="Username"
//           onChange={handleChange}
//         />
//         <input
//           name="password"
//           type="password"
//           onChange={handleChange}
//           id="form-password"
//           placeholder="Password"
//         />

//         <button className="link-btn" onClick={submitHandler} id="button">
//           Send
//         </button>
//         <Link className="link-btn" to="/register">
//           {" "}
//           Sign Up
//         </Link>
//       </div>
//     </div>
//   </div>
// </div>

// {/* <div class="container login-container">
//         <section class="form">
//           <div className="inside-form">
//             <h1>Sign In</h1>
//             <div class="form-group">
//               <label for="exampleInputEmail1" className="text-light">
//                 Email address
//               </label>
//               <input
//                 type="email"
//                 name="email"
//                 class="form-control"
//                 placeholder="Enter email"
//                 onChange={handleChange}
//               />
//               <small id="emailHelp" class="form-text text-muted">
//                 We'll never share your email with anyone else.
//               </small>
//             </div>
//             <div class="form-group">
//               <label for="exampleInputPassword1" className="text-light">
//                 Password
//               </label>
//               <input
//                 type="password"
//                 name="password"
//                 class="form-control"
//                 placeholder="Password"
//                 onChange={handleChange}
//               />
//             </div>

//             <button onClick={submitHandler} class="btn-submit">
//               Submit
//             </button>
//           </div>
//         </section>
//         <aside id="banner" />
//       </div> */}
