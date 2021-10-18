"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.cloudinary = void 0;
require('dotenv').config();
var cloudinary_1 = __importDefault(require("cloudinary"));
exports.cloudinary = cloudinary_1["default"];
cloudinary_1["default"].v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});
//# sourceMappingURL=cloudinary.js.map