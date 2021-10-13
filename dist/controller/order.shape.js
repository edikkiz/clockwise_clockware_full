"use strict";
exports.__esModule = true;
exports.updateOrderStatusSchema = exports.allOrdersToTheUserSchema = exports.allOrdersToTheMasterSchema = exports.allOrderFiltredSchema = exports.allOrderSchema = exports.orderByFeedbackTokenSchema = exports.deleteOrderSchema = exports.updateOrderSchema = exports.createOrderSchema = void 0;
var client_1 = require(".prisma/client");
var zod_1 = require("zod");
var createOrderShape = {
    cityId: zod_1.z.number().int().nonnegative(),
    masterId: zod_1.z.number().int().nonnegative(),
    clockSizeId: zod_1.z.number().int().nonnegative(),
    startAt: zod_1.z.string(),
    name: zod_1.z.string(),
    email: zod_1.z.string()
};
exports.createOrderSchema = zod_1.z.object(createOrderShape);
var updateOrderShape = {
    id: zod_1.z.number().int().nonnegative(),
    cityId: zod_1.z.number().int().nonnegative(),
    masterId: zod_1.z.number().int().nonnegative(),
    userId: zod_1.z.number().int().nonnegative(),
    clockSizeId: zod_1.z.number().int().nonnegative(),
    startAt: zod_1.z.string(),
    price: zod_1.z.number(),
    status: zod_1.z.nativeEnum(client_1.OrderStatus).optional()
};
exports.updateOrderSchema = zod_1.z.object(updateOrderShape);
var deleteOrderShape = {
    id: zod_1.z.number().int().nonnegative()
};
exports.deleteOrderSchema = zod_1.z.object(deleteOrderShape);
var orderByFeedbackTokenShape = {
    feedbackToken: zod_1.z.string()
};
exports.orderByFeedbackTokenSchema = zod_1.z.object(orderByFeedbackTokenShape);
var allOrderShape = {
    limit: zod_1.z.string(),
    offset: zod_1.z.string(),
    masterId: zod_1.z.string().optional()
};
exports.allOrderSchema = zod_1.z.object(allOrderShape);
var allOrderFiltredShape = {
    limit: zod_1.z.string(),
    offset: zod_1.z.string(),
    masterId: zod_1.z.string().optional(),
    cityId: zod_1.z.string().optional(),
    clockSizeId: zod_1.z.string().optional(),
    status: zod_1.z.nativeEnum(client_1.OrderStatus).optional(),
    filterStart: zod_1.z.string().optional(),
    filterEnd: zod_1.z.string().optional()
};
exports.allOrderFiltredSchema = zod_1.z.object(allOrderFiltredShape);
var allOrdersToTheMasterShape = {
    limit: zod_1.z.string(),
    offset: zod_1.z.string(),
    masterId: zod_1.z.string()
};
exports.allOrdersToTheMasterSchema = zod_1.z.object(allOrdersToTheMasterShape);
var allOrdersToTheUserShape = {
    limit: zod_1.z.string(),
    offset: zod_1.z.string(),
    userId: zod_1.z.string()
};
exports.allOrdersToTheUserSchema = zod_1.z.object(allOrdersToTheUserShape);
var updateOrderStatusShape = {
    id: zod_1.z.number().int().nonnegative(),
    email: zod_1.z.string()
};
exports.updateOrderStatusSchema = zod_1.z.object(updateOrderStatusShape);
//# sourceMappingURL=order.shape.js.map