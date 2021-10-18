"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = require("express");
var router = (0, express_1.Router)();
var master_controller_1 = __importDefault(require("../controller/master.controller"));
router.get('/getFreeMasters', master_controller_1["default"].getFreeMasters);
router.post('/masterRegistration', master_controller_1["default"].createMasters);
// router.get('/getRating', masterController.getRating)
// router.get(
//     '/getMasterById',
//     ValidationMaster.validateGetMasterById,
//     masterController.getMasterById,
//   )
// router.put('/updateMasterRating', masterController.updateMasterRating)
exports["default"] = router;
//# sourceMappingURL=master.routes.js.map