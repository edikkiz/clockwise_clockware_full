"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var react_1 = __importDefault(require("react"));
require("./modal.css");
var Modal = function (_a) {
    var active = _a.active, setActive = _a.setActive, children = _a.children;
    return (<div className={active ? "modal active" : "modal"} onClick={function () { return setActive(false); }}>
            <div className={active ? "modal__content active" : "modal__content"} onClick={function (e) { return e.stopPropagation(); }}>
                {children}
            </div>
        </div>);
};
exports["default"] = Modal;
//# sourceMappingURL=modal.js.map