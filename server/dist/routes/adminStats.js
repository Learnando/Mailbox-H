"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminStatsController_1 = require("../controllers/adminStatsController");
const admin_1 = require("../middleware/admin");
const protect_1 = require("../middleware/protect"); // ✅ Import protect
const adminController_1 = require("../controllers/adminController");
const adminController_2 = require("../controllers/adminController");
const router = express_1.default.Router();
// ✅ Must be logged in + Must be admin
router.get("/packages-by-status", protect_1.protect, admin_1.adminOnly, adminStatsController_1.getPackagesByStatus);
router.post("/generate-reset-link", adminController_1.generateResetLinkForUser);
router.get("/packages-by-status", adminController_2.getPackageStats);
exports.default = router;
