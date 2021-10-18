"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var nodemailer_1 = __importDefault(require("nodemailer"));
var transporter = nodemailer_1["default"].createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    secure: true,
    port: 587,
    auth: {
        user: process.env.NOTIFICATION_EMAIL,
        pass: process.env.NOTIFICATION_PASS
    },
    logger: true
});
transporter.verify(function () {
    console.log("Server is ready to take our messages");
});
exports["default"] = transporter;
//# sourceMappingURL=emailNotification.js.map