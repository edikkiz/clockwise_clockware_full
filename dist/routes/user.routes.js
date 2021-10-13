"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = require("express");
var router = (0, express_1.Router)();
var user_controller_1 = __importDefault(require("../controller/user.controller"));
router.post('/user', user_controller_1["default"].createUser);
exports["default"] = router;
//# sourceMappingURL=user.routes.js.map