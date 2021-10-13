"use strict";
exports.__esModule = true;
exports.getCitiesSchema = exports.deleteCitySchema = exports.updateCitySchema = exports.createCitySchema = void 0;
var zod_1 = require("zod");
var createCityShape = {
    name: zod_1.z.string()
};
exports.createCitySchema = zod_1.z.object(createCityShape);
var updateCityShape = {
    id: zod_1.z.number().int().nonnegative(),
    name: zod_1.z.string()
};
exports.updateCitySchema = zod_1.z.object(updateCityShape);
var deleteCityShape = {
    id: zod_1.z.number().int().nonnegative()
};
exports.deleteCitySchema = zod_1.z.object(deleteCityShape);
var getCitiesShape = {
    limit: zod_1.z.string(),
    offset: zod_1.z.string()
};
exports.getCitiesSchema = zod_1.z.object(getCitiesShape);
//# sourceMappingURL=city.shape.js.map