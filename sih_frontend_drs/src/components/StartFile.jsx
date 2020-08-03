import React, { useState, useEffect } from "react";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import DiseaseSearch from "./DiseaseSearch";
import DashBoard from "./DashBoard";
import OutragePage from "./OutragePage";
import ReportPage from "./ReportPage";
<<<<<<< HEAD
=======
import SymptomsPage from "./SymptomsPage";
>>>>>>> 48a60c4102f13fe2ac8838f56c44906d17ae4186
import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  Route,
  Link
} from "react-router-dom";

const auth = true;

export const Token = React.createContext();

export const DiseaseName = React.createContext();

function StartFile() {
  const [isLogIn, setIsLogin] = useState(false);

  const [token, setToken] = useState(null);

  const [boolDis, setBoolDis] = useState(false);

  const [diseaseName, getDiseaseName] = useState("");

  // useEffect(() => {
  //   // console.log(token);
  //   // console.log(diseaseName);
  // }, [token, diseaseName]);

  function setAuth(input) {
    setIsLogin(input);
  }

  return (
    <Router>
      {/* {isLogIn && <Redirect to="/disease" />}
      {!isLogIn && <Redirect to="/" />}
      {boolDis && <Redirect to="/dashboard" />} */}
      {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
      <Switch>
        {/* <Route path="/">
          <Token.Provider value={token}>
            <DiseaseSearch
              setBoolDis={setBoolDis}
              getDiseaseName={getDiseaseName}
            />
          </Token.Provider>
        </Route> */}
        <Route path="/outrage">
          <Token.Provider value={token}>
            <OutragePage />
          </Token.Provider>
        </Route>
        {/* diseaseName={diseaseName} */}
        <Route exact path="/">
          {/* <DiseaseName.Provider value={diseaseName}>
            
          </DiseaseName.Provider> */}
          <DashBoard />
        </Route>
        <Route path="/report/:state/:district/:disease">
          {/* <DiseaseName.Provider value={diseaseName}>
            
          </DiseaseName.Provider> */}
          <ReportPage />
        </Route>
        <Route path="/register">
          <RegisterPage fkey={auth} />
        </Route>
        <Route path="/login">
          <LoginPage setToken={setToken} isAuth={setAuth} />
        </Route>
<<<<<<< HEAD
=======
        <Route path="/symptoms">
          <SymptomsPage />
        </Route>
>>>>>>> 48a60c4102f13fe2ac8838f56c44906d17ae4186
      </Switch>
    </Router>
  );
}

export default StartFile;
