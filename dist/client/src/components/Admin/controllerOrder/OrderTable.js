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
var react_1 = __importStar(require("react"));
var axios_1 = __importDefault(require("axios"));
require("./order_table_module.css");
var models_1 = require("../../../models/models");
var react_router_dom_1 = require("react-router-dom");
var Preloader_1 = __importDefault(require("../../Preloader"));
var react_toast_notifications_1 = require("react-toast-notifications");
var AdminHeader_1 = __importDefault(require("../adminHeader/AdminHeader"));
var limit = 10;
var OrderTable = function () {
    var _a = (0, react_1.useState)([]), orders = _a[0], setOrders = _a[1];
    var _b = (0, react_1.useState)([]), cities = _b[0], setCities = _b[1];
    var _c = (0, react_1.useState)(null), cityFilter = _c[0], setCityFilter = _c[1];
    var _d = (0, react_1.useState)([]), masters = _d[0], setMasters = _d[1];
    var _e = (0, react_1.useState)(null), masterFilter = _e[0], setMasterFilter = _e[1];
    var _f = (0, react_1.useState)([]), clockSizes = _f[0], setClockSizes = _f[1];
    var _g = (0, react_1.useState)(null), clockSizeFilter = _g[0], setClockSizeFilter = _g[1];
    var _h = (0, react_1.useState)([models_1.Status.Completed, models_1.Status.CREATED, models_1.Status.INPROGRESS]), statusesFilter = _h[0], setStatusesFilter = _h[1];
    var _j = (0, react_1.useState)(null), statusFilter = _j[0], setStatusFilter = _j[1];
    var _k = (0, react_1.useState)(null), filterStart = _k[0], setFilterStart = _k[1];
    var _l = (0, react_1.useState)(null), filterEnd = _l[0], setFilterEnd = _l[1];
    var _m = (0, react_1.useState)(0), offset = _m[0], setOffset = _m[1];
    var _o = (0, react_1.useState)(false), isLoading = _o[0], setIsLoading = _o[1];
    var addToast = (0, react_toast_notifications_1.useToasts)().addToast;
    var getMasters = (0, react_1.useCallback)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsLoading(true);
                    return [4 /*yield*/, axios_1["default"].get("/admin/master")];
                case 1:
                    data = (_a.sent()).data;
                    setMasters(data);
                    setIsLoading(false);
                    return [2 /*return*/];
            }
        });
    }); }, []);
    (0, react_1.useEffect)(function () {
        getMasters();
    }, [getMasters]);
    var getCities = (0, react_1.useCallback)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsLoading(true);
                    return [4 /*yield*/, axios_1["default"].get("/city")];
                case 1:
                    data = (_a.sent()).data;
                    setCities(data);
                    setIsLoading(false);
                    return [2 /*return*/];
            }
        });
    }); }, []);
    (0, react_1.useEffect)(function () {
        getCities();
    }, [getCities]);
    var getClockSizes = (0, react_1.useCallback)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsLoading(true);
                    return [4 /*yield*/, axios_1["default"].get("/clockSizes")];
                case 1:
                    data = (_a.sent()).data;
                    setClockSizes(data);
                    setIsLoading(false);
                    return [2 /*return*/];
            }
        });
    }); }, []);
    (0, react_1.useEffect)(function () {
        getClockSizes();
    }, [getClockSizes]);
    var filtered = function () { return __awaiter(void 0, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(cityFilter ||
                        masterFilter ||
                        clockSizeFilter ||
                        statusFilter ||
                        filterStart ||
                        filterEnd)) return [3 /*break*/, 2];
                    return [4 /*yield*/, axios_1["default"].get('/admin/allOrderFiltred', {
                            params: {
                                offset: offset,
                                limit: limit,
                                cityId: cityFilter,
                                masterId: masterFilter,
                                clockSizeId: clockSizeFilter,
                                status: statusFilter,
                                filterStart: filterStart,
                                filterEnd: filterEnd
                            }
                        })];
                case 1:
                    data = (_a.sent()).data;
                    if (!data.length) {
                        addToast('no orders for this filter', { appearance: 'warning' });
                    }
                    setOrders(data);
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); };
    (0, react_1.useEffect)(function () {
        filtered();
    }, [offset]);
    var onSubmitDelete = (0, react_1.useCallback)(function (id) {
        setIsLoading(true);
        if (window.confirm('confirm deletion of the selected order')) {
            axios_1["default"]
                .put("/admin/deleteOrder", {
                id: +id
            })
                .then(function () {
                var localCopy = __spreadArray([], orders, true);
                var deleteIndex = localCopy.findIndex(function (elem) { return elem.id === id; });
                localCopy.splice(deleteIndex, 1);
                setOrders(localCopy);
                setIsLoading(false);
                addToast('order deleted', { appearance: 'success' });
                setIsLoading(true);
                var getAllOrders = function () { return __awaiter(void 0, void 0, void 0, function () {
                    var data;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, axios_1["default"].get("/admin/allOrder", {
                                    params: {
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
            });
        }
        setIsLoading(false);
    }, [orders]);
    var next = (0, react_1.useCallback)(function () {
        setOffset(function (currentOffset) { return currentOffset + limit; });
    }, []);
    var after = (0, react_1.useCallback)(function () {
        if (offset < 10) {
            setOffset(0);
        }
        if (offset >= 10) {
            setOffset(offset - limit);
        }
    }, [offset]);
    var getOrdersList = (0, react_1.useCallback)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (cityFilter ||
                        masterFilter ||
                        clockSizeFilter ||
                        statusFilter ||
                        filterStart ||
                        filterEnd) {
                        return [2 /*return*/];
                    }
                    setIsLoading(true);
                    return [4 /*yield*/, axios_1["default"].get("/admin/allOrder", {
                            params: {
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
    }); }, [offset]);
    (0, react_1.useEffect)(function () {
        getOrdersList();
    }, [getOrdersList]);
    return (<div>
      <Preloader_1["default"] isLoading={isLoading}/>
      <AdminHeader_1["default"] />
      <div className="wrapperFilter">
        <select className="selectFilter" onChange={function (event) {
            event.currentTarget.value === 'No city for filter'
                ? setCityFilter(null)
                : setCityFilter(+event.currentTarget.value);
        }}>
          <option selected>No city for filter</option>
          {cities.map(function (_a) {
            var id = _a.id, name = _a.name;
            return (<option selected={id === cityFilter} value={+id}>
              {"" + name}
            </option>);
        })}
        </select>

        <select className="selectFilter" onChange={function (event) {
            event.currentTarget.value === 'No master for filter'
                ? setMasterFilter(null)
                : setMasterFilter(+event.currentTarget.value);
        }}>
          <option selected>No master for filter</option>
          {masters.map(function (_a) {
            var id = _a.id, name = _a.name;
            return (<option selected={id === masterFilter} value={+id}>
              {"" + name}
            </option>);
        })}
        </select>

        <select className="selectFilter" onChange={function (event) {
            event.currentTarget.value === 'No clock size for filter'
                ? setClockSizeFilter(null)
                : setClockSizeFilter(+event.currentTarget.value);
        }}>
          <option selected>No clock size for filter</option>
          {clockSizes.map(function (_a) {
            var id = _a.id, size = _a.size;
            return (<option selected={id === clockSizeFilter} value={+id}>
              {"" + size}
            </option>);
        })}
        </select>

        <select className="selectFilter" onChange={function (event) {
            var value = event.currentTarget.value;
            value !== 'No status for filter'
                ? setStatusFilter(value)
                : setStatusFilter(null);
        }}>
          <option selected>No status for filter</option>
          {statusesFilter.map(function (elem) { return (<option value={elem}>{"" + elem}</option>); })}
        </select>

        <button className={statusFilter ||
            cityFilter ||
            masterFilter ||
            clockSizeFilter ||
            filterEnd ||
            filterStart
            ? 'buttonFilter'
            : 'buttonFilter-disabled'} onClick={filtered}>
          filter
        </button>

        <input type="date" title="select start filter date" max={filterEnd !== null ? filterEnd : ''} onChange={function (event) {
            setFilterStart(event.currentTarget.value);
        }}/>

        <input type="date" title="select end filter date" min={filterStart !== null ? filterStart : ''} onChange={function (event) {
            setFilterEnd(event.currentTarget.value);
        }}/>
      </div>

      <div className="wrapper_orders">
        <table className="wrapper_orders__table">
          <tr>
            <th className="table_block_id__order">id</th>
            <th className="table_block_name__order">user name</th>
            <th className="table_block_name__order">user email</th>
            <th className="table_block_name__order">city</th>
            <th className="table_block_name__order">clock size</th>
            <th className="table_block_name__order">master</th>
            <th className="table_block_name__order">start at</th>
            <th className="table_block_name__order">end at</th>
            <th className="table_block_name__order">price</th>
            <th className="table_block_name__order">feedback</th>
            <th className="table_block_name__order">rating</th>
            <th className="table_block_name__order">status</th>
            <th className="link_create__order">update / delete</th>
          </tr>
          {orders.map(function (order) { return (<tr>
              <th className="table_block_id__order">{"" + order.id}</th>
              <th className="table_block_name__order">{"" + order.user.name}</th>
              <th className="table_block_name__order">{"" + order.user.email}</th>
              <th className="table_block_name__order">{"" + order.city.name}</th>
              <th className="table_block_name__order">{"" + order.clockSize.size}</th>
              <th className="table_block_name__order">{"" + order.master.name}</th>
              <th className="table_block_name__order">{"" + new Date(order.startAt.split('.')[0]).toLocaleString()}</th>
              <th className="table_block_name__order">{new Date(order.endAt.split('.')[0]).toLocaleString() + " "}</th>
              <th className="table_block_name__order">{"" + order.price}</th>
              <th className="table_block_name__order">{"" + (order.feedback === null ? 'no feedback' : order.feedback)}</th>
              <th className="table_block_name__order">{"" + (order.rating === null ? 'not rated' : order.rating)}</th>
              <th className="table_block_name__order">{"" + order.status}</th>
              <button type="button" onClick={function () { return onSubmitDelete(order.id); }} className="link_update__order">
                <th className="table_link__order">delete</th>
              </button>
              {order.status != models_1.Status.Completed ? (<react_router_dom_1.Link to={{
                    pathname: "/admin/navOrder",
                    state: {
                        id: order.id,
                        userId: order.user.id,
                        masterId: order.master.id,
                        cityId: order.city.id,
                        clockSizeId: order.clockSize.id,
                        startAt: order.startAt,
                        price: order.price
                    }
                }} title="update the order" className="link_update__order">
                  <th className="table_link__order">update</th>
                </react_router_dom_1.Link>) : (<react_router_dom_1.Link to={{
                    pathname: "/admin/navOrder",
                    state: {
                        id: order.id,
                        userId: order.user.id,
                        masterId: order.master.id,
                        cityId: order.city.id,
                        clockSizeId: order.clockSize.id,
                        startAt: order.startAt,
                        price: order.price
                    }
                }} title="update the order" className="link_update__order-disabled">
                  <th className="table_link__order-disabled">update</th>
                </react_router_dom_1.Link>)}
            </tr>); })}
        </table>
      </div>
      {offset !== 0 ? (<button className="after_button" onClick={after}>
          back
        </button>) : (<button className="after_button" disabled={true} onClick={after}>
          back
        </button>)}
      {orders.length >= limit ? (<button className="next_button" onClick={next}>
          next
        </button>) : (<button className="next_button" disabled={true} onClick={next}>
          next
        </button>)}
      {orders.length === 0 && <div>Dont have more orders</div>}
    </div>);
};
exports["default"] = OrderTable;
//# sourceMappingURL=OrderTable.js.map