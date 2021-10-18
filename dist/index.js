"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var PORT = process.env.PORT || 3333;
var user_routes_1 = __importDefault(require("./routes/user.routes"));
var city_routes_1 = __importDefault(require("./routes/city.routes"));
var order_routes_1 = __importDefault(require("./routes/order.routes"));
var master_routes_1 = __importDefault(require("./routes/master.routes"));
var auth_router_1 = __importDefault(require("./routes/auth.router"));
var admin_router_1 = __importDefault(require("./routes/admin.router"));
var masterRole_router_1 = __importDefault(require("./routes/masterRole.router"));
var userRole_route_1 = __importDefault(require("./routes/userRole.route"));
var cors_1 = __importDefault(require("cors"));
var startWorkCommunicate = require('./communicationWithUsers');
var app = (0, express_1["default"])();
app.use((0, cors_1["default"])({
    exposedHeaders: 'Authorization'
}));
app.use(express_1["default"].static("client/build"));
app.use(express_1["default"].json({ limit: '5mb' }));
app.use(express_1["default"].urlencoded({ limit: '5mb', extended: true }));
app.use('/api', user_routes_1["default"]);
app.use('/api', city_routes_1["default"]);
app.use('/api', order_routes_1["default"]);
app.use('/api', master_routes_1["default"]);
app.use('/api', auth_router_1["default"]);
app.use('/api', admin_router_1["default"]);
app.use('/api', masterRole_router_1["default"]);
app.use('/api', userRole_route_1["default"]);
app.listen(PORT, function () {
    console.log("server started on port " + PORT);
});
//# sourceMappingURL=index.js.map