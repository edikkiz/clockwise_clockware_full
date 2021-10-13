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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var axios_1 = __importDefault(require("axios"));
var react_1 = __importStar(require("react"));
var models_1 = require("../../models/models");
require("./Form_module.css");
var Preloader_1 = __importDefault(require("../Preloader"));
var react_toast_notifications_1 = require("react-toast-notifications");
var react_hook_form_1 = require("react-hook-form");
var email_validator_1 = __importDefault(require("email-validator"));
var date = new Date();
var day = date.getDate();
var month = date.getMonth() + 1;
var year = date.getFullYear();
var hour = date.getHours();
var correctDate = year + "-" + (month < 10 ? "0" + month : "" + month) + "-" + (day < 10 ? "0" + day : "" + day);
var time = [
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
];
var Form = function () {
    var _a, _b, _c, _d, _e, _f, _g;
    var _h = (0, react_hook_form_1.useForm)(), register = _h.register, handleSubmit = _h.handleSubmit, control = _h.control, reset = _h.reset, setValue = _h.setValue, errors = _h.formState.errors;
    var day = (0, react_hook_form_1.useWatch)({
        control: control,
        name: 'day',
        defaultValue: correctDate
    });
    var dataForFreeMaster = (0, react_hook_form_1.useWatch)({
        control: control,
        name: ['day', 'time', 'city', 'clockSize']
    });
    var _j = (0, react_1.useState)([]), cities = _j[0], setCities = _j[1];
    var _k = (0, react_1.useState)([]), clockSizes = _k[0], setClockSizes = _k[1];
    var _l = (0, react_1.useState)([]), masters = _l[0], setMasters = _l[1];
    var _m = (0, react_1.useState)(false), isLoading = _m[0], setIsLoading = _m[1];
    var _o = (0, react_1.useState)([]), urls = _o[0], setUrls = _o[1];
    var _p = (0, react_1.useState)(), files = _p[0], setFiles = _p[1];
    var addToast = (0, react_toast_notifications_1.useToasts)().addToast;
    (0, react_1.useEffect)(function () {
        var getClockSize = function () { return __awaiter(void 0, void 0, void 0, function () {
            var sizes, id;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1["default"].get('/clockSizes')];
                    case 1:
                        sizes = _a.sent();
                        setClockSizes(sizes.data);
                        if (sizes.data) {
                            id = sizes.data[0].id;
                            setValue('clockSize', id);
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        getClockSize();
    }, []);
    (0, react_1.useEffect)(function () {
        setIsLoading(true);
        var getMaters = function () { return __awaiter(void 0, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!dataForFreeMaster.every(function (elem) { return !!elem; })) return [3 /*break*/, 2];
                        return [4 /*yield*/, axios_1["default"].get('/getFreeMasters', {
                                params: {
                                    startAt: dataForFreeMaster[0] + " " + dataForFreeMaster[1],
                                    cityId: dataForFreeMaster[2],
                                    clockSizeId: dataForFreeMaster[3]
                                }
                            })];
                    case 1:
                        data = (_a.sent()).data;
                        if (data.length === 0) {
                            addToast('There are not available masters at selected time', {
                                appearance: 'error'
                            });
                            setMasters([]);
                            setIsLoading(false);
                        }
                        if (data.length) {
                            setValue('master', data[0].id);
                            setIsLoading(false);
                            setMasters(data);
                        }
                        setIsLoading(false);
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        }); };
        getMaters();
        setIsLoading(false);
    }, [dataForFreeMaster]);
    (0, react_1.useEffect)(function () {
        var getCities = function () { return __awaiter(void 0, void 0, void 0, function () {
            var data, id;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1["default"].get("/city")];
                    case 1:
                        data = (_a.sent()).data;
                        setCities(data);
                        if (data.length) {
                            id = data[0].id;
                            setValue('city', id);
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        getCities();
    }, []);
    var validate = function (time) {
        if (new Date(day + ":" + time) > new Date(correctDate + ":" + hour + ":00")) {
            return true;
        }
        return false;
    };
    var fileRender = (0, react_1.useCallback)(function () {
        if (files) {
            var _loop_1 = function (i) {
                var fileReader = new FileReader();
                fileReader.readAsDataURL(files[i]);
                fileReader.onload = function () {
                    var res = fileReader.result;
                    if (res && typeof res === 'string') {
                        setUrls(function (prevUrl) { return __spreadArray(__spreadArray([], prevUrl, true), [res], false); });
                    }
                };
            };
            for (var i = 0; i < files.length; i++) {
                _loop_1(i);
            }
        }
    }, [files]);
    (0, react_1.useEffect)(function () {
        fileRender();
    }, [fileRender]);
    var onSubmit = function (data) { return __awaiter(void 0, void 0, void 0, function () {
        var i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsLoading(true);
                    if (data.photos) {
                        if (data.photos.length > 5) {
                            addToast('max 5 files', { appearance: 'error' });
                            setIsLoading(false);
                        }
                        for (i = 0; i < data.photos.length; i++) {
                            if (data.photos[i].size > 1024 * 1024) {
                                addToast('max 1 mb for one file', { appearance: 'error' });
                                setIsLoading(false);
                            }
                        }
                    }
                    return [4 /*yield*/, axios_1["default"].post("/order", {
                            masterId: +data.master,
                            cityId: +data.city,
                            clockSizeId: +data.clockSize,
                            startAt: data.day + " " + data.time + " UTC",
                            name: data.name,
                            email: data.email,
                            images: urls
                        }).then(function () {
                            addToast('Order created', { appearance: 'success' });
                            reset();
                            setValue("day", correctDate);
                            setValue("time", time[0]);
                            setIsLoading(false);
                        })["catch"](function () {
                            addToast('Something is wrong', { appearance: 'error' });
                            setIsLoading(false);
                        })];
                case 1:
                    _a.sent();
                    setIsLoading(false);
                    return [2 /*return*/];
            }
        });
    }); };
    var test = function () {
        setIsLoading(true);
        setTimeout(function () {
            setIsLoading(false);
        }, 5000);
    };
    return (<div className="wrapper_form">
      <Preloader_1["default"] isLoading={isLoading}/>

      <form onSubmit={handleSubmit(onSubmit)} className="wrapper_form__form">
        <input placeholder="name" className="wrapper_form__input" {...register('name', {
        required: true,
        minLength: 3,
        maxLength: 30,
        pattern: /[A-Za-zА-Яа-я]/
    })}/>
        {((_a = errors === null || errors === void 0 ? void 0 : errors.name) === null || _a === void 0 ? void 0 : _a.type) === models_1.FormError.REQUIRED && (<p>This field is required</p>)}

        {((_b = errors === null || errors === void 0 ? void 0 : errors.name) === null || _b === void 0 ? void 0 : _b.type) === models_1.FormError.MAXLENGTH && (<p>First name cannot exceed 30 characters</p>)}

        {((_c = errors === null || errors === void 0 ? void 0 : errors.name) === null || _c === void 0 ? void 0 : _c.type) === models_1.FormError.MINLENGTH && (<p>First name must more 3 characters</p>)}

        {((_d = errors === null || errors === void 0 ? void 0 : errors.name) === null || _d === void 0 ? void 0 : _d.type) === models_1.FormError.PATTERN && (<p>Alphabetical characters only</p>)}

        <input placeholder="email" className="wrapper_form__input" {...register('email', {
        required: true,
        validate: function (value) { return email_validator_1["default"].validate(value); }
    })}/>
        {((_e = errors === null || errors === void 0 ? void 0 : errors.email) === null || _e === void 0 ? void 0 : _e.type) === models_1.FormError.VALIDATE && (<p>Email must be "email@example.com" format</p>)}

        {((_f = errors === null || errors === void 0 ? void 0 : errors.email) === null || _f === void 0 ? void 0 : _f.type) === models_1.FormError.REQUIRED && (<p>This field is required</p>)}

        <select className="wrapper_form__select" {...register('clockSize')}>
          {clockSizes.map(function (_a) {
            var id = _a.id, size = _a.size;
            return (<option className="clockSize" selected={id === clockSizes[0].id} value={+id}>
              {"" + size}
            </option>);
        })}
        </select>

        <select className="wrapper_form__select" {...register('city')}>
          {cities.map(function (_a) {
            var name = _a.name, id = _a.id;
            return (<option className="city" selected={id === cities[0].id} value={+id}>
              {"" + name}
            </option>);
        })}
        </select>

        <input className="wrapper_form__input" min={correctDate} type="date" {...register('day', { required: true })}/>

        <select className="wrapper_form__select" {...register('time', { validate: validate })}>
          {time.map(function (elem) { return (<option selected={elem === time[0]}>{"" + elem}</option>); })}
        </select>
        {((_g = errors === null || errors === void 0 ? void 0 : errors.time) === null || _g === void 0 ? void 0 : _g.type) === models_1.FormError.VALIDATE && (<p>The time must be greater than the current one</p>)}

        <select className="wrapper_form__select" {...register("master")}>
          {masters.map(function (_a) {
            var name = _a.name, id = _a.id, rating = _a.rating;
            return (!rating ?
                <option className="masters" selected={id === masters[0].id} value={+id}>
                  {name + " with rating: 0"}
                </option>
                :
                    <option className="masters" value={+id}>
                  {name + " with rating: " + (rating).toFixed(1)}
                </option>);
        })}
        </select>
        <div>Maximum 5 files and no more 1 mb for one</div>
        <input type="file" multiple={true} accept=".PNG, .JPG, .JPEG" onChange={function (event) { return setFiles(event.currentTarget.files); }}/>
        <button className="wrapper_form__button" type="submit">Submit</button>
      </form>
      <button onClick={test}>pick me for fun</button>
    </div>);
};
exports["default"] = Form;
//# sourceMappingURL=Form.js.map