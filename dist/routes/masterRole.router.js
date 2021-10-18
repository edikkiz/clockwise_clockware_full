"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = require("express");
var router = (0, express_1.Router)();
var auth_controller_1 = __importDefault(require("../controller/auth.controller"));
var order_controller_1 = __importDefault(require("../controller/order.controller"));
router.put('/master/reStatus', auth_controller_1["default"].checkAccessToken, order_controller_1["default"].updateOrderStatus);
router.get('/master/allMasterOrder', auth_controller_1["default"].checkAccessToken, order_controller_1["default"].getAllOrdersToTheMasterTable);
exports["default"] = router;
//# sourceMappingURL=masterRole.router.js.map