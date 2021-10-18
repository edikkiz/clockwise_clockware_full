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
require("./all_controller_master_module.css");
var axios_1 = __importDefault(require("axios"));
var models_1 = require("../../../models/models");
var react_router_dom_1 = require("react-router-dom");
var react_hook_form_1 = require("react-hook-form");
var react_toast_notifications_1 = require("react-toast-notifications");
var AdminHeader_1 = __importDefault(require("../adminHeader/AdminHeader"));
var AllControllerMaster = function () {
    var _a, _b, _c, _d;
    var _e = (0, react_hook_form_1.useForm)(), register = _e.register, handleSubmit = _e.handleSubmit, control = _e.control, setValue = _e.setValue, errors = _e.formState.errors;
    var _f = (0, react_router_dom_1.useParams)(), updateId = _f.id, name = _f.name, updateCityId = _f.cityId;
    var history = (0, react_router_dom_1.useHistory)();
    var _g = (0, react_1.useState)([]), cities = _g[0], setCities = _g[1];
    var addToast = (0, react_toast_notifications_1.useToasts)().addToast;
    (0, react_1.useEffect)(function () {
        if (name && updateCityId) {
            setValue("name", name);
            setValue("city", +updateCityId);
        }
    }, []);
    (0, react_1.useEffect)(function () {
        var getCities = function () { return __awaiter(void 0, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1["default"].get("/city")];
                    case 1:
                        data = (_a.sent()).data;
                        setValue("city", data[0].id);
                        setCities(data);
                        return [2 /*return*/];
                }
            });
        }); };
        getCities();
    }, []);
    var whatControllerUse = function (data) {
        !updateId ? onSubmitAdd(data) : onSubmitPatchMaster(data);
    };
    var onSubmitAdd = function (data) {
        axios_1["default"]
            .post("/admin/master", {
            name: data.name,
            cityId: +data.city
        })
            .then(function () {
            addToast('Master created', { appearance: 'success' });
            history.push("/admin/masters");
        });
    };
    var onSubmitPatchMaster = function (data) {
        axios_1["default"]
            .put("/admin/master", {
            id: +updateId,
            name: data.name,
            cityId: +data.city
        })
            .then(function () {
            addToast("master updated", { appearance: 'success' });
            history.push("/admin/masters");
        });
    };
    return (<>
      <AdminHeader_1["default"] />
    <div className="wrapper_controller-city">
      <form className="wrapper_controller-city__form" onSubmit={handleSubmit(whatControllerUse)}>
        <input placeholder="Enter master name" className="wrapper_controller-city__form__input" {...register("name", { required: true, minLength: 3, maxLength: 30, pattern: /[A-Za-zА-Яа-я]/ })}/>
        {((_a = errors === null || errors === void 0 ? void 0 : errors.name) === null || _a === void 0 ? void 0 : _a.type) === models_1.FormError.REQUIRED && <p>This field is required</p>}

        {((_b = errors === null || errors === void 0 ? void 0 : errors.name) === null || _b === void 0 ? void 0 : _b.type) === models_1.FormError.MAXLENGTH && (<p>City name cannot exceed 30 characters</p>)}

        {((_c = errors === null || errors === void 0 ? void 0 : errors.name) === null || _c === void 0 ? void 0 : _c.type) === models_1.FormError.MINLENGTH && (<p>City name must more 3 characters</p>)}

        {((_d = errors === null || errors === void 0 ? void 0 : errors.name) === null || _d === void 0 ? void 0 : _d.type) === models_1.FormError.PATTERN && (<p>Alphabetical characters only</p>)}

        <select className="controller_master__select" {...register("city")}>
          {cities.map(function (_a) {
            var name = _a.name, id = _a.id;
            return (<option selected={id === +updateCityId} className="cities" value={+id}>
              {"" + name}
            </option>);
        })}
        </select>
        <button className="wrapper_controller__city__button" type="submit">Submit</button>
      </form>
    </div>
    </>);
};
exports["default"] = AllControllerMaster;
//# sourceMappingURL=AllControllerMaster.js.map