"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var react_1 = __importDefault(require("react"));
var react_router_dom_1 = require("react-router-dom");
require("./App.css");
var CitiesTable_1 = __importDefault(require("./components/Admin/controllerCity/CitiesTable"));
var Header_1 = __importDefault(require("./components/Header/Header"));
var AllControllerCity_1 = __importDefault(require("./components/Admin/controllerCity/AllControllerCity"));
var AllControllerMaster_1 = __importDefault(require("./components/Admin/controllerMaster/AllControllerMaster"));
var AllControllerOrder_1 = __importDefault(require("./components/Admin/controllerOrder/AllControllerOrder"));
var AllControllerUser_1 = __importDefault(require("./components/Admin/controllerUser/AllControllerUser"));
var Form_1 = __importDefault(require("./components/Form/Form"));
var Login_1 = __importDefault(require("./components/Admin/Login"));
var PrivateRoute_1 = __importDefault(require("./PrivateRoute"));
var MastersTable_1 = __importDefault(require("./components/Admin/controllerMaster/MastersTable"));
var OrderTable_1 = __importDefault(require("./components/Admin/controllerOrder/OrderTable"));
var UsersTable_1 = __importDefault(require("./components/Admin/controllerUser/UsersTable"));
var RateMasters_1 = __importDefault(require("./components/rateMasters/RateMasters"));
var react_toast_notifications_1 = require("react-toast-notifications");
var masterRegistration_1 = __importDefault(require("./components/Master/masterRegistration/masterRegistration"));
var masterWorkList_1 = __importDefault(require("./components/Master/masterWorkList/masterWorkList"));
var Calendar_1 = __importDefault(require("./components/calendar/Calendar"));
var UserList_1 = __importDefault(require("./components/User/userList/UserList"));
function App() {
    return (<react_toast_notifications_1.ToastProvider placement="top-right">
      <react_router_dom_1.BrowserRouter>
        <react_router_dom_1.Switch>
          <PrivateRoute_1["default"] path="/role/user/:id?" component={UserList_1["default"]}/>

          <PrivateRoute_1["default"] path="/role/master/:id?" component={masterWorkList_1["default"]}/>

          <react_router_dom_1.Route path="/master/registration"> <Header_1["default"] /> <masterRegistration_1["default"] /> </react_router_dom_1.Route>

          <react_router_dom_1.Route path="/" exact> <Header_1["default"] /> <Form_1["default"] /> </react_router_dom_1.Route>

          <react_router_dom_1.Route path="/calendar/:masterId?" exact>  <Calendar_1["default"] /> </react_router_dom_1.Route>

          <react_router_dom_1.Route path="/rate/:feedbackToken"> <Header_1["default"] /> <RateMasters_1["default"] /> </react_router_dom_1.Route>

          <PrivateRoute_1["default"] path="/admin/navCity/:id?/:name?" component={AllControllerCity_1["default"]}/>

          <PrivateRoute_1["default"] path="/admin/navMaster/:id?/:cityId?/:name?" component={AllControllerMaster_1["default"]}/>

          <PrivateRoute_1["default"] path='/admin/users' component={UsersTable_1["default"]}/>

          <PrivateRoute_1["default"] path="/admin/orders" component={OrderTable_1["default"]}/>

          <PrivateRoute_1["default"] path="/admin/navOrder/:id?/:userId?/:masterId?/:cityId?/:clockSizeId?/:startAt?/:price?/:status?" component={AllControllerOrder_1["default"]}/>

          <PrivateRoute_1["default"] path="/admin/navUser/:id?/:userName?/:userEmail?" component={AllControllerUser_1["default"]}/>

          <PrivateRoute_1["default"] path="/admin/masters" component={MastersTable_1["default"]}/>

          <PrivateRoute_1["default"] path="/admin/cities" component={CitiesTable_1["default"]}/>

          <react_router_dom_1.Route path="/login"> <Header_1["default"] /> <Login_1["default"] /></react_router_dom_1.Route>
        </react_router_dom_1.Switch>
      </react_router_dom_1.BrowserRouter>
    </react_toast_notifications_1.ToastProvider>);
}
exports["default"] = App;
//# sourceMappingURL=App.js.map