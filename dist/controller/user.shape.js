"use strict";
exports.__esModule = true;
exports.getUsersSchema = exports.deleteUserSchema = exports.updateUserSchema = exports.createUserSchema = void 0;
var zod_1 = require("zod");
var createUserShape = {
    name: zod_1.z.string(),
    email: zod_1.z.string()
};
exports.createUserSchema = zod_1.z.object(createUserShape);
var updateUserShape = {
    id: zod_1.z.number().int().nonnegative(),
    name: zod_1.z.string(),
    email: zod_1.z.string()
};
exports.updateUserSchema = zod_1.z.object(updateUserShape);
var deleteUserShape = {
    id: zod_1.z.number().int().nonnegative()
};
exports.deleteUserSchema = zod_1.z.object(deleteUserShape);
var getUsersShape = {
    limit: zod_1.z.string(),
    offset: zod_1.z.string()
};
exports.getUsersSchema = zod_1.z.object(getUsersShape);
//# sourceMappingURL=user.shape.js.map