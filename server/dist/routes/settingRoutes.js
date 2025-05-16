"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const settingController_1 = require("../controllers/settingController");
const router = express_1.default.Router();
router.get("/global-message", settingController_1.getGlobalMessage);
router.post("/global-message", settingController_1.updateGlobalMessage); // Admin only
exports.default = router;
