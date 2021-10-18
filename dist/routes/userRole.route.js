"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = require("express");
var router = (0, express_1.Router)();
var auth_controller_1 = __importDefault(require("../controller/auth.controller"));
var order_controller_1 = __importDefault(require("../controller/order.controller"));
router.get('/user/allUserOrder', auth_controller_1["default"].checkAccessToken, order_controller_1["default"].getAllOrdersToTheUserTable);
exports["default"] = router;
//# sourceMappingURL=userRole.route.js.map