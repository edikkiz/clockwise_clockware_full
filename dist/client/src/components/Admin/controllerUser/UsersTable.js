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
require("./user_table_module.css");
var react_router_dom_1 = require("react-router-dom");
var Preloader_1 = __importDefault(require("../../Preloader"));
var react_toast_notifications_1 = require("react-toast-notifications");
var AdminHeader_1 = __importDefault(require("../adminHeader/AdminHeader"));
var limit = 10;
var UsersTable = function () {
    var _a = (0, react_1.useState)([]), users = _a[0], setUsers = _a[1];
    var _b = (0, react_1.useState)(0), offset = _b[0], setOffset = _b[1];
    var _c = (0, react_1.useState)(false), isLoading = _c[0], setIsLoading = _c[1];
    var addToast = (0, react_toast_notifications_1.useToasts)().addToast;
    var getUsersList = (0, react_1.useCallback)(function () {
        setIsLoading(true);
        var getUsers = function () { return __awaiter(void 0, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1["default"].get('/admin/user', {
                            params: {
                                limit: limit,
                                offset: offset
                            }
                        })];
                    case 1:
                        data = (_a.sent()).data;
                        setUsers(data);
                        setIsLoading(false);
                        return [2 /*return*/];
                }
            });
        }); };
        getUsers();
    }, [offset]);
    (0, react_1.useEffect)(function () {
        getUsersList();
    }, [getUsersList]);
    var onSubmitDelete = (0, react_1.useCallback)(function (id) {
        setIsLoading(true);
        if (window.confirm('confirm deletion of the selected order')) {
            axios_1["default"]["delete"]("/admin/user", {
                data: {
                    id: +id
                }
            })
                .then(function () {
                var localCopy = __spreadArray([], users, true);
                var deleteIndex = localCopy.findIndex(function (elem) { return elem.id === id; });
                localCopy.splice(deleteIndex, 1);
                setUsers(localCopy);
                setIsLoading(false);
                addToast('user deleted', { appearance: 'success' });
                setIsLoading(true);
                var getUsers = function () { return __awaiter(void 0, void 0, void 0, function () {
                    var data;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, axios_1["default"].get('/admin/user', {
                                    params: {
                                        limit: limit,
                                        offset: offset
                                    }
                                })];
                            case 1:
                                data = (_a.sent()).data;
                                setUsers(data);
                                setIsLoading(false);
                                return [2 /*return*/];
                        }
                    });
                }); };
                getUsers();
            });
        }
        setIsLoading(false);
    }, [users]);
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
    return (<div>
      <Preloader_1["default"] isLoading={isLoading}/>
      <AdminHeader_1["default"] />
      <div className="wrapper_user">
        <table className="wrapper_user__table">
          <tr>
            <th className="table_block_id__user">id</th>
            <th className="table_block_name__user">Name</th>
            <th className="table_block_name__user">email</th>
            <th className="link_create__user">update / delete</th>
          </tr>
          {users.map(function (_a) {
            var id = _a.id, name = _a.name, email = _a.email;
            return (<tr>
                <th className="table_block_id__user">{"" + id}</th>
                <th className="table_block_name__user">{"" + name}</th>
                <th className="table_block_name__user">{"" + email}</th>
                <react_router_dom_1.Link to={"/admin/navUser/" + id + "/" + name + "/" + email} title="update the user" className="link_update__user"><th className="table_link__user">update</th></react_router_dom_1.Link>
                <button type="button" onClick={function () { return onSubmitDelete(id); }} className="link_update__user"><th className="table_link__user">delete</th></button>
              </tr>);
        })}
        </table>
      </div>
      {offset !== 0 ? <button className="after_button" onClick={after}>back</button> : <button className="after_button" disabled={true} onClick={after}>back</button>}
      {users.length >= limit ? <button className="next_button" onClick={next}>next</button> : <button className="next_button" disabled={true} onClick={next}>next</button>}
      {users.length === 0 && <div>Dont have more orders</div>}
    </div>);
};
exports["default"] = UsersTable;
//# sourceMappingURL=UsersTable.js.map