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
var bcrypt_1 = __importDefault(require("bcrypt"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
var saltRounds = 10;
var exp = { expiresIn: '2h' };
var AuthController = /** @class */ (function () {
    function AuthController() {
    }
    AuthController.prototype.checkAccessToken = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var token, role;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!process.env.SECRET_KEY) {
                            throw new Error('Secret jwt key is not provided');
                        }
                        if (!req.headers.authorization) return [3 /*break*/, 4];
                        token = req.headers.authorization.split(' ')[1];
                        if (!!token) return [3 /*break*/, 1];
                        res.status(401).send();
                        return [3 /*break*/, 3];
                    case 1:
                        if (!jsonwebtoken_1["default"].verify(token, process.env.SECRET_KEY)) return [3 /*break*/, 3];
                        return [4 /*yield*/, prisma.person.findMany({
                                where: {
                                    token: token
                                }
                            })];
                    case 2:
                        role = _a.sent();
                        if (!role) {
                            res.status(401).send();
                        }
                        if ((req.url.split('/')[1] === 'admin' &&
                            role[0].role === 'ADMIN') ||
                            (req.url.split('/')[1] === 'master' &&
                                role[0].role === 'MASTER') ||
                            (req.url.split('/')[1] === 'user' &&
                                role[0].role === 'USER')) {
                            next();
                        }
                        _a.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        res.status(401).send();
                        _a.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    AuthController.prototype.login = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, email, password, foundPerson, dbPass, ifCompare, token, masterPassword, ifCompare, token, master, result, userPassword, ifCompare, token, user, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, email = _a.email, password = _a.password;
                        if (!process.env.SECRET_KEY) {
                            throw new Error('Secret jwt key is not provided');
                        }
                        return [4 /*yield*/, prisma.person.findUnique({
                                where: {
                                    login: email
                                }
                            })];
                    case 1:
                        foundPerson = _b.sent();
                        if (!((foundPerson === null || foundPerson === void 0 ? void 0 : foundPerson.role) === 'ADMIN')) return [3 /*break*/, 6];
                        dbPass = foundPerson.password;
                        return [4 /*yield*/, bcrypt_1["default"].compare(password, dbPass)];
                    case 2:
                        ifCompare = _b.sent();
                        if (!ifCompare) return [3 /*break*/, 4];
                        token = jsonwebtoken_1["default"].sign({}, process.env.SECRET_KEY, exp);
                        return [4 /*yield*/, prisma.person.update({
                                where: {
                                    id: foundPerson.id
                                },
                                data: {
                                    token: token
                                }
                            })];
                    case 3:
                        _b.sent();
                        res.set({
                            Authorization: "Bearer " + token
                        })
                            .status(200)
                            .json(foundPerson);
                        return [3 /*break*/, 5];
                    case 4:
                        res.status(400).json({
                            massage: 'login or password is not valid'
                        });
                        _b.label = 5;
                    case 5: return [3 /*break*/, 18];
                    case 6:
                        if (!((foundPerson === null || foundPerson === void 0 ? void 0 : foundPerson.role) === 'MASTER')) return [3 /*break*/, 11];
                        masterPassword = foundPerson.password;
                        return [4 /*yield*/, bcrypt_1["default"].compare(password, masterPassword)];
                    case 7:
                        ifCompare = _b.sent();
                        if (!ifCompare) return [3 /*break*/, 10];
                        token = jsonwebtoken_1["default"].sign({}, process.env.SECRET_KEY, exp);
                        return [4 /*yield*/, prisma.master.findMany({
                                where: {
                                    personId: +foundPerson.id
                                }
                            })];
                    case 8:
                        master = _b.sent();
                        result = {
                            role: foundPerson.role,
                            name: master[0].name,
                            id: master[0].id
                        };
                        return [4 /*yield*/, prisma.person.update({
                                where: {
                                    id: foundPerson.id
                                },
                                data: {
                                    token: token
                                }
                            })];
                    case 9:
                        _b.sent();
                        res.set({ Authorization: "Bearer " + token })
                            .status(200)
                            .json(result);
                        _b.label = 10;
                    case 10: return [3 /*break*/, 18];
                    case 11:
                        if (!((foundPerson === null || foundPerson === void 0 ? void 0 : foundPerson.role) === 'USER')) return [3 /*break*/, 17];
                        userPassword = foundPerson.password;
                        return [4 /*yield*/, bcrypt_1["default"].compare(password, userPassword)];
                    case 12:
                        ifCompare = _b.sent();
                        if (!ifCompare) return [3 /*break*/, 15];
                        token = jsonwebtoken_1["default"].sign({}, process.env.SECRET_KEY, exp);
                        return [4 /*yield*/, prisma.user.findMany({
                                where: {
                                    personId: +foundPerson.id
                                }
                            })];
                    case 13:
                        user = _b.sent();
                        result = {
                            role: foundPerson.role,
                            name: user[0].name,
                            id: user[0].id
                        };
                        return [4 /*yield*/, prisma.person.update({
                                where: {
                                    id: foundPerson.id
                                },
                                data: {
                                    token: token
                                }
                            })];
                    case 14:
                        _b.sent();
                        res.set({ Authorization: "Bearer " + token })
                            .status(200)
                            .json(result);
                        return [3 /*break*/, 16];
                    case 15:
                        res.status(400).json({
                            massage: 'login or password is not valid'
                        });
                        _b.label = 16;
                    case 16: return [3 /*break*/, 18];
                    case 17:
                        res.status(400).send();
                        _b.label = 18;
                    case 18: return [2 /*return*/];
                }
            });
        });
    };
    return AuthController;
}());
exports["default"] = new AuthController();
//# sourceMappingURL=auth.controller.js.map