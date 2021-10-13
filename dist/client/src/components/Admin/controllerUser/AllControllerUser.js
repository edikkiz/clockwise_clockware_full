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
require("./all_controller_user_module.css");
var axios_1 = __importDefault(require("axios"));
var models_1 = require("../../../models/models");
var react_router_dom_1 = require("react-router-dom");
var react_hook_form_1 = require("react-hook-form");
var react_toast_notifications_1 = require("react-toast-notifications");
var email_validator_1 = __importDefault(require("email-validator"));
var AdminHeader_1 = __importDefault(require("../adminHeader/AdminHeader"));
var AllControllerUser = function () {
    var _a, _b, _c, _d, _e, _f;
    var _g = (0, react_hook_form_1.useForm)(), register = _g.register, handleSubmit = _g.handleSubmit, setValue = _g.setValue, errors = _g.formState.errors;
    var _h = (0, react_router_dom_1.useParams)(), id = _h.id, userName = _h.userName, userEmail = _h.userEmail;
    var history = (0, react_router_dom_1.useHistory)();
    var addToast = (0, react_toast_notifications_1.useToasts)().addToast;
    (0, react_1.useEffect)(function () {
        if (userEmail && userName) {
            setValue("name", userName);
            setValue("email", userEmail);
        }
    }, []);
    var onSubmitPut = function (data) {
        axios_1["default"]
            .put("/admin/user", {
            id: +id,
            name: data.name,
            email: data.email
        })
            .then(function () {
            addToast('user updated', { appearance: 'success' });
            history.push('/admin/users');
        });
    };
    return (<>
      <AdminHeader_1["default"] />
    <div className="wrapper_controller-city">
      <form className="wrapper_controller-city__form" onSubmit={handleSubmit(onSubmitPut)}>
        <input placeholder="Enter user name" className="wrapper_controller-city__form__input" {...register("name", { required: true, minLength: 3, maxLength: 50, pattern: /[A-Za-zА-Яа-я]/ })}/>
        {((_a = errors === null || errors === void 0 ? void 0 : errors.name) === null || _a === void 0 ? void 0 : _a.type) === models_1.FormError.REQUIRED && <p>This field is required</p>}

        {((_b = errors === null || errors === void 0 ? void 0 : errors.name) === null || _b === void 0 ? void 0 : _b.type) === models_1.FormError.MAXLENGTH && (<p>User name cannot exceed 30 characters</p>)}

        {((_c = errors === null || errors === void 0 ? void 0 : errors.name) === null || _c === void 0 ? void 0 : _c.type) === models_1.FormError.MINLENGTH && (<p>User name must more 3 characters</p>)}

        {((_d = errors === null || errors === void 0 ? void 0 : errors.name) === null || _d === void 0 ? void 0 : _d.type) === models_1.FormError.PATTERN && (<p>Alphabetical characters only</p>)}

        <input className="controller_user__input" placeholder="enter user email" {...register("email", { required: true, validate: function (value) { return email_validator_1["default"].validate(value); } })}></input>
        {((_e = errors === null || errors === void 0 ? void 0 : errors.name) === null || _e === void 0 ? void 0 : _e.type) === models_1.FormError.REQUIRED && <p>This field is required</p>}

        {((_f = errors === null || errors === void 0 ? void 0 : errors.name) === null || _f === void 0 ? void 0 : _f.type) === models_1.FormError.VALIDATE && (<p>Email must be "email@example.com" format</p>)}

        <button className="wrapper_controller__city__button" type="submit">Submit</button>
      </form>
    </div>
    </>);
};
exports["default"] = AllControllerUser;
//# sourceMappingURL=AllControllerUser.js.map