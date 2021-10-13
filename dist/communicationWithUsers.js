"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var cron_1 = require("cron");
var emailNotification_1 = __importDefault(require("./services/emailNotification"));
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
var communicateStartWork = new cron_1.CronJob('0 55 */1 * * *', function () {
    var date = new Date();
    var minutes = date.getMinutes() + 5;
    var hours = date.getHours();
    if (minutes >= 60) {
        hours = hours + 1;
        minutes = minutes - 60;
    }
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    var correctDate = year + "-" + (month < 10 ? "0" + month : "" + month) + "-" + (day < 10 ? "0" + day : "" + day) + " " + (hours < 10 ? "0" + hours : "" + hours) + ":" + (minutes < 10 ? "0" + minutes : "" + minutes);
    var corDate = new Date(correctDate + " UTC");
    var communicate = function () { return __awaiter(void 0, void 0, void 0, function () {
        var orders;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma.order.findMany()];
                case 1:
                    orders = _a.sent();
                    return [4 /*yield*/, Promise.all(orders.map(function (elem) { return __awaiter(void 0, void 0, void 0, function () {
                            var startAt, email;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        startAt = new Date(elem.startAt + " UTC");
                                        if (!(startAt.toISOString() === corDate.toISOString())) return [3 /*break*/, 3];
                                        return [4 /*yield*/, prisma.user.findUnique({ where: { id: elem.userId } })];
                                    case 1:
                                        email = _a.sent();
                                        if (!email) return [3 /*break*/, 3];
                                        return [4 /*yield*/, emailNotification_1["default"].sendMail({
                                                from: process.env.NOTIFICATION_EMAIL,
                                                to: email.email,
                                                subject: '5 minutes before the arrival of the master',
                                                text: '5 minutes before the arrival of the master'
                                            })];
                                    case 2:
                                        _a.sent();
                                        _a.label = 3;
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    communicate();
});
communicateStartWork.start();
// const communicateEndWork = new CronJob('0 0 */1 * * *', () =>  {
//     const date = new Date()
//     const hours = date.getHours()
//     const minutes = date.getMinutes()
//     const day = date.getDate()
//     const month = date.getMonth() + 1
//     const year = date.getFullYear()
//     const correctDate = `${year}-${month < 10 ? `0${month}` : `${month}`}-${day < 10 ? `0${day}` : `${day}`} ${hours < 10 ? `0${hours}` : `${hours}`}:${minutes < 10 ? `0${minutes}` : `${minutes}`}`
//     const corDate = new Date(`${correctDate} UTC`)
//     const communicate = async () => {
//         const orders = await db.query('SELECT "endAt", "userId", "masterId" FROM orders')
//         await Promise.all(orders.rows.map( async (elem) => {
//             const endAtTime = new Date(`${elem.endAt} UTC`)
//             if(endAtTime.toISOString() === corDate.toISOString()) {
//                 const email = await db.query('SELECT email FROM users WHERE id = $1', [elem.userId])
//                 await transporter.sendMail({
//                     from: process.env.NOTIFICATION_EMAIL,
//                     to: email.rows[0].email,
//                     subject: 'appreciate the work of the master',
//                     html: `<p>Click <a href="${process.env.SITE_URL}/rate/${elem.masterId}">here</a> to rate work</p>`
//                 })
//             }
//           }))
//         }
//     communicate()
// })
// communicateEndWork.start()
//# sourceMappingURL=communicationWithUsers.js.map