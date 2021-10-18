"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var react_1 = __importDefault(require("react"));
require("./admin_header_module.css");
var logo_png_1 = __importDefault(require("./logo.png"));
var react_router_dom_1 = require("react-router-dom");
var react_router_dom_2 = require("react-router-dom");
var AdminHeader = function () {
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
              <react_router_dom_1.Link to="/admin/masters" className="menu_link">
                Masters{' '}
              </react_router_dom_1.Link>
              <react_router_dom_1.Link to="/admin/orders" className="menu_link">
                Orders{' '}
              </react_router_dom_1.Link>
              <react_router_dom_1.Link to="/admin/users" className="menu_link"> Users</react_router_dom_1.Link>
              <react_router_dom_1.Link to="/admin/cities" className="menu_link"> Cities</react_router_dom_1.Link>
              <button className="menu_link" onClick={logOut}>Log out</button>
            </div>
          </div>
        </div>
      </header>
    </div>);
};
exports["default"] = AdminHeader;
//# sourceMappingURL=AdminHeader.js.map