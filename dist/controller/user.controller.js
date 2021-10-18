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
var client_1 = require("@prisma/client");
var user_shape_1 = require("./user.shape");
var email_validator_1 = __importDefault(require("email-validator"));
var uuid_1 = require("uuid");
var bcrypt_1 = __importDefault(require("bcrypt"));
var prisma = new client_1.PrismaClient();
var regName = new RegExp("[A-Za-zА-Яа-я]");
var UserController = /** @class */ (function () {
    function UserController() {
    }
    UserController.prototype.getUsers = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var params, _a, limit, offset, users;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        params = user_shape_1.getUsersSchema.safeParse(req.query);
                        if (!params.success) {
                            return [2 /*return*/];
                        }
                        _a = params.data, limit = _a.limit, offset = _a.offset;
                        return [4 /*yield*/, prisma.user.findMany({
                                take: Number(limit),
                                skip: Number(offset)
                            })];
                    case 1:
                        users = _b.sent();
                        res.status(200).json(users);
                        return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.createUser = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var params, _a, name, email, validationErrors, isUserExsist, password, salt, hash, newUserRole, newUser;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        params = user_shape_1.createUserSchema.safeParse(req.body);
                        if (!params.success) {
                            return [2 /*return*/];
                        }
                        _a = params.data, name = _a.name, email = _a.email;
                        validationErrors = [];
                        if (!regName.test(name)) {
                            validationErrors.push('Invalid name');
                        }
                        if (!email_validator_1["default"].validate(email)) {
                            validationErrors.push('Invalid email');
                        }
                        if (!validationErrors.length) return [3 /*break*/, 1];
                        res.status(400).json(validationErrors);
                        return [3 /*break*/, 6];
                    case 1: return [4 /*yield*/, prisma.user.findUnique({ where: { email: email } })];
                    case 2:
                        isUserExsist = _b.sent();
                        if (!!isUserExsist) return [3 /*break*/, 5];
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
                    case 3:
                        newUserRole = _b.sent();
                        return [4 /*yield*/, prisma.user.create({
                                data: {
                                    name: name,
                                    email: email,
                                    personId: Number(newUserRole.id)
                                }
                            })];
                    case 4:
                        newUser = _b.sent();
                        res.status(201).json(newUser);
                        return [3 /*break*/, 6];
                    case 5:
                        res.status(200).json(isUserExsist);
                        _b.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.updateUser = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var params, _a, name, email, id, validationErrors, user, upUser;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        params = user_shape_1.updateUserSchema.safeParse(req.body);
                        if (!params.success) {
                            return [2 /*return*/];
                        }
                        _a = params.data, name = _a.name, email = _a.email, id = _a.id;
                        validationErrors = [];
                        return [4 /*yield*/, prisma.user.findUnique({ where: { id: Number(id) } })];
                    case 1:
                        user = _b.sent();
                        if (!user) {
                            validationErrors.push("User with id: " + id + " is not exsisted");
                        }
                        if (!regName.test(name)) {
                            validationErrors.push('Invalit user name');
                        }
                        if (!email_validator_1["default"].validate(email)) {
                            validationErrors.push('Invalid user email');
                        }
                        if (!validationErrors.length) return [3 /*break*/, 2];
                        res.status(400).json(validationErrors);
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, prisma.user.update({
                            where: {
                                id: Number(id)
                            },
                            data: {
                                name: name,
                                email: email
                            }
                        })];
                    case 3:
                        upUser = _b.sent();
                        res.status(201).json(upUser);
                        _b.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.deleteUser = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var params, id, validationErrors, user, delUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = user_shape_1.deleteUserSchema.safeParse(req.body);
                        if (!params.success) {
                            return [2 /*return*/];
                        }
                        id = params.data.id;
                        validationErrors = [];
                        return [4 /*yield*/, prisma.user.findUnique({ where: { id: Number(id) } })];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            validationErrors.push("User with id: " + id + " is not exsisted");
                        }
                        if (!validationErrors.length) return [3 /*break*/, 2];
                        res.status(400).json(validationErrors);
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, prisma.user["delete"]({ where: { id: Number(id) } })];
                    case 3:
                        delUser = _a.sent();
                        res.status(204).json(delUser);
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return UserController;
}());
exports["default"] = new UserController();
//# sourceMappingURL=user.controller.js.map