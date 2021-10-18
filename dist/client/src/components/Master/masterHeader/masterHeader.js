"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var react_1 = __importDefault(require("react"));
var logo_png_1 = __importDefault(require("./logo.png"));
var react_router_dom_1 = require("react-router-dom");
var react_router_dom_2 = require("react-router-dom");
var MasterHeader = function () {
    var masterId = (0, react_router_dom_2.useParams)().id;
    var history = (0, react_router_dom_2.useHistory)();
    var logOut = function () {
        localStorage.removeItem('accessToken');
        history.push('/login');
    };
    return (<div className="wrapper_header">
      <header>
        <div className="header__topline">
          <div className="menu">
            <div className="menu__logo-img">
              <react_router_dom_1.Link to="/"> <img src={logo_png_1["default"]} alt={'logo'}></img> </react_router_dom_1.Link>
            </div>
            <div className="menu__link">
              <button className="menu_link" onClick={logOut}>Log out</button>
              <react_router_dom_1.Link className="menu_link" to={"/calendar/" + masterId}>Calendar</react_router_dom_1.Link>
            </div>
          </div>
        </div>
      </header>
    </div>);
};
exports["default"] = MasterHeader;
//# sourceMappingURL=masterHeader.js.map