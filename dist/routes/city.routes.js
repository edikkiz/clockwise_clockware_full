"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = require("express");
var router = (0, express_1.Router)();
var city_controller_1 = __importDefault(require("../controller/city.controller"));
router.get('/city', city_controller_1["default"].getCities);
exports["default"] = router;
//# sourceMappingURL=city.routes.js.map