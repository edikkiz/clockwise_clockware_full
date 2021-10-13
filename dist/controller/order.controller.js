"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
var emailNotification_1 = __importDefault(require("../services/emailNotification"));
var uuid_1 = require("uuid");
var client_1 = require("@prisma/client");
var email_validator_1 = __importDefault(require("email-validator"));
var order_shape_1 = require("./order.shape");
var cloudinary_1 = require("../utils/cloudinary");
var bcrypt_1 = __importDefault(require("bcrypt"));
var regPrice = new RegExp("[0-9]");
var regName = new RegExp("[A-Za-zА-Яа-я]");
var date = new Date();
var hours = date.getHours();
var minutes = date.getMinutes();
var day = date.getDate();
var month = date.getMonth() + 1;
var year = date.getFullYear();
var correctDate = year + "-" + (month < 10 ? "0" + month : "" + month) + "-" + (day < 10 ? "0" + day : "" + day) + " " + (hours < 10 ? "0" + hours : "" + hours) + ":" + (minutes < 10 ? "0" + minutes : "" + minutes);
var corDate = new Date(correctDate + " UTC");
var prisma = new client_1.PrismaClient();
var OrderController = /** @class */ (function () {
    function OrderController() {
    }
    OrderController.prototype.getOrder = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var orders;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma.order.findMany()];
                    case 1:
                        orders = _a.sent();
                        res.status(200).json(orders);
                        return [2 /*return*/];
                }
            });
        });
    };
    OrderController.prototype.getOrderByFeedbackToken = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var params, feedbackToken, orderByFeedbackToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = order_shape_1.orderByFeedbackTokenSchema.safeParse(req.query);
                        if (!params.success) {
                            return [2 /*return*/];
                        }
                        feedbackToken = req.query.feedbackToken;
                        return [4 /*yield*/, prisma.$queryRaw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["SELECT users.id AS \"userId\", orders.id, masters.name AS \"masterName\", cities.name AS \"cityName\", \"clockSizes\".size, users.name AS \"userName\", users.email AS \"userEmail\", orders.price, (TO_CHAR(orders.\"startAt\",'YYYY-MM-DD THH24:MI')) AS \"startAt\", (TO_CHAR(orders.\"endAt\", 'YYYY-MM-DDT HH24:MI')) AS \"endAt\" FROM orders\n                INNER JOIN masters ON orders.\"masterId\" = masters.id\n                INNER JOIN cities ON orders.\"cityId\" = cities.id\n                INNER JOIN \"clockSizes\" ON orders.\"clockSizeId\" = \"clockSizes\".id\n                INNER JOIN users ON orders.\"userId\" = users.id\n                WHERE orders.\"feedbackToken\" = ", ""], ["SELECT users.id AS \"userId\", orders.id, masters.name AS \"masterName\", cities.name AS \"cityName\", \"clockSizes\".size, users.name AS \"userName\", users.email AS \"userEmail\", orders.price, (TO_CHAR(orders.\"startAt\",'YYYY-MM-DD THH24:MI')) AS \"startAt\", (TO_CHAR(orders.\"endAt\", \\'YYYY-MM-DDT HH24:MI'\\)) AS \"endAt\" FROM orders\n                INNER JOIN masters ON orders.\"masterId\" = masters.id\n                INNER JOIN cities ON orders.\"cityId\" = cities.id\n                INNER JOIN \"clockSizes\" ON orders.\"clockSizeId\" = \"clockSizes\".id\n                INNER JOIN users ON orders.\"userId\" = users.id\n                WHERE orders.\"feedbackToken\" = ", ""])), feedbackToken)];
                    case 1:
                        orderByFeedbackToken = _a.sent();
                        res.status(200).json(orderByFeedbackToken);
                        return [2 /*return*/];
                }
            });
        });
    };
    OrderController.prototype.getClockSizes = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var clockSizes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma.clockSize.findMany()];
                    case 1:
                        clockSizes = _a.sent();
                        res.status(200).json(clockSizes);
                        return [2 /*return*/];
                }
            });
        });
    };
    OrderController.prototype.getAllOrderFiltred = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var params, _a, offset, limit, cityId, masterId, clockSizeId, status, filterStart, filterEnd, filterStartAt, filterEndAt, Orders;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        params = order_shape_1.allOrderFiltredSchema.safeParse(req.query);
                        if (!params.success) {
                            return [2 /*return*/];
                        }
                        _a = params.data, offset = _a.offset, limit = _a.limit, cityId = _a.cityId, masterId = _a.masterId, clockSizeId = _a.clockSizeId, status = _a.status, filterStart = _a.filterStart, filterEnd = _a.filterEnd;
                        filterStartAt = new Date(filterStart + " UTC");
                        filterEndAt = new Date(filterEnd + " 23:59:59");
                        return [4 /*yield*/, prisma.order.findMany({
                                where: {
                                    active: true,
                                    AND: [
                                        {
                                            cityId: cityId ? Number(cityId) : undefined
                                        },
                                        {
                                            masterId: masterId ? Number(masterId) : undefined
                                        },
                                        {
                                            clockSizeId: clockSizeId
                                                ? Number(clockSizeId)
                                                : undefined
                                        },
                                        {
                                            status: status ? status : undefined
                                        },
                                        {
                                            startAt: filterStart
                                                ? { gte: filterStartAt }
                                                : undefined
                                        },
                                        {
                                            endAt: filterEnd ? { lte: filterEndAt } : undefined
                                        },
                                    ]
                                },
                                orderBy: [{ id: 'desc' }],
                                take: Number(limit),
                                skip: Number(offset),
                                select: {
                                    images: true,
                                    id: true,
                                    status: true,
                                    feedback: true,
                                    rating: true,
                                    price: true,
                                    startAt: true,
                                    endAt: true,
                                    master: {
                                        select: {
                                            id: true,
                                            name: true
                                        }
                                    },
                                    clockSize: {
                                        select: {
                                            id: true,
                                            size: true
                                        }
                                    },
                                    user: {
                                        select: {
                                            id: true,
                                            name: true,
                                            email: true
                                        }
                                    },
                                    city: {
                                        select: {
                                            id: true,
                                            name: true
                                        }
                                    }
                                }
                            })];
                    case 1:
                        Orders = _b.sent();
                        res.status(200).json(Orders);
                        return [2 /*return*/];
                }
            });
        });
    };
    OrderController.prototype.getAllOrder = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var params, _a, offset, limit, orders;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        params = order_shape_1.allOrderSchema.safeParse(req.query);
                        if (!params.success) {
                            return [2 /*return*/];
                        }
                        _a = params.data, offset = _a.offset, limit = _a.limit;
                        return [4 /*yield*/, prisma.order.findMany({
                                where: {
                                    active: true
                                },
                                orderBy: [{ id: 'desc' }],
                                take: Number(limit),
                                skip: Number(offset),
                                select: {
                                    images: true,
                                    id: true,
                                    status: true,
                                    feedback: true,
                                    rating: true,
                                    price: true,
                                    startAt: true,
                                    endAt: true,
                                    master: {
                                        select: {
                                            id: true,
                                            name: true
                                        }
                                    },
                                    clockSize: {
                                        select: {
                                            id: true,
                                            size: true
                                        }
                                    },
                                    user: {
                                        select: {
                                            id: true,
                                            name: true,
                                            email: true
                                        }
                                    },
                                    city: {
                                        select: {
                                            id: true,
                                            name: true
                                        }
                                    }
                                }
                            })];
                    case 1:
                        orders = _b.sent();
                        res.status(200).json(orders);
                        return [2 /*return*/];
                }
            });
        });
    };
    OrderController.prototype.getAllOrdersToTheMasterTable = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var params, _a, offset, limit, masterId, orderListForOneMaster, masterId, orderListForOneMaster;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        params = order_shape_1.allOrdersToTheMasterSchema.safeParse(req.query);
                        if (!params.success) return [3 /*break*/, 2];
                        _a = params.data, offset = _a.offset, limit = _a.limit, masterId = _a.masterId;
                        return [4 /*yield*/, prisma.$queryRaw(templateObject_2 || (templateObject_2 = __makeTemplateObject(["SELECT orders.id, orders.status, orders.feedback, orders.rating, \"clockSizeId\", orders.\"cityId\", masters.id AS \"masterId\", users.id AS \"userId\", masters.name AS \"masterName\", cities.name AS \"cityName\", \"clockSizes\".size, users.name AS \"userName\", users.email AS \"userEmail\", orders.price, (TO_CHAR(orders.\"startAt\",'YYYY-MM-DD HH24:MI')) AS \"startAt\", (TO_CHAR(orders.\"endAt\", 'YYYY-MM-DD HH24:MI')) AS \"endAt\", email FROM orders\n                                                INNER JOIN masters ON orders.\"masterId\" = masters.id\n                                                INNER JOIN cities ON orders.\"cityId\" = cities.id\n                                                INNER JOIN \"clockSizes\" ON orders.\"clockSizeId\" = \"clockSizes\".id\n                                                INNER JOIN users ON orders.\"userId\" = users.id\n                                                WHERE orders.\"masterId\" = ", " AND orders.active = true\n                                                ORDER BY orders.id DESC LIMIT ", " OFFSET ", ""], ["SELECT orders.id, orders.status, orders.feedback, orders.rating, \"clockSizeId\", orders.\"cityId\", masters.id AS \"masterId\", users.id AS \"userId\", masters.name AS \"masterName\", cities.name AS \"cityName\", \"clockSizes\".size, users.name AS \"userName\", users.email AS \"userEmail\", orders.price, (TO_CHAR(orders.\"startAt\",'YYYY-MM-DD HH24:MI')) AS \"startAt\", (TO_CHAR(orders.\"endAt\", \\'YYYY-MM-DD HH24:MI'\\)) AS \"endAt\", email FROM orders\n                                                INNER JOIN masters ON orders.\"masterId\" = masters.id\n                                                INNER JOIN cities ON orders.\"cityId\" = cities.id\n                                                INNER JOIN \"clockSizes\" ON orders.\"clockSizeId\" = \"clockSizes\".id\n                                                INNER JOIN users ON orders.\"userId\" = users.id\n                                                WHERE orders.\"masterId\" = ", " AND orders.active = true\n                                                ORDER BY orders.id DESC LIMIT ", " OFFSET ", ""])), Number(masterId), Number(limit), Number(offset))];
                    case 1:
                        orderListForOneMaster = _b.sent();
                        res.status(200).json(orderListForOneMaster);
                        return [3 /*break*/, 4];
                    case 2:
                        masterId = req.query.masterId;
                        return [4 /*yield*/, prisma.$queryRaw(templateObject_3 || (templateObject_3 = __makeTemplateObject(["SELECT (TO_CHAR(orders.id, '\"Order#\"99999')) AS title, orders.status, orders.feedback, orders.rating, masters.name AS \"masterName\", cities.name AS \"cityName\", \"clockSizes\".size, users.name AS \"userName\", users.email AS \"userEmail\", orders.price, (TO_CHAR(orders.\"startAt\",'YYYY-MM-DD HH24:MI')) AS \"start\", (TO_CHAR(orders.\"endAt\", 'YYYY-MM-DD HH24:MI')) AS \"end\", email FROM orders\n                                                INNER JOIN masters ON orders.\"masterId\" = masters.id\n                                                INNER JOIN cities ON orders.\"cityId\" = cities.id\n                                                INNER JOIN \"clockSizes\" ON orders.\"clockSizeId\" = \"clockSizes\".id\n                                                INNER JOIN users ON orders.\"userId\" = users.id\n                                                WHERE orders.\"masterId\" = ", " AND orders.active = true\n                                                ORDER BY orders.id"], ["SELECT (TO_CHAR(orders.id, '\"Order#\"99999')) AS title, orders.status, orders.feedback, orders.rating, masters.name AS \"masterName\", cities.name AS \"cityName\", \"clockSizes\".size, users.name AS \"userName\", users.email AS \"userEmail\", orders.price, (TO_CHAR(orders.\"startAt\",'YYYY-MM-DD HH24:MI')) AS \"start\", (TO_CHAR(orders.\"endAt\", \\'YYYY-MM-DD HH24:MI'\\)) AS \"end\", email FROM orders\n                                                INNER JOIN masters ON orders.\"masterId\" = masters.id\n                                                INNER JOIN cities ON orders.\"cityId\" = cities.id\n                                                INNER JOIN \"clockSizes\" ON orders.\"clockSizeId\" = \"clockSizes\".id\n                                                INNER JOIN users ON orders.\"userId\" = users.id\n                                                WHERE orders.\"masterId\" = ", " AND orders.active = true\n                                                ORDER BY orders.id"])), Number(masterId))];
                    case 3:
                        orderListForOneMaster = _b.sent();
                        res.status(200).json(orderListForOneMaster);
                        _b.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    OrderController.prototype.getAllOrdersToTheUserTable = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, offset, limit, userId, orderListForOneUser;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        order_shape_1.allOrdersToTheUserSchema.parse(req.query);
                        _a = req.query, offset = _a.offset, limit = _a.limit, userId = _a.userId;
                        return [4 /*yield*/, prisma.$queryRaw(templateObject_4 || (templateObject_4 = __makeTemplateObject(["SELECT orders.\"feedbackToken\" AS \"feedbackToken\", orders.id, orders.status, orders.feedback, orders.rating, \"clockSizeId\", orders.\"cityId\", masters.id AS \"masterId\", users.id AS \"userId\", masters.name AS \"masterName\", cities.name AS \"cityName\", \"clockSizes\".size, users.name AS \"userName\", users.email AS \"userEmail\", orders.price, (TO_CHAR(orders.\"startAt\",'YYYY-MM-DD HH24:MI')) AS \"startAt\", (TO_CHAR(orders.\"endAt\", 'YYYY-MM-DD HH24:MI')) AS \"endAt\", email FROM orders\n                                                INNER JOIN masters ON orders.\"masterId\" = masters.id\n                                                INNER JOIN cities ON orders.\"cityId\" = cities.id\n                                                INNER JOIN \"clockSizes\" ON orders.\"clockSizeId\" = \"clockSizes\".id\n                                                INNER JOIN users ON orders.\"userId\" = users.id\n                                                WHERE orders.\"userId\" = ", " AND orders.active = true\n                                                ORDER BY orders.id DESC LIMIT ", " OFFSET ", ""], ["SELECT orders.\"feedbackToken\" AS \"feedbackToken\", orders.id, orders.status, orders.feedback, orders.rating, \"clockSizeId\", orders.\"cityId\", masters.id AS \"masterId\", users.id AS \"userId\", masters.name AS \"masterName\", cities.name AS \"cityName\", \"clockSizes\".size, users.name AS \"userName\", users.email AS \"userEmail\", orders.price, (TO_CHAR(orders.\"startAt\",'YYYY-MM-DD HH24:MI')) AS \"startAt\", (TO_CHAR(orders.\"endAt\", \\'YYYY-MM-DD HH24:MI'\\)) AS \"endAt\", email FROM orders\n                                                INNER JOIN masters ON orders.\"masterId\" = masters.id\n                                                INNER JOIN cities ON orders.\"cityId\" = cities.id\n                                                INNER JOIN \"clockSizes\" ON orders.\"clockSizeId\" = \"clockSizes\".id\n                                                INNER JOIN users ON orders.\"userId\" = users.id\n                                                WHERE orders.\"userId\" = ", " AND orders.active = true\n                                                ORDER BY orders.id DESC LIMIT ", " OFFSET ", ""])), Number(userId), Number(limit), Number(offset))];
                    case 1:
                        orderListForOneUser = _b.sent();
                        res.status(200).json(orderListForOneUser);
                        return [2 /*return*/];
                }
            });
        });
    };
    OrderController.prototype.createOrder = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var params, _a, masterId, cityId, clockSizeId, startAt, name, email, validationErrors, date, master, city, clockSize, fileStr, imagesUrls, clockInfo, feedbackToken, price, workTime, d, newOrderStartAt, endAt, user, newOrder, password, salt, hash, newUserRole, newUser, newOrder;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        params = order_shape_1.createOrderSchema.safeParse(req.body);
                        if (!params.success) {
                            return [2 /*return*/];
                        }
                        _a = params.data, masterId = _a.masterId, cityId = _a.cityId, clockSizeId = _a.clockSizeId, startAt = _a.startAt, name = _a.name, email = _a.email;
                        validationErrors = [];
                        date = new Date(startAt + " UTC");
                        return [4 /*yield*/, prisma.master.findUnique({
                                where: { id: Number(masterId) }
                            })];
                    case 1:
                        master = _b.sent();
                        return [4 /*yield*/, prisma.city.findUnique({
                                where: { id: Number(cityId) }
                            })];
                    case 2:
                        city = _b.sent();
                        return [4 /*yield*/, prisma.clockSize.findUnique({
                                where: { id: Number(clockSizeId) }
                            })];
                    case 3:
                        clockSize = _b.sent();
                        if (!master) {
                            validationErrors.push("Master with id: " + masterId + " is not exsisted");
                        }
                        if (!city) {
                            validationErrors.push("City with id: " + cityId + " is not exsisted");
                        }
                        if (!clockSize) {
                            validationErrors.push("Clock size with id: " + clockSizeId + " is not exsisted");
                        }
                        if (!regName.test(name)) {
                            validationErrors.push('Invalid name');
                        }
                        if (date.getMinutes() !== 0 ||
                            date.getSeconds() !== 0 ||
                            date.getMilliseconds() !== 0 ||
                            date < corDate) {
                            validationErrors.push('Invalid date or time');
                        }
                        if (!email_validator_1["default"].validate(email)) {
                            validationErrors.push('Invalid email');
                        }
                        if (!validationErrors.length) return [3 /*break*/, 4];
                        res.status(400).json(validationErrors);
                        return [3 /*break*/, 15];
                    case 4:
                        fileStr = req.body.images;
                        return [4 /*yield*/, Promise.all(fileStr.map(function (image) { return cloudinary_1.cloudinary.v2.uploader.upload(image); }))];
                    case 5:
                        imagesUrls = (_b.sent()).map(function (response) { return response.url; });
                        return [4 /*yield*/, prisma.clockSize.findUnique({ where: { id: Number(clockSizeId) } })];
                    case 6:
                        clockInfo = _b.sent();
                        feedbackToken = (0, uuid_1.v4)();
                        if (!clockInfo) return [3 /*break*/, 15];
                        price = Number(clockInfo.price);
                        workTime = clockInfo.timeToDone;
                        d = new Date(startAt + " UTC");
                        newOrderStartAt = new Date(startAt + " UTC");
                        d.setHours(d.getHours() + workTime);
                        endAt = d;
                        return [4 /*yield*/, prisma.user.findUnique({
                                where: { email: email }
                            })];
                    case 7:
                        user = _b.sent();
                        if (!user) return [3 /*break*/, 10];
                        return [4 /*yield*/, prisma.order.create({
                                data: {
                                    userId: user.id,
                                    masterId: Number(masterId),
                                    cityId: Number(cityId),
                                    clockSizeId: Number(clockSizeId),
                                    price: price,
                                    startAt: newOrderStartAt,
                                    endAt: endAt,
                                    feedbackToken: feedbackToken,
                                    images: imagesUrls
                                }
                            })];
                    case 8:
                        newOrder = _b.sent();
                        return [4 /*yield*/, emailNotification_1["default"].sendMail({
                                from: process.env.NOTIFICATION_EMAIL,
                                to: email,
                                subject: 'confirm your order',
                                text: 'confirm order',
                                html: "<p>Click <a href=\"" + process.env.SITE_URL + "/rate/" + feedbackToken + "\">here</a> to rate work</p>"
                            })];
                    case 9:
                        _b.sent();
                        res.status(201).json(newOrder);
                        _b.label = 10;
                    case 10:
                        if (!!user) return [3 /*break*/, 15];
                        password = (0, uuid_1.v4)();
                        salt = bcrypt_1["default"].genSaltSync(10);
                        hash = bcrypt_1["default"].hashSync(password, salt);
                        return [4 /*yield*/, prisma.person.create({
                                data: {
                                    login: email,
                                    password: hash,
                                    role: "USER"
                                }
                            })];
                    case 11:
                        newUserRole = _b.sent();
                        return [4 /*yield*/, prisma.user.create({
                                data: {
                                    name: name,
                                    email: email,
                                    personId: Number(newUserRole.id)
                                }
                            })];
                    case 12:
                        newUser = _b.sent();
                        return [4 /*yield*/, prisma.order.create({
                                data: {
                                    userId: newUser.id,
                                    masterId: Number(masterId),
                                    cityId: Number(cityId),
                                    clockSizeId: Number(clockSizeId),
                                    price: price,
                                    startAt: newOrderStartAt,
                                    endAt: endAt,
                                    feedbackToken: feedbackToken,
                                    images: imagesUrls
                                }
                            })];
                    case 13:
                        newOrder = _b.sent();
                        return [4 /*yield*/, emailNotification_1["default"].sendMail({
                                from: process.env.NOTIFICATION_EMAIL,
                                to: email,
                                subject: 'confirm your order',
                                text: "confirm order",
                                html: "<p>your password: " + password + "</p>"
                            })];
                    case 14:
                        _b.sent();
                        res.status(201).json(newOrder);
                        _b.label = 15;
                    case 15: return [2 /*return*/];
                }
            });
        });
    };
    OrderController.prototype.feedbackUpdate = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, feedbackText, rating, id, orderWithFeedback;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, feedbackText = _a.feedbackText, rating = _a.rating, id = _a.id;
                        return [4 /*yield*/, prisma.order.update({
                                where: {
                                    id: Number(id)
                                },
                                data: {
                                    feedback: feedbackText,
                                    rating: Number(rating),
                                    feedbackToken: ''
                                }
                            })];
                    case 1:
                        orderWithFeedback = _b.sent();
                        res.status(201).json(orderWithFeedback);
                        return [2 /*return*/];
                }
            });
        });
    };
    OrderController.prototype.updateOrder = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var params, _a, id, userId, masterId, cityId, clockSizeId, price, startAt, status, validationErrors, order, user, master, city, clockSize, user_1, clockInfo, workTime, d, newOrderEndAt, newOrderStartAt, upOrder, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        params = order_shape_1.updateOrderSchema.safeParse(req.body);
                        if (!params.success) {
                            return [2 /*return*/];
                        }
                        _a = params.data, id = _a.id, userId = _a.userId, masterId = _a.masterId, cityId = _a.cityId, clockSizeId = _a.clockSizeId, price = _a.price, startAt = _a.startAt, status = _a.status;
                        validationErrors = [];
                        return [4 /*yield*/, prisma.order.findUnique({
                                where: { id: Number(id) }
                            })];
                    case 1:
                        order = _c.sent();
                        return [4 /*yield*/, prisma.user.findUnique({
                                where: { id: Number(userId) }
                            })];
                    case 2:
                        user = _c.sent();
                        return [4 /*yield*/, prisma.master.findUnique({
                                where: { id: Number(masterId) }
                            })];
                    case 3:
                        master = _c.sent();
                        return [4 /*yield*/, prisma.city.findUnique({
                                where: { id: Number(cityId) }
                            })];
                    case 4:
                        city = _c.sent();
                        return [4 /*yield*/, prisma.clockSize.findUnique({
                                where: { id: Number(clockSizeId) }
                            })];
                    case 5:
                        clockSize = _c.sent();
                        if (typeof price !== 'number') {
                            validationErrors.push('Invalid price');
                        }
                        if (!order) {
                            validationErrors.push("Order with id: " + id + " is not exsisted");
                        }
                        if (!user) {
                            validationErrors.push("User with id: " + userId + " is not exsisted");
                        }
                        if (!master) {
                            validationErrors.push("Master with id: " + masterId + " is not exsisted");
                        }
                        if (!city) {
                            validationErrors.push("City with id: " + cityId + " is not exsisted");
                        }
                        if (!clockSize) {
                            validationErrors.push("Clock size with id: " + clockSizeId + " is not exsisted");
                        }
                        if (!validationErrors.length) return [3 /*break*/, 6];
                        res.status(400).json(validationErrors);
                        return [3 /*break*/, 12];
                    case 6: return [4 /*yield*/, prisma.user.findUnique({
                            where: { id: Number(userId) }
                        })];
                    case 7:
                        user_1 = _c.sent();
                        return [4 /*yield*/, prisma.clockSize.findUnique({
                                where: {
                                    id: clockSizeId
                                }
                            })];
                    case 8:
                        clockInfo = _c.sent();
                        if (!clockInfo) return [3 /*break*/, 12];
                        workTime = clockInfo.timeToDone;
                        d = new Date(startAt + " UTC");
                        d.setHours(d.getHours() + workTime);
                        newOrderEndAt = d.toISOString();
                        newOrderStartAt = new Date(startAt + " UTC");
                        return [4 /*yield*/, prisma.order.update({
                                where: {
                                    id: Number(id)
                                },
                                data: {
                                    userId: Number(userId),
                                    masterId: Number(masterId),
                                    cityId: Number(cityId),
                                    clockSizeId: Number(clockSizeId),
                                    price: Number(price),
                                    startAt: newOrderStartAt,
                                    endAt: newOrderEndAt,
                                    status: status
                                }
                            })];
                    case 9:
                        upOrder = _c.sent();
                        _b = status === "COMPLETED";
                        if (!_b) return [3 /*break*/, 11];
                        return [4 /*yield*/, emailNotification_1["default"].sendMail({
                                from: process.env.NOTIFICATION_EMAIL,
                                to: user_1 === null || user_1 === void 0 ? void 0 : user_1.email,
                                subject: 'your order now has a status completed',
                                text: 'your order now has a status completed',
                                html: "<p>Click <a href=\"" + process.env.SITE_URL + "/rate/" + (order === null || order === void 0 ? void 0 : order.feedbackToken) + "\">here</a> to rate work</p>"
                            })];
                    case 10:
                        _b = (_c.sent());
                        _c.label = 11;
                    case 11:
                        _b;
                        res.status(201).json(upOrder);
                        _c.label = 12;
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    OrderController.prototype.updateOrderStatus = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var params, _a, id, email, validationErrors, order, orderWithNewStatus;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        params = order_shape_1.updateOrderStatusSchema.safeParse(req.body);
                        if (!params.success) {
                            return [2 /*return*/];
                        }
                        _a = params.data, id = _a.id, email = _a.email;
                        validationErrors = [];
                        return [4 /*yield*/, prisma.order.findUnique({
                                where: { id: Number(id) }
                            })];
                    case 1:
                        order = _b.sent();
                        if (!order) {
                            validationErrors.push("Order with id: " + id + " is not exsisted");
                        }
                        if (!validationErrors.length) return [3 /*break*/, 2];
                        res.status(400).json(validationErrors);
                        return [3 /*break*/, 5];
                    case 2: return [4 /*yield*/, prisma.order.update({
                            where: {
                                id: Number(id)
                            },
                            data: {
                                status: 'COMPLETED'
                            }
                        })];
                    case 3:
                        orderWithNewStatus = _b.sent();
                        return [4 /*yield*/, emailNotification_1["default"].sendMail({
                                from: process.env.NOTIFICATION_EMAIL,
                                to: email,
                                subject: 'your order now has a status completed',
                                text: 'your order now has a status completed, you can rate master',
                                html: "<p>Click <a href=\"" + process.env.SITE_URL + "/rate/" + (order === null || order === void 0 ? void 0 : order.feedbackToken) + "\">here</a> to rate work</p>"
                            })];
                    case 4:
                        _b.sent();
                        res.status(200).json(orderWithNewStatus);
                        _b.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    OrderController.prototype.deleteOrder = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var params, id, delOrder;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = order_shape_1.deleteOrderSchema.safeParse(req.body);
                        if (!params.success) {
                            return [2 /*return*/];
                        }
                        id = params.data.id;
                        return [4 /*yield*/, prisma.order.update({
                                where: {
                                    id: Number(id)
                                },
                                data: {
                                    active: false
                                }
                            })];
                    case 1:
                        delOrder = _a.sent();
                        res.status(204).json(delOrder);
                        return [2 /*return*/];
                }
            });
        });
    };
    return OrderController;
}());
exports["default"] = new OrderController();
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
//# sourceMappingURL=order.controller.js.map