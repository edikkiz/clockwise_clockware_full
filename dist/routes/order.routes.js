"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = require("express");
var router = (0, express_1.Router)();
var order_controller_1 = __importDefault(require("../controller/order.controller"));
router.get('/clockSizes', order_controller_1["default"].getClockSizes);
router.get('/getOrderForFeedback', order_controller_1["default"].getOrderByFeedbackToken);
router.put('/updateFeedbackOrder', order_controller_1["default"].feedbackUpdate);
router.post('/order', order_controller_1["default"].createOrder);
exports["default"] = router;
//# sourceMappingURL=order.routes.js.map