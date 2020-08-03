import React, { useEffect , useState } from "react";
import { useLocation } from 'react-router-dom'

import $ from "jquery";
import Authentication from "../service/auth";
import LoginHelp from "../service/loginHelp";
import { useHistory } from "react-router-dom";
// import LoginHelp from "../service/loginHelp";
import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  Route,
  Link
} from "react-router-dom";
function NavBar() {
  useEffect(() => {
    navBar();
  }, []);

  const history = useHistory();
  let location = useLocation();
  const officalToken = Authentication.getToken();


  function Logout(){
    Authentication.setToken("");
    LoginHelp.setLogin(false);
    history.push("/");
  }

  
  const [isLogin, setIsLogin] = useState(LoginHelp.getLogin());


  function navBar() {

    
console.log(location.pathname);
    function test() {
      var tabsNewAnim = $("#navbarSupportedContent");
      var selectorNewAnim = $("#navbarSupportedContent").find("li").length;
      var activeItemNewAnim = tabsNewAnim.find(".active");
      var activeWidthNewAnimHeight = activeItemNewAnim.innerHeight();
      var activeWidthNewAnimWidth = activeItemNewAnim.innerWidth();
      var itemPosNewAnimTop = activeItemNewAnim.position();
      var itemPosNewAnimLeft = activeItemNewAnim.position();
      $(".hori-selector").css({
        top: itemPosNewAnimTop.top + "px",
        left: itemPosNewAnimLeft.left + "px",
        height: activeWidthNewAnimHeight + "px",
        width: activeWidthNewAnimWidth + "px"
      });
      $("#navbarSupportedContent").on("click", "li", function(e) {
        $("#navbarSupportedContent ul li").removeClass("active");
        $(this).addClass("active");
        var activeWidthNewAnimHeight = $(this).innerHeight();
        var activeWidthNewAnimWidth = $(this).innerWidth();
        var itemPosNewAnimTop = $(this).position();
        var itemPosNewAnimLeft = $(this).position();
        $(".hori-selector").css({
          top: itemPosNewAnimTop.top + "px",
          left: itemPosNewAnimLeft.left + "px",
          height: activeWidthNewAnimHeight + "px",
          width: activeWidthNewAnimWidth + "px"
        });
      });
    }
    test();
    $(document).ready(function() {
      setTimeout(function() {
        test();
      });
    });
    $(window).on("resize", function() {
      setTimeout(function() {
        test();
      }, 500);
    });
    $(".navbar-toggler").click(function() {
      setTimeout(function() {
        test();
      });
    });
  }

  return (
    <div className="p-0 m-0 shadow">
      <nav className="navbar navbar-expand-lg  navbar-mainbg">
        <a className="navbar-brand navbar-logo" href="/as">
          Bware Co
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <i className="fas fa-bars text-white" />
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ml-auto">
            <div className="hori-selector">
              <div className="left" />
              <div className="right" />
            </div>
            {/* <li class="nav-item">
              <a class="nav-link" href="/as">
                <i class="fas fa-tachometer-alt" />
                Dashboard
              </a>
            </li> */}
            <li className={location.pathname === '/' ? "nav-item active" : "nav-item " }>
              {/* <a class="nav-link" href="/"> */}
              <Link className="nav-link" to="/">
                <i className="far fa-address-book" />
                Home
              </Link>
              {/* </a> */}
            </li>
            <li className={location.pathname === '/outrage' || location.pathname === '/login' ? "nav-item active" : "nav-item " } >
              {/* <a class="nav-link" href="/outrage"> */}
              <Link className="nav-link" to="/outrage">
                <i className="far fa-clone" />
                Outrage
              </Link>
              {/* </a> */}
            </li>
            <li className={location.pathname === '/symptoms' ? "nav-item active" : "nav-item " } >
              {/* <a class="nav-link" href="/outrage"> */}
              <Link className="nav-link" to="/symptoms">
                <i className="far fa-clone" />
                About Disease
              </Link>
              {/* </a> */}
            </li>
            <li className="nav-item">
              {/* <a class="nav-link" href="/outrage"> */}
              {isLogin && <a className="nav-link" href="#" onClick={Logout}>
                <i className="far fa-clone" />
                LogOut
              </a>}
              
              {/* </a> */}
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default NavBar;

{
  /* <nav className="menu">
<h1 className="menu__logo">Bware Co.</h1>
<div className="menu__right">
  <ul className="menu__list">
    <li className="menu__list-item">
      <Link className="menu__link" to="/">
        Home
      </Link>
    </li>
    <li className="menu__list-item">
      <Link className="menu__link" to="/outrage">
        Add Outrage
      </Link>
    </li>
  </ul>
</div>
</nav> */
}
