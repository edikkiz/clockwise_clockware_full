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
var react_1 = __importDefault(require("@fullcalendar/react")); // must go before plugins
var daygrid_1 = __importDefault(require("@fullcalendar/daygrid")); // a plugin!
var interaction_1 = __importDefault(require("@fullcalendar/interaction")); // needed for dayClick
var react_2 = __importStar(require("react"));
var axios_1 = __importDefault(require("axios"));
var react_router_dom_1 = require("react-router-dom");
var modal_1 = __importDefault(require("./modal"));
var Calendar = function () {
    var _a = (0, react_2.useState)(false), modalActive = _a[0], setModalActive = _a[1];
    var _b = (0, react_2.useState)(), event = _b[0], setEvent = _b[1];
    var masterId = (0, react_router_dom_1.useParams)().masterId;
    var _c = (0, react_2.useState)([]), orders = _c[0], setOrders = _c[1];
    var getOrdersList = (0, react_2.useCallback)(function () {
        var getAllOrders = function () { return __awaiter(void 0, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1["default"].get("/master/allMasterOrder", {
                            params: {
                                masterId: masterId
                            }
                        })];
                    case 1:
                        data = (_a.sent()).data;
                        setOrders(data);
                        return [2 /*return*/];
                }
            });
        }); };
        getAllOrders();
    }, []);
    (0, react_2.useEffect)(function () {
        getOrdersList();
    }, [getOrdersList]);
    return (<>
            <react_1["default"] plugins={[daygrid_1["default"], interaction_1["default"]]} events={orders} eventClick={function (event) {
            setEvent(event);
            setModalActive(true);
        }}/>
            <modal_1["default"] active={modalActive} setActive={setModalActive}>
                <>
                    <div>
                        {"User name: " + (event && event.event._def.extendedProps.userName)}
                    </div>
                    <div>
                        {"Clock size: " + (event && event.event._def.extendedProps.size)}
                    </div>
                </>
            </modal_1["default"]>
        </>);
};
exports["default"] = Calendar;
//# sourceMappingURL=Calendar.js.map