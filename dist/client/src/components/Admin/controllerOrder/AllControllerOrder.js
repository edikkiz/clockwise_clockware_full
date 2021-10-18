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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var react_1 = __importStar(require("react"));
require("./all_controller_order_module.css");
var axios_1 = __importDefault(require("axios"));
var models_1 = require("../../../models/models");
var react_router_dom_1 = require("react-router-dom");
var react_toast_notifications_1 = require("react-toast-notifications");
var react_hook_form_1 = require("react-hook-form");
var Preloader_1 = __importDefault(require("../../Preloader"));
var AdminHeader_1 = __importDefault(require("../adminHeader/AdminHeader"));
var orderTime = [
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
var AllControllerOrder = function () {
    var _a, _b;
    var _c = (0, react_hook_form_1.useForm)(), register = _c.register, handleSubmit = _c.handleSubmit, control = _c.control, setValue = _c.setValue, errors = _c.formState.errors;
    var location = (0, react_router_dom_1.useLocation)();
    var _d = location.state, id = _d.id, userId = _d.userId, masterId = _d.masterId, cityId = _d.cityId, clockSizeId = _d.clockSizeId, startAt = _d.startAt, price = _d.price, status = _d.status;
    var dataForFreeMaster = (0, react_hook_form_1.useWatch)({
        control: control,
        name: ['day', 'time', 'city', 'clockSize', 'time']
    });
    var history = (0, react_router_dom_1.useHistory)();
    var _e = (0, react_1.useState)(false), isLoading = _e[0], setIsLoading = _e[1];
    var addToast = (0, react_toast_notifications_1.useToasts)().addToast;
    var _f = (0, react_1.useState)([]), cities = _f[0], setCities = _f[1];
    var _g = (0, react_1.useState)([]), putMasters = _g[0], setPutMasters = _g[1];
    var _h = (0, react_1.useState)(0), putUserId = _h[0], setPutUserId = _h[1];
    var _j = (0, react_1.useState)([]), clockSizes = _j[0], setClockSizes = _j[1];
    (0, react_1.useEffect)(function () {
        console.log(startAt);
        if (id) {
            var time_1 = startAt.split('T');
            var result = orderTime.find(function (elem) { return elem === time_1[1].split(':')[0] + ":00"; });
            if (result) {
                setValue('time', result);
            }
            setValue('day', time_1[0]);
            setPutUserId(+userId);
            setValue('master', +masterId);
            setValue('city', +cityId);
            setValue('clockSize', +clockSizeId);
            setValue('price', +price);
        }
    }, []);
    (0, react_1.useEffect)(function () {
        var getClockSize = function () { return __awaiter(void 0, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1["default"].get("/clockSizes")];
                    case 1:
                        data = (_a.sent()).data;
                        setClockSizes(data);
                        return [2 /*return*/];
                }
            });
        }); };
        getClockSize();
    }, []);
    (0, react_1.useEffect)(function () {
        var getMaters = function () { return __awaiter(void 0, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!dataForFreeMaster.every(function (elem) { return !!elem; })) return [3 /*break*/, 2];
                        return [4 /*yield*/, axios_1["default"].get("/admin/getFreeMasters", {
                                params: {
                                    orderId: +id,
                                    startAt: dataForFreeMaster[0] + ' ' + dataForFreeMaster[1],
                                    cityId: Number(dataForFreeMaster[2]),
                                    clockSizeId: Number(dataForFreeMaster[3])
                                }
                            })];
                    case 1:
                        data = (_a.sent()).data;
                        setPutMasters(data);
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        }); };
        getMaters();
    }, [dataForFreeMaster]);
    (0, react_1.useEffect)(function () {
        var getCities = function () { return __awaiter(void 0, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1["default"].get("/city")];
                    case 1:
                        data = (_a.sent()).data;
                        setCities(data);
                        return [2 /*return*/];
                }
            });
        }); };
        getCities();
    }, []);
    var onSubmitPut = function (data) {
        if (data.master && data.city && data.clockSize)
            axios_1["default"]
                .put("/admin/order", {
                id: +id,
                userId: +putUserId,
                masterId: +data.master,
                cityId: +data.city,
                clockSizeId: +data.clockSize,
                price: +data.price,
                startAt: data.day + " " + data.time,
                status: data.status
            })
                .then(function () {
                addToast('order updated', { appearance: 'success' });
                history.push('/admin/orders');
            });
    };
    return (<>
      <AdminHeader_1["default"] />
      <div className="wrapper_form">
        <Preloader_1["default"] isLoading={isLoading}/>

        <form onSubmit={handleSubmit(onSubmitPut)} className="wrapper_form__form">
          <select className="wrapper_form__select" {...register('clockSize')}>
            {clockSizes.map(function (_a) {
            var id = _a.id, size = _a.size;
            return (<option selected={+id === +clockSizeId} className="clockSize" value={+id}>
                {"" + size}
              </option>);
        })}
          </select>

          <select className="wrapper_form__select" {...register('city')}>
            {cities.map(function (_a) {
            var name = _a.name, id = _a.id;
            return (<option className="city" selected={id === +cityId} value={+id}>
                {"" + name}
              </option>);
        })}
          </select>

          <input className="wrapper_form__input" type="date" {...register('day')}/>

          <select className="wrapper_form__select" {...register('time')}>
            {orderTime.map(function (elem) { return (<option>{"" + elem}</option>); })}
          </select>

          <input className="wrapper_form__input" type="number" {...register('price', { required: true })}/>
          {((_a = errors === null || errors === void 0 ? void 0 : errors.price) === null || _a === void 0 ? void 0 : _a.type) === models_1.FormError.TYPE && <p>Only numbers</p>}

          {((_b = errors === null || errors === void 0 ? void 0 : errors.price) === null || _b === void 0 ? void 0 : _b.type) === models_1.FormError.REQUIRED && (<p>This field is required</p>)}
          {status === models_1.Status.Completed ? (<select className="wrapper_form__select" {...register('status')}>
              <option selected className="status" value={models_1.Status.Completed}>
                Completed
              </option>
            </select>) : (<select className="wrapper_form__select" {...register('status')}>
              <option selected className="status" value={models_1.Status.INPROGRESS}>
                In progress
              </option>
              <option selected className="status" value={models_1.Status.Completed}>
                Completed
              </option>
            </select>)}
          <select className="wrapper_form__select" {...register('master')}>
            {putMasters.map(function (_a) {
            var name = _a.name, id = _a.id, rating = _a.rating;
            return !rating ? (<option selected={id === +masterId} className="masters" value={id}>
                  {name + " with rating: 0"}
                </option>) : (<option selected={id === +masterId} className="masters" value={id}>
                  {name + " with rating: " + rating.toFixed(1)}
                </option>);
        })}
          </select>
          <button className="wrapper_form__button" type="submit">
            Submit
          </button>
        </form>
      </div>
    </>);
};
exports["default"] = AllControllerOrder;
//# sourceMappingURL=AllControllerOrder.js.map