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
var axios_1 = __importDefault(require("axios"));
require("./rate_masters_module.css");
var react_1 = __importStar(require("react"));
var react_router_dom_1 = require("react-router-dom");
var react_router_dom_2 = require("react-router-dom");
var react_toast_notifications_1 = require("react-toast-notifications");
/* @ts-ignore */
var react_rating_stars_component_1 = __importDefault(require("react-rating-stars-component"));
var RateMaster = function () {
    var history = (0, react_router_dom_1.useHistory)();
    var _a = (0, react_1.useState)(''), feedbackText = _a[0], setFeedbackText = _a[1];
    var _b = (0, react_1.useState)(false), isLoading = _b[0], setIsLoading = _b[1];
    var _c = (0, react_1.useState)(0), rating = _c[0], setRating = _c[1];
    var feedbackToken = (0, react_router_dom_1.useParams)().feedbackToken;
    var _d = (0, react_1.useState)([]), order = _d[0], setOrder = _d[1];
    var addToast = (0, react_toast_notifications_1.useToasts)().addToast;
    (0, react_1.useEffect)(function () {
        var getOrder = function () { return __awaiter(void 0, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1["default"].get('/getOrderForFeedback', {
                            params: {
                                feedbackToken: feedbackToken
                            }
                        })];
                    case 1:
                        data = (_a.sent()).data;
                        setOrder(data);
                        data.length ? setOrder(data) : history.push('/');
                        return [2 /*return*/];
                }
            });
        }); };
        getOrder();
    }, []);
    var onSubmit = function (e) {
        e.preventDefault();
        if (order[0]) {
            setIsLoading(true);
            axios_1["default"].put('/updateFeedbackOrder', {
                feedbackText: feedbackText,
                rating: rating,
                id: +order[0].id
            }).then(function () {
                addToast('thanks for the tip', { appearance: 'success' });
                var token = localStorage.getItem('accessToken');
                token ?
                    history.push("/role/user/" + order[0].userId)
                    :
                        history.push('/login');
            });
        }
    };
    var redirect = function () {
        addToast('this order has already been rated', { error: 'info' });
        return <react_router_dom_2.Redirect to="/"/>;
    };
    return (feedbackToken ?
        <div className="wrapper_rate__master">
                <form className="wrapper_rate__master__form" onSubmit={onSubmit}>
                    {order[0] &&
                <>
                            <div className="info_rate"><b>Please rate work of the master:</b>
                                <br />
                                {order[0].masterName}</div>
                            <div className="info_rate">
                                <b>Order #{order[0].id}</b>
                                <br />
                                <b> user name:</b>  {order[0].userName}
                                <br />
                                <b>user email:</b> {order[0].userEmail}
                                <br />
                                <b>clock size:</b>  {order[0].size}
                                <br />
                                <b>city:</b>  {order[0].cityName}
                                <br />
                                <b>price:</b>  {order[0].price}
                                <br />
                                <b>start work on:</b>  {order[0].startAt.split("T")[0]} {order[0].startAt.split("T")[1]}
                                <br />
                                <b>end work on:</b>  {order[0].endAt.split("T")[0]} {order[0].endAt.split("T")[1]}
                            </div>
                        </>}

                    <textarea value={feedbackText} onChange={function (event) { return setFeedbackText(event.target.value); }} className="feedback__text" placeholder="feedback on the work of the master" maxLength={255}/>

                    <react_rating_stars_component_1["default"] count={5} size={60} activeColor="#ffd700" isHalf={true} value={rating} onChange={function (newRating) { return setRating(newRating); }}/>



                    <p></p><button className="onsubmit_button" type="submit">submit</button>
                </form>
            </div>
        :
            redirect());
};
exports["default"] = RateMaster;
//# sourceMappingURL=RateMasters.js.map