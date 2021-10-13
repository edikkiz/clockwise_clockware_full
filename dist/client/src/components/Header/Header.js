"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var react_1 = __importDefault(require("react"));
require("./Header_module.css");
var logo_png_1 = __importDefault(require("./logo.png"));
var react_router_dom_1 = require("react-router-dom");
var Header = function () {
    return (<div className="wrapper_header">
      <header>
        <div className="header__topline">
          <div className="menu">
            <div className="menu__logo-img">
              <react_router_dom_1.Link to='/'><img src={logo_png_1["default"]} alt={'logo'}></img></react_router_dom_1.Link>
            </div>
            <div className="menu__link">
              <react_router_dom_1.Link to="/" className="menu_link">
                Order{' '}
              </react_router_dom_1.Link>
              <react_router_dom_1.Link to="/login" className="menu_link"> login </react_router_dom_1.Link>
            </div>
          </div>
        </div>
      </header>
    </div>);
};
exports["default"] = Header;
//# sourceMappingURL=Header.js.map