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
require("./Login_module.css");
var axios_1 = __importDefault(require("axios"));
var react_router_dom_1 = require("react-router-dom");
var Preloader_1 = __importDefault(require("../Preloader"));
var react_toast_notifications_1 = require("react-toast-notifications");
var visible_svg_1 = __importDefault(require("../../visible.svg"));
var react_hook_form_1 = require("react-hook-form");
var visibleOff_svg_1 = __importDefault(require("../../visibleOff.svg"));
var react_router_dom_2 = require("react-router-dom");
var models_1 = require("../../models/models");
var Login = function () {
    var _a = (0, react_hook_form_1.useForm)(), register = _a.register, handleSubmit = _a.handleSubmit, control = _a.control, setValue = _a.setValue, errors = _a.formState.errors;
    var _b = (0, react_1.useState)(false), isLoading = _b[0], setIsLoading = _b[1];
    var history = (0, react_router_dom_1.useHistory)();
    var _c = (0, react_1.useState)(''), email = _c[0], setEmail = _c[1];
    var _d = (0, react_1.useState)(''), password = _d[0], setPassword = _d[1];
    var _e = (0, react_1.useState)(true), seePass = _e[0], setSeePass = _e[1];
    var addToast = (0, react_toast_notifications_1.useToasts)().addToast;
    var onSubmit = function () { return __awaiter(void 0, void 0, void 0, function () {
        var payload, login, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    payload = {
                        email: email,
                        password: password
                    };
                    return [4 /*yield*/, axios_1["default"].post("/login", payload)];
                case 2:
                    login = _a.sent();
                    if (login.data.role === models_1.Role.admin) {
                        localStorage.setItem('accessToken', login.headers.authorization.split(' ')[1]);
                        addToast('you are logged in', { appearance: 'success' });
                        history.push("/admin/orders");
                    }
                    if (login.data.role === models_1.Role.master) {
                        localStorage.setItem('accessToken', login.headers.authorization.split(' ')[1]);
                        addToast("Hello master: " + login.data.name, { appearance: 'success' });
                        history.push("/role/master/" + login.data.id);
                    }
                    if (login.data.role === models_1.Role.user) {
                        localStorage.setItem('accessToken', login.headers.authorization.split(' ')[1]);
                        addToast("Hello: " + login.data.name, { appearance: 'success' });
                        history.push("/role/user/" + login.data.id);
                    }
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    addToast('invalid login or password', { appearance: 'error' });
                    setPassword('');
                    setIsLoading(false);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var turn = function () {
        if (seePass === true) {
            setSeePass(false);
        }
        else {
            setSeePass(true);
        }
    };
    return (<form onSubmit={handleSubmit(onSubmit)} className="wrapper_login">
      <Preloader_1["default"] isLoading={isLoading}/>
      <div className="wrapper_login__email">
        <input className="wrapper_login__email-input" placeholder="email" type="email" value={email} onChange={function (e) {
            return setEmail(e.currentTarget.value);
        }}/>
      </div>
      {!seePass ?
            <div className="wrapper_login__password">
            <input className="wrapper_login__password-input" placeholder="password" type="text" value={password} onChange={function (e) {
                    return setPassword(e.currentTarget.value);
                }}/>
            <button type="button" className="visible" onClick={turn}><img src={visible_svg_1["default"]}/></button>
          </div>
            :
                <div className="wrapper_login__password">
            <input className="wrapper_login__password-input" placeholder="password" type="password" value={password} onChange={function (e) {
                        return setPassword(e.currentTarget.value);
                    }}/>
            <button type="button" className="visible" onClick={turn}><img src={visibleOff_svg_1["default"]}/></button>
          </div>}
      <div className="wrapper_login__singin">
        <button className="wrapper_login__singin-button" type='submit'>Sign in</button>
      </div>
      <div className="wrapper_login__singin-master">
        <react_router_dom_2.Link to="/master/registration" className="wrapper_login__singin-link">
          <div className="link-content">Master registration</div>
        </react_router_dom_2.Link>
      </div>
    </form>);
};
exports["default"] = Login;
//# sourceMappingURL=Login.js.map