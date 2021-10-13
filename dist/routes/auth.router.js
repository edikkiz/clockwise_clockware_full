"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = require("express");
var router = (0, express_1.Router)();
var auth_controller_1 = __importDefault(require("../controller/auth.controller"));
router.post('/login', auth_controller_1["default"].login);
exports["default"] = router;
//# sourceMappingURL=auth.router.js.map