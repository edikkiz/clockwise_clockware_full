"use strict";
exports.__esModule = true;
var knex_1 = require("knex");
var Role;
(function (Role) {
    Role[Role["MASTER"] = 0] = "MASTER";
    Role[Role["ADMIN"] = 1] = "ADMIN";
})(Role || (Role = {}));
var OrderStatus;
(function (OrderStatus) {
    OrderStatus[OrderStatus["CREATED"] = 0] = "CREATED";
    OrderStatus[OrderStatus["INPROGRESS"] = 1] = "INPROGRESS";
    OrderStatus[OrderStatus["COMPLITED"] = 2] = "COMPLITED";
})(OrderStatus || (OrderStatus = {}));
var config = {
    client: 'pg',
    connection: process.env.DATABASE_LOCAL,
    searchPath: ['knex', 'public']
};
var knexInstance = (0, knex_1.knex)(config);
//# sourceMappingURL=knex.js.map