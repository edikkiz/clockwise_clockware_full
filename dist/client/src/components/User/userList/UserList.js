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
var axios_1 = __importDefault(require("axios"));
var models_1 = require("../../../models/models");
var react_router_dom_1 = require("react-router-dom");
var Preloader_1 = __importDefault(require("../../Preloader"));
var react_router_dom_2 = require("react-router-dom");
var react_toast_notifications_1 = require("react-toast-notifications");
require("./user_list_module.css");
var UserHeader_1 = __importDefault(require("../userHeader/UserHeader"));
var limit = 10;
var UserList = function () {
    var userId = (0, react_router_dom_2.useParams)().id;
    var _a = (0, react_1.useState)([]), orders = _a[0], setOrders = _a[1];
    var _b = (0, react_1.useState)(0), offset = _b[0], setOffset = _b[1];
    var _c = (0, react_1.useState)(false), isLoading = _c[0], setIsLoading = _c[1];
    var addToast = (0, react_toast_notifications_1.useToasts)().addToast;
    (0, react_1.useEffect)(function () {
        setIsLoading(true);
        var getAllOrders = function () { return __awaiter(void 0, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1["default"].get("/user/allUserOrder", {
                            params: {
                                userId: userId,
                                offset: offset,
                                limit: limit
                            }
                        })];
                    case 1:
                        data = (_a.sent()).data;
                        setOrders(data);
                        setIsLoading(false);
                        return [2 /*return*/];
                }
            });
        }); };
        getAllOrders();
        setIsLoading(false);
    }, [offset]);
    var next = (0, react_1.useCallback)(function () {
        setOffset(offset + limit);
    }, []);
    var after = (0, react_1.useCallback)(function () {
        if (offset < 10) {
            setOffset(0);
        }
        if (offset >= 10) {
            setOffset(offset - limit);
        }
    }, []);
    return (<div>
      <Preloader_1["default"] isLoading={isLoading}/>
      <UserHeader_1["default"] />
      <div className="wrapper_orders">
        <table className="wrapper_orders__table">
          <tr>
            <th className="table_block_id__order">id</th>
            <th className="table_block_name__user-orders">city</th>
            <th className="table_block_name__user-orders">clock size</th>
            <th className="table_block_name__user-orders">master</th>
            <th className="table_block_name__user-orders">start at</th>
            <th className="table_block_name__user-orders">end at</th>
            <th className="table_block_name__user-orders">price</th>
            <th className="table_block_name__user-orders">feedback</th>
            <th className="table_block_name__user-orders">rating</th>
            <th className="table_block_id__order">status</th>
            <th className="table_block_id__order">Rate</th>
          </tr>
          {orders.map(function (_a) {
            var id = _a.id, cityName = _a.cityName, size = _a.size, masterName = _a.masterName, startAt = _a.startAt, endAt = _a.endAt, price = _a.price, feedback = _a.feedback, rating = _a.rating, status = _a.status, email = _a.email, images = _a.images, feedbackToken = _a.feedbackToken;
            return (<tr>
                <th className="table_block_id__order">{"" + id}</th>
                <th className="table_block_name__user-orders">{"" + cityName}</th>
                <th className="table_block_name__user-orders">{"" + size}</th>
                <th className="table_block_name__user-orders">{"" + masterName}</th>
                <th className="table_block_name__user-orders">{"" + new Date(startAt).toLocaleString()}</th>
                <th className="table_block_name__user-orders">{new Date(endAt).toLocaleString() + " "}</th>
                <th className="table_block_name__user-orders">{"" + price}</th>
                <th className="table_block_name__user-orders">{"" + (feedback === "null" ? 'no feedback' : feedback)}</th>
                <th className="table_block_name__user-orders">{"" + (rating === null ? 'not rated' : rating)}</th>
                <th className="table_block_id__order">{"" + status}</th>
                {status === models_1.Status.Completed && feedbackToken !== '' ?
                    <react_router_dom_1.Link to={"/rate/" + feedbackToken} className="link_update__user"><th className="table_link">Сlick here to rate master</th></react_router_dom_1.Link>
                    :
                        <button type="button" disabled={true} className="link_update__user-disabled"><th className="table_link__order-disabled">{rating ? 'this order has already been rated' : 'Сan be rate after the order is completed'}</th></button>}
              </tr>);
        })}
        </table>
      </div>
      {offset !== 0 ? <button className="after_button" onClick={after}>back</button> : <button className="after_button" disabled={true} onClick={after}>back</button>}
      {orders.length >= limit ? <button className="next_button" onClick={next}>next</button> : <button className="next_button" disabled={true} onClick={next}>next</button>}
      {orders.length === 0 && <div>Dont have more orders</div>}
    </div>);
};
exports["default"] = UserList;
//# sourceMappingURL=UserList.js.map