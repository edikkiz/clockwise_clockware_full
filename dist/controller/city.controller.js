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
exports.__esModule = true;
var client_1 = require("@prisma/client");
var city_shape_1 = require("./city.shape");
var regName = new RegExp("[A-Za-zА-Яа-я]");
var prisma = new client_1.PrismaClient();
var CityController = /** @class */ (function () {
    function CityController() {
    }
    CityController.prototype.getCities = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var params, _a, limit, offset, cities, getCity;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        params = city_shape_1.getCitiesSchema.safeParse(req.query);
                        if (!params.success) return [3 /*break*/, 2];
                        _a = params.data, limit = _a.limit, offset = _a.offset;
                        return [4 /*yield*/, prisma.city.findMany({
                                skip: Number(offset),
                                take: Number(limit)
                            })];
                    case 1:
                        cities = _b.sent();
                        res.status(200).json(cities);
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, prisma.city.findMany()];
                    case 3:
                        getCity = _b.sent();
                        res.status(200).json(getCity);
                        _b.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    CityController.prototype.createCity = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var params, name, validationErrors, city, newCity;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = city_shape_1.createCitySchema.safeParse(req.body);
                        if (!params.success) {
                            return [2 /*return*/];
                        }
                        name = params.data.name;
                        validationErrors = [];
                        return [4 /*yield*/, prisma.city.findUnique({ where: { name: name } })];
                    case 1:
                        city = _a.sent();
                        if (city) {
                            validationErrors.push("city with name: " + name + " exsist");
                        }
                        if (!regName.test(name)) {
                            validationErrors.push('Invalid city name');
                        }
                        if (!validationErrors.length) return [3 /*break*/, 2];
                        res.status(400).json(validationErrors);
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, prisma.city.create({
                            data: {
                                name: name
                            }
                        })];
                    case 3:
                        newCity = _a.sent();
                        res.status(201).json(newCity);
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    CityController.prototype.updateCity = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var params, _a, id, name, validationErrors, city, updatedCity;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        params = city_shape_1.updateCitySchema.safeParse(req.body);
                        if (!params.success) {
                            return [2 /*return*/];
                        }
                        _a = params.data, id = _a.id, name = _a.name;
                        validationErrors = [];
                        return [4 /*yield*/, prisma.city.findUnique({ where: { id: Number(id) } })];
                    case 1:
                        city = _b.sent();
                        if (!city) {
                            validationErrors.push("City with id: " + id + " is not exsisted");
                        }
                        if (!regName.test(name)) {
                            validationErrors.push('Invalid city name');
                        }
                        if (!validationErrors.length) return [3 /*break*/, 2];
                        res.status(400).json(validationErrors);
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, prisma.city.update({
                            where: {
                                id: Number(id)
                            },
                            data: {
                                name: name
                            }
                        })];
                    case 3:
                        updatedCity = _b.sent();
                        res.status(201).json(updatedCity);
                        _b.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    CityController.prototype.deleteCity = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var params, id, validationErrors, city, deletedCity;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = city_shape_1.deleteCitySchema.safeParse(req.body);
                        if (!params.success) {
                            return [2 /*return*/];
                        }
                        id = params.data.id;
                        validationErrors = [];
                        return [4 /*yield*/, prisma.city.findUnique({ where: { id: Number(id) } })];
                    case 1:
                        city = _a.sent();
                        if (!city) {
                            validationErrors.push("City with id: " + id + " is not exsisted");
                        }
                        if (!validationErrors.length) return [3 /*break*/, 2];
                        res.status(400).json(validationErrors);
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, prisma.city["delete"]({
                            where: {
                                id: Number(id)
                            }
                        })];
                    case 3:
                        deletedCity = _a.sent();
                        res.status(204).json(deletedCity);
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return CityController;
}());
exports["default"] = new CityController();
//# sourceMappingURL=city.controller.js.map