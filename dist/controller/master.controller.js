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
var client_1 = require("@prisma/client");
var bcrypt_1 = __importDefault(require("bcrypt"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var zod_1 = require("zod");
var email_validator_1 = __importDefault(require("email-validator"));
var master_shape_1 = require("./master.shape");
var regName = new RegExp("[A-Za-zА-Яа-я]");
var regPasswordWithOneNumb = new RegExp("[0-9]{1,}");
var regPasswordWithOneSymbol = new RegExp("[$.,#@&^%()*!}{/]{1,}");
var prisma = new client_1.PrismaClient();
var MasterController = /** @class */ (function () {
    function MasterController() {
    }
    MasterController.prototype.getMasters = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, limit, offset, masters, _b, masters;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 4]);
                        master_shape_1.getMastersSchema.parse(req.query);
                        _a = req.query, limit = _a.limit, offset = _a.offset;
                        return [4 /*yield*/, prisma.master.findMany({
                                skip: Number(offset),
                                take: Number(limit)
                            })];
                    case 1:
                        masters = _c.sent();
                        res.status(200).json(masters);
                        return [3 /*break*/, 4];
                    case 2:
                        _b = _c.sent();
                        return [4 /*yield*/, prisma.master.findMany()];
                    case 3:
                        masters = _c.sent();
                        res.status(200).json(masters);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    MasterController.prototype.getFreeMasters = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var params, _a, cityId, startAt, clockSizeId, timeToDone, plusTime, d, newOrderEndAt, newOrderStartAt, gOrderMasterId, busyMastersId, allFreeMaster_1, allFreeMastersWithRating, x, result, allFreeMaster_2, allFreeMastersWithRating, x, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        params = master_shape_1.getFreeMastersSchema.safeParse(req.query);
                        if (!params.success) {
                            return [2 /*return*/];
                        }
                        _a = params.data, cityId = _a.cityId, startAt = _a.startAt, clockSizeId = _a.clockSizeId;
                        return [4 /*yield*/, prisma.clockSize.findUnique({
                                where: {
                                    id: Number(clockSizeId)
                                }
                            })];
                    case 1:
                        timeToDone = _b.sent();
                        if (!timeToDone) return [3 /*break*/, 6];
                        plusTime = timeToDone.timeToDone;
                        d = new Date(startAt + " UTC");
                        d.setHours(d.getHours() + plusTime);
                        newOrderEndAt = d;
                        newOrderStartAt = new Date(startAt + " UTC");
                        return [4 /*yield*/, prisma.order.findMany({
                                where: {
                                    cityId: Number(cityId),
                                    AND: {
                                        OR: [{
                                                startAt: { lt: newOrderEndAt },
                                                AND: { endAt: { gt: newOrderEndAt } }
                                            },
                                            {
                                                startAt: { lt: newOrderStartAt },
                                                AND: { endAt: { gt: newOrderStartAt }
                                                }
                                            },
                                            {
                                                startAt: newOrderStartAt
                                            }
                                        ]
                                    }
                                }
                            })];
                    case 2:
                        gOrderMasterId = _b.sent();
                        busyMastersId = gOrderMasterId.map(function (elem) { return elem.masterId; });
                        if (!busyMastersId) return [3 /*break*/, 5];
                        return [4 /*yield*/, prisma.master.findMany({
                                where: {
                                    id: { notIn: busyMastersId.map(function (elem) { return elem; }) },
                                    cityId: Number(cityId)
                                }
                            })];
                    case 3:
                        allFreeMaster_1 = _b.sent();
                        return [4 /*yield*/, prisma.$queryRaw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      SELECT \"masters\".\"id\", \"masters\".\"name\", \"masters\".\"cityId\", AVG(\"orders\".\"rating\") AS \"rating\" from \"masters\"\n                                      INNER JOIN \"orders\" ON \"masters\".\"id\" = \"orders\".\"masterId\"\n                                      WHERE \"masters\".\"cityId\" = ", " AND \"masters\".\"id\" NOT IN (", ")\n                                      GROUP BY \"masters\".\"id\"\n      "], ["\n      SELECT \"masters\".\"id\", \"masters\".\"name\", \"masters\".\"cityId\", AVG(\"orders\".\"rating\") AS \"rating\" from \"masters\"\n                                      INNER JOIN \"orders\" ON \"masters\".\"id\" = \"orders\".\"masterId\"\n                                      WHERE \"masters\".\"cityId\" = ", " AND \"masters\".\"id\" NOT IN (", ")\n                                      GROUP BY \"masters\".\"id\"\n      "])), Number(cityId), Number(busyMastersId.join(',')))];
                    case 4:
                        allFreeMastersWithRating = _b.sent();
                        x = allFreeMastersWithRating.filter(function (elem) { var _a; return elem.id != ((_a = allFreeMaster_1.find(function (element) { return element.id === elem.id; })) === null || _a === void 0 ? void 0 : _a.id); });
                        result = x.concat(allFreeMaster_1);
                        res.status(200).json(result);
                        _b.label = 5;
                    case 5: return [3 /*break*/, 9];
                    case 6: return [4 /*yield*/, prisma.master.findMany({
                            where: {
                                cityId: Number(cityId)
                            }
                        })];
                    case 7:
                        allFreeMaster_2 = _b.sent();
                        return [4 /*yield*/, prisma.$queryRaw(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n      SELECT masters.id, masters.name, masters.\"cityId\", AVG(orders.rating) AS rating from masters\n                                      INNER JOIN orders ON masters.id = orders.\"masterId\"\n                                      WHERE masters.\"cityId\" = ", "\n                                      GROUP BY masters.id\n      "], ["\n      SELECT masters.id, masters.name, masters.\"cityId\", AVG(orders.rating) AS rating from masters\n                                      INNER JOIN orders ON masters.id = orders.\"masterId\"\n                                      WHERE masters.\"cityId\" = ", "\n                                      GROUP BY masters.id\n      "])), Number(cityId))];
                    case 8:
                        allFreeMastersWithRating = _b.sent();
                        x = allFreeMastersWithRating.filter(function (elem) { var _a; return elem.id != ((_a = allFreeMaster_2.find(function (element) { return element.id === elem.id; })) === null || _a === void 0 ? void 0 : _a.id); });
                        result = x.concat(allFreeMaster_2);
                        res.status(200).json(result);
                        _b.label = 9;
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    MasterController.prototype.getFreeMastersForPutOrder = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var params, _a, cityId, startAt, clockSizeId, orderId, timeToDone, plusTime, d, newOrderEndAt, newOrderStartAt, masterIdInOrders, busyMastersId, allFreeMaster_3, allFreeMastersWithRating, x, result, allFreeMaster_4, allFreeMastersWithRating, x, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        params = master_shape_1.getFreeMastersForPutOrderSchema.safeParse(req.query);
                        if (!params.success) {
                            return [2 /*return*/];
                        }
                        _a = params.data, cityId = _a.cityId, startAt = _a.startAt, clockSizeId = _a.clockSizeId, orderId = _a.orderId;
                        return [4 /*yield*/, prisma.clockSize.findMany({
                                where: {
                                    id: Number(clockSizeId)
                                }
                            })];
                    case 1:
                        timeToDone = _b.sent();
                        plusTime = timeToDone[0].timeToDone;
                        d = new Date(startAt + " UTC");
                        d.setHours(d.getHours() + plusTime);
                        newOrderEndAt = d;
                        newOrderStartAt = new Date(startAt + " UTC");
                        return [4 /*yield*/, prisma.order.findMany({
                                where: {
                                    cityId: Number(cityId),
                                    NOT: { id: Number(orderId) },
                                    AND: {
                                        OR: [{
                                                startAt: { lt: newOrderEndAt },
                                                AND: { endAt: { gt: newOrderEndAt } }
                                            },
                                            {
                                                startAt: { lt: newOrderStartAt },
                                                AND: { endAt: { gt: newOrderStartAt } }
                                            },
                                            {
                                                startAt: newOrderStartAt
                                            }
                                        ]
                                    }
                                }
                            })];
                    case 2:
                        masterIdInOrders = _b.sent();
                        busyMastersId = masterIdInOrders.map(function (elem) { return elem.masterId; });
                        if (!(busyMastersId.length !== 0)) return [3 /*break*/, 5];
                        return [4 /*yield*/, prisma.master.findMany({
                                where: {
                                    id: { notIn: busyMastersId },
                                    cityId: Number(cityId)
                                }
                            })];
                    case 3:
                        allFreeMaster_3 = _b.sent();
                        return [4 /*yield*/, prisma.$queryRaw(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n          SELECT masters.id, masters.name, masters.\"cityId\", AVG(orders.rating) AS rating from masters\n                                          INNER JOIN orders ON masters.id = orders.\"masterId\"\n                                          WHERE masters.\"cityId\" = ", " AND masters.id NOT IN (\n                                          ", ")\n                                          GROUP BY masters.id\n                                          "], ["\n          SELECT masters.id, masters.name, masters.\"cityId\", AVG(orders.rating) AS rating from masters\n                                          INNER JOIN orders ON masters.id = orders.\"masterId\"\n                                          WHERE masters.\"cityId\" = ", " AND masters.id NOT IN (\n                                          ", ")\n                                          GROUP BY masters.id\n                                          "])), Number(cityId), Number(busyMastersId.join(',')))];
                    case 4:
                        allFreeMastersWithRating = _b.sent();
                        x = allFreeMastersWithRating.filter(function (elem) { var _a; return elem.id != ((_a = allFreeMaster_3.find(function (element) { return element.id === elem.id; })) === null || _a === void 0 ? void 0 : _a.id); });
                        result = x.concat(allFreeMaster_3);
                        res.status(200).json(result);
                        return [3 /*break*/, 8];
                    case 5: return [4 /*yield*/, prisma.master.findMany({
                            where: {
                                cityId: Number(cityId)
                            }
                        })];
                    case 6:
                        allFreeMaster_4 = _b.sent();
                        return [4 /*yield*/, prisma.$queryRaw(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n          SELECT masters.id, masters.name, masters.\"cityId\", AVG(orders.rating) AS rating from masters\n                                      INNER JOIN orders ON masters.id = orders.\"masterId\"\n                                      WHERE masters.\"cityId\" = ", "\n                                      GROUP BY masters.id\n          "], ["\n          SELECT masters.id, masters.name, masters.\"cityId\", AVG(orders.rating) AS rating from masters\n                                      INNER JOIN orders ON masters.id = orders.\"masterId\"\n                                      WHERE masters.\"cityId\" = ", "\n                                      GROUP BY masters.id\n          "])), Number(cityId))];
                    case 7:
                        allFreeMastersWithRating = _b.sent();
                        x = allFreeMastersWithRating.filter(function (elem) { var _a; return elem.id != ((_a = allFreeMaster_4.find(function (element) { return element.id === elem.id; })) === null || _a === void 0 ? void 0 : _a.id); });
                        result = x.concat(allFreeMaster_4);
                        res.status(200).json(result);
                        _b.label = 8;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    MasterController.prototype.createMasters = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var params, _a, name, cityId, login, password, confirmPassword, validationErrors, PasswordWithOneNumb, PasswordWithOneSymbol, validName, masterValidateUpper, masterValidateLower, city, isUnique, token, salt2, hash, newPersonMaste, newMaster;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        params = master_shape_1.createMasterSchema.safeParse(req.body);
                        if (!params.success) {
                            return [2 /*return*/];
                        }
                        _a = params.data, name = _a.name, cityId = _a.cityId, login = _a.login, password = _a.password, confirmPassword = _a.confirmPassword;
                        validationErrors = [];
                        PasswordWithOneNumb = zod_1.z.string().regex(regPasswordWithOneNumb);
                        PasswordWithOneSymbol = zod_1.z.string().regex(regPasswordWithOneSymbol);
                        validName = zod_1.z.string().regex(regName);
                        masterValidateUpper = zod_1.z["function"]().args(zod_1.z.string()).implement(function (arg) {
                            return arg.toLowerCase() === arg;
                        });
                        masterValidateLower = zod_1.z["function"]().args(zod_1.z.string()).implement(function (arg) {
                            return arg.toUpperCase() === arg;
                        });
                        return [4 /*yield*/, prisma.city.findUnique({ where: { id: Number(cityId) } })];
                    case 1:
                        city = _b.sent();
                        return [4 /*yield*/, prisma.person.findUnique({ where: { login: login } })];
                    case 2:
                        isUnique = _b.sent();
                        if (isUnique) {
                            validationErrors.push("Master with this email exsist");
                        }
                        if (confirmPassword !== password) {
                            validationErrors.push("Those passwords didn\u2019t match");
                        }
                        if (!PasswordWithOneNumb.safeParse(password)) {
                            validationErrors.push("Password must 1 or more number");
                        }
                        if (masterValidateUpper(password)) {
                            validationErrors.push("Password must 1 or more symbol upper case ");
                        }
                        if (masterValidateLower(password)) {
                            validationErrors.push("Password must 1 or more symbol lower case");
                        }
                        if (!PasswordWithOneSymbol.safeParse(password)) {
                            validationErrors.push("Password must 1 or more symbol " + "[.,/\$#@&^%()*!}{}]");
                        }
                        if (!email_validator_1["default"].validate(login)) {
                            validationErrors.push("this email does not exsisted");
                        }
                        if (!city) {
                            validationErrors.push("City with id: " + cityId + " is not exsisted");
                        }
                        if (!validName.safeParse(name)) {
                            validationErrors.push('Invalid master name');
                        }
                        if (!validationErrors.length) return [3 /*break*/, 3];
                        res.status(400).json(validationErrors);
                        return [3 /*break*/, 6];
                    case 3:
                        token = jsonwebtoken_1["default"].sign({}, process.env.SECRET_KEY ? process.env.SECRET_KEY : "key", { expiresIn: '2h' });
                        salt2 = bcrypt_1["default"].genSaltSync(10);
                        hash = bcrypt_1["default"].hashSync(password, salt2);
                        return [4 /*yield*/, prisma.person.create({
                                data: {
                                    login: login,
                                    password: hash,
                                    role: "MASTER",
                                    token: token
                                }
                            })];
                    case 4:
                        newPersonMaste = _b.sent();
                        return [4 /*yield*/, prisma.master.create({
                                data: {
                                    name: name,
                                    cityId: +cityId,
                                    personId: +newPersonMaste.id
                                }
                            })];
                    case 5:
                        newMaster = _b.sent();
                        res.set({ Authorization: "Bearer " + token }).status(200).json(newMaster);
                        _b.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    MasterController.prototype.updateMaster = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var params, _a, id, name, cityId, validationErrors, city, master, upMaster;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        params = master_shape_1.updateMasterSchema.safeParse(req.body);
                        if (!params.success) {
                            return [2 /*return*/];
                        }
                        _a = params.data, id = _a.id, name = _a.name, cityId = _a.cityId;
                        validationErrors = [];
                        return [4 /*yield*/, prisma.city.findUnique({ where: { id: Number(cityId) } })];
                    case 1:
                        city = _b.sent();
                        return [4 /*yield*/, prisma.master.findUnique({ where: { id: Number(id) } })];
                    case 2:
                        master = _b.sent();
                        if (!city) {
                            validationErrors.push("City with id: " + cityId + " is not exsisted");
                        }
                        if (!regName.test(name)) {
                            validationErrors.push('Invalid master name');
                        }
                        if (!master) {
                            validationErrors.push("Master with id: " + id + " is not exsisted");
                        }
                        if (!validationErrors.length) return [3 /*break*/, 3];
                        res.status(400).json(validationErrors);
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, prisma.master.update({
                            where: {
                                id: Number(id)
                            },
                            data: {
                                name: name,
                                cityId: Number(cityId)
                            }
                        })];
                    case 4:
                        upMaster = _b.sent();
                        res.status(201).json(upMaster);
                        _b.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    MasterController.prototype.deleteMaster = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var params, id, validationErrors, master, delMaster;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = master_shape_1.deleteMasterSchema.safeParse(req.body);
                        if (!params.success) {
                            return [2 /*return*/];
                        }
                        id = params.data.id;
                        validationErrors = [];
                        return [4 /*yield*/, prisma.master.findUnique({ where: { id: Number(id) } })];
                    case 1:
                        master = _a.sent();
                        if (!master) {
                            validationErrors.push("Master with id: " + id + " is not exsisted");
                        }
                        if (!validationErrors.length) return [3 /*break*/, 2];
                        res.status(400).json(validationErrors);
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, prisma.master["delete"]({ where: { id: Number(id) } })];
                    case 3:
                        delMaster = _a.sent();
                        res.status(204).json(delMaster);
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return MasterController;
}());
exports["default"] = new MasterController();
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
//# sourceMappingURL=master.controller.js.map