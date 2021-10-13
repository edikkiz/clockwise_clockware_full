"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var axios_1 = __importDefault(require("axios"));
var react_1 = require("react");
var Preloader_1 = __importDefault(require("../../Preloader"));
var react_toast_notifications_1 = require("react-toast-notifications");
var react_hook_form_1 = require("react-hook-form");
var email_validator_1 = __importDefault(require("email-validator"));
var models_1 = require("../../../models/models");
require("./masterRegistration_module.css");
var react_router_dom_1 = require("react-router-dom");
var regPasswordWithOneNumb = new RegExp("[0-9]{1,}");
var regPasswordWithOneSymbolLowerCase = new RegExp("[a-zа-я]{1,}");
var regPasswordWithOneSymbolUpperCase = new RegExp("[A-ZА-Я]{1,}");
var regPasswordWithOneSymbol = new RegExp("[$.,#@&^%()*!}{/]{1,}");
var MasterRegistration = function () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    var _p = (0, react_hook_form_1.useForm)(), register = _p.register, handleSubmit = _p.handleSubmit, control = _p.control, reset = _p.reset, setValue = _p.setValue, errors = _p.formState.errors;
    var _q = (0, react_1.useState)(false), isLoading = _q[0], setIsLoading = _q[1];
    var _r = (0, react_1.useState)([]), cities = _r[0], setCities = _r[1];
    var addToast = (0, react_toast_notifications_1.useToasts)().addToast;
    var history = (0, react_router_dom_1.useHistory)();
    var dataForRegisterMaster = (0, react_hook_form_1.useWatch)({
        control: control,
        name: ["login", "password", "city", "name", "checkbox"]
    });
    (0, react_1.useEffect)(function () {
        var getCities = function () { return __awaiter(void 0, void 0, void 0, function () {
            var data, id;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1["default"].get("/city")];
                    case 1:
                        data = _a.sent();
                        if (data.data.length) {
                            setCities(data.data);
                            id = data.data[0].id;
                            setValue("city", id);
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        getCities();
    }, []);
    var onSubmit = function (data) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(data.city != null)) return [3 /*break*/, 2];
                    setIsLoading(true);
                    return [4 /*yield*/, axios_1["default"].post('/masterRegistration', {
                            name: data.name,
                            cityId: +data.city,
                            login: data.login,
                            password: data.password,
                            confirmPassword: data.confirmPassword
                        }).then(function (res) {
                            setIsLoading(false);
                            localStorage.setItem('accessToken', res.headers.authorization.split(' ')[1] + " master");
                            addToast('Master registrated', { appearance: 'success' });
                            history.push("/role/master/" + res.data.id);
                        })["catch"](function (err) {
                            if (err.message === "Request failed with status code 400") {
                                addToast('Master with this email existed', { appearance: 'error' });
                            }
                            setIsLoading(false);
                        })];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); };
    return (<div className="wrapper_form">
            <Preloader_1["default"] isLoading={isLoading}/>
            <form onSubmit={handleSubmit(onSubmit)} className="wrapper_form__form">
                <input placeholder="login" className="wrapper_form__input" {...register("login", { required: true, validate: function (value) { return email_validator_1["default"].validate(value); } })}/>
                {((_a = errors === null || errors === void 0 ? void 0 : errors.login) === null || _a === void 0 ? void 0 : _a.type) === models_1.FormError.REQUIRED && <p>This field is required</p>}

                {((_b = errors === null || errors === void 0 ? void 0 : errors.login) === null || _b === void 0 ? void 0 : _b.type) === models_1.FormError.VALIDATE && <p>Email must be "email@example.com" format</p>}

                <input placeholder="password" type="password" className="wrapper_form__input" {...register("password", {
        required: true, validate: {
            testOneNumb: function (value) { return regPasswordWithOneNumb.test(value); },
            testOneSymbolLowerCase: function (value) { return regPasswordWithOneSymbolLowerCase.test(value); },
            testOneSymbolUpperCase: function (value) { return regPasswordWithOneSymbolUpperCase.test(value); },
            testOneSymbol: function (value) { return regPasswordWithOneSymbol.test(value); }
        }
    })}/>
                {((_c = errors === null || errors === void 0 ? void 0 : errors.password) === null || _c === void 0 ? void 0 : _c.type) === models_1.FormError.REQUIRED && <p>This field is required</p>}

                {((_d = errors === null || errors === void 0 ? void 0 : errors.password) === null || _d === void 0 ? void 0 : _d.type) === models_1.FormError.TESTONENUMB && <p>Password must 1 or more number </p>}

                {((_e = errors === null || errors === void 0 ? void 0 : errors.password) === null || _e === void 0 ? void 0 : _e.type) === models_1.FormError.TESTONESYMBOLLOWERCASE && <p>Password must 1 or more symbol lower case </p>}

                {((_f = errors === null || errors === void 0 ? void 0 : errors.password) === null || _f === void 0 ? void 0 : _f.type) === models_1.FormError.TESTONESYMBOLUPPERCASE && <p>Password must 1 or more symbol upper case </p>}

                {((_g = errors === null || errors === void 0 ? void 0 : errors.password) === null || _g === void 0 ? void 0 : _g.type) === models_1.FormError.TESTONESYMBOL && <p>Password must 1 or more symbol `${"[.,/\$#@&^%()*!}{}]"}` </p>}

                <input placeholder="confirm password" type="password" className="wrapper_form__input" {...register("confirmPassword", { required: true, validate: function (value) { return dataForRegisterMaster[1] === value; } })}/>
                {((_h = errors === null || errors === void 0 ? void 0 : errors.confirmPassword) === null || _h === void 0 ? void 0 : _h.type) === models_1.FormError.REQUIRED && <p>This field is required</p>}

                {((_j = errors === null || errors === void 0 ? void 0 : errors.confirmPassword) === null || _j === void 0 ? void 0 : _j.type) === models_1.FormError.VALIDATE && <p>Those passwords didn’t match. Try again.</p>}

                <select className="wrapper_form__select" {...register("city", { required: true })}>
                    {cities.map(function (_a) {
            var name = _a.name, id = _a.id;
            return (<option className="city" selected={(id === cities[0].id)} value={+id}>
                                {"" + name}
                            </option>);
        })}
                </select>

                <input placeholder="name" className="wrapper_form__input" {...register("name", { required: true, minLength: 3, maxLength: 30, pattern: /[A-Za-zА-Яа-я]/ })}/>
                {((_k = errors === null || errors === void 0 ? void 0 : errors.name) === null || _k === void 0 ? void 0 : _k.type) === models_1.FormError.REQUIRED && <p>This field is required</p>}

                {((_l = errors === null || errors === void 0 ? void 0 : errors.name) === null || _l === void 0 ? void 0 : _l.type) === models_1.FormError.MAXLENGTH && (<p>Master name cannot exceed 30 characters</p>)}

                {((_m = errors === null || errors === void 0 ? void 0 : errors.name) === null || _m === void 0 ? void 0 : _m.type) === models_1.FormError.MINLENGTH && (<p>Master name must more 3 characters</p>)}

                {((_o = errors === null || errors === void 0 ? void 0 : errors.name) === null || _o === void 0 ? void 0 : _o.type) === models_1.FormError.PATTERN && (<p>Alphabetical characters only</p>)}

                <div className="checkboxText"><input className="checkbox" type="checkbox" {...register("checkbox", { required: true })}/>Terms of Use</div>

                {dataForRegisterMaster[0] && dataForRegisterMaster[1] && dataForRegisterMaster[2] && dataForRegisterMaster[3] && dataForRegisterMaster[4] ?
            <button className="wrapper_master_registration__form__button" type="submit">Confirm </button>
            :
                <button className="wrapper_master_registration__form__button-disabled" type="submit" disabled>Confirm</button>}

            </form>
        </div>);
};
exports["default"] = MasterRegistration;
//# sourceMappingURL=masterRegistration.js.map