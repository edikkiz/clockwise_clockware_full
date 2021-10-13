"use strict";
exports.__esModule = true;
exports.getFreeMastersForPutOrderSchema = exports.getFreeMastersSchema = exports.getMastersSchema = exports.deleteMasterSchema = exports.updateMasterSchema = exports.createMasterSchema = void 0;
var zod_1 = require("zod");
var createMasterShape = {
    cityId: zod_1.z.number().int().nonnegative(),
    name: zod_1.z.string(),
    login: zod_1.z.string(),
    password: zod_1.z.string(),
    confirmPassword: zod_1.z.string()
};
exports.createMasterSchema = zod_1.z.object(createMasterShape);
var updateMasterShape = {
    id: zod_1.z.number().int().nonnegative(),
    cityId: zod_1.z.number().int().nonnegative(),
    name: zod_1.z.string()
};
exports.updateMasterSchema = zod_1.z.object(updateMasterShape);
var deleteMasterShape = {
    id: zod_1.z.number().int().nonnegative()
};
exports.deleteMasterSchema = zod_1.z.object(deleteMasterShape);
var getMastersShape = {
    limit: zod_1.z.string(),
    offset: zod_1.z.string()
};
exports.getMastersSchema = zod_1.z.object(getMastersShape);
var getFreeMastersShape = {
    cityId: zod_1.z.string(),
    startAt: zod_1.z.string(),
    clockSizeId: zod_1.z.string()
};
exports.getFreeMastersSchema = zod_1.z.object(getFreeMastersShape);
var getFreeMastersForPutOrderShape = {
    orderId: zod_1.z.string(),
    cityId: zod_1.z.string(),
    startAt: zod_1.z.string(),
    clockSizeId: zod_1.z.string()
};
exports.getFreeMastersForPutOrderSchema = zod_1.z.object(getFreeMastersForPutOrderShape);
//# sourceMappingURL=master.shape.js.map