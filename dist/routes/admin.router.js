"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = require("express");
var router = (0, express_1.Router)();
var auth_controller_1 = __importDefault(require("../controller/auth.controller"));
var order_controller_1 = __importDefault(require("../controller/order.controller"));
var master_controller_1 = __importDefault(require("../controller/master.controller"));
var city_controller_1 = __importDefault(require("../controller/city.controller"));
var user_controller_1 = __importDefault(require("../controller/user.controller"));
router.put('/admin/order', auth_controller_1["default"].checkAccessToken, order_controller_1["default"].updateOrder);
router.get('/admin/getFreeMasters', auth_controller_1["default"].checkAccessToken, master_controller_1["default"].getFreeMastersForPutOrder);
router.put('/admin/deleteOrder', auth_controller_1["default"].checkAccessToken, order_controller_1["default"].deleteOrder);
router.get('/admin/order', auth_controller_1["default"].checkAccessToken, order_controller_1["default"].getOrder); // where i need this??
router.get('/admin/allOrder', auth_controller_1["default"].checkAccessToken, order_controller_1["default"].getAllOrder);
router.get('/admin/allOrderFiltred', auth_controller_1["default"].checkAccessToken, order_controller_1["default"].getAllOrderFiltred);
router.put('/admin/master', auth_controller_1["default"].checkAccessToken, master_controller_1["default"].updateMaster);
router["delete"]('/admin/master', auth_controller_1["default"].checkAccessToken, master_controller_1["default"].deleteMaster);
router.get('/admin/master', auth_controller_1["default"].checkAccessToken, master_controller_1["default"].getMasters);
router.post('/admin/city', auth_controller_1["default"].checkAccessToken, city_controller_1["default"].createCity);
router.put('/admin/city', auth_controller_1["default"].checkAccessToken, city_controller_1["default"].updateCity);
router["delete"]('/admin/city', auth_controller_1["default"].checkAccessToken, city_controller_1["default"].deleteCity);
router.get('/admin/user', auth_controller_1["default"].checkAccessToken, user_controller_1["default"].getUsers);
router.put('/admin/user', auth_controller_1["default"].checkAccessToken, user_controller_1["default"].updateUser);
router["delete"]('/admin/user', auth_controller_1["default"].checkAccessToken, user_controller_1["default"].deleteUser);
exports["default"] = router;
//# sourceMappingURL=admin.router.js.map