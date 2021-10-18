"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var react_1 = __importStar(require("react"));
require("./all_controller_city_module.css");
var axios_1 = __importDefault(require("axios"));
var models_1 = require("../../../models/models");
var react_router_dom_1 = require("react-router-dom");
var react_hook_form_1 = require("react-hook-form");
var react_toast_notifications_1 = require("react-toast-notifications");
var AdminHeader_1 = __importDefault(require("../adminHeader/AdminHeader"));
var AllControllerCity = function () {
    var _a, _b, _c, _d;
    var _e = (0, react_hook_form_1.useForm)(), register = _e.register, handleSubmit = _e.handleSubmit, setValue = _e.setValue, errors = _e.formState.errors;
    var _f = (0, react_router_dom_1.useParams)(), updateId = _f.id, name = _f.name;
    var history = (0, react_router_dom_1.useHistory)();
    var addToast = (0, react_toast_notifications_1.useToasts)().addToast;
    var whatControllerUse = function (data) {
        !updateId ? addCity(data) : updateCity(data);
    };
    (0, react_1.useEffect)(function () {
        if (name) {
            setValue("name", name);
        }
    }, []);
    var addCity = function (data) {
        axios_1["default"]
            .post("/admin/city", {
            name: data.name
        })
            .then(function () {
            addToast('city created', { appearance: 'success' });
            history.push("/admin/cities");
        });
    };
    var updateCity = function (data) {
        axios_1["default"]
            .put("/admin/city", {
            id: +updateId,
            name: data.name
        })
            .then(function () {
            addToast('city updated', { appearance: 'success' });
            history.push("/admin/cities");
        });
    };
    return (<>
      <AdminHeader_1["default"] />
      <div className="wrapper_controller-city">
        <form className="wrapper_controller-city__form" onSubmit={handleSubmit(whatControllerUse)}>
          <input placeholder="Enter city name" className="wrapper_controller-city__form__input" {...register("name", { required: true, minLength: 3, maxLength: 50, pattern: /[A-Za-zА-Яа-я]/ })}/>
          {((_a = errors === null || errors === void 0 ? void 0 : errors.name) === null || _a === void 0 ? void 0 : _a.type) === models_1.FormError.REQUIRED && <p>This field is required</p>}

          {((_b = errors === null || errors === void 0 ? void 0 : errors.name) === null || _b === void 0 ? void 0 : _b.type) === models_1.FormError.MAXLENGTH && (<p>City name cannot exceed 50 characters</p>)}

          {((_c = errors === null || errors === void 0 ? void 0 : errors.name) === null || _c === void 0 ? void 0 : _c.type) === models_1.FormError.MINLENGTH && (<p>City name must more 3 characters</p>)}

          {((_d = errors === null || errors === void 0 ? void 0 : errors.name) === null || _d === void 0 ? void 0 : _d.type) === models_1.FormError.PATTERN && (<p>Alphabetical characters only</p>)}
          <button className="wrapper_controller__city__button" type="submit">Submit</button>
        </form>
      </div>
    </>);
};
exports["default"] = AllControllerCity;
//# sourceMappingURL=AllControllerCity.js.map