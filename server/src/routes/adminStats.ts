import express from "express";
import { getPackagesByStatus } from "../controllers/adminStatsController";
import { adminOnly } from "../middleware/admin";
import { protect } from "../middleware/protect"; // ✅ Import protect
import { generateResetLinkForUser } from "../controllers/adminController";
import { getPackageStats } from "../controllers/adminController";

const router = express.Router();

// ✅ Must be logged in + Must be admin
router.get("/packages-by-status", protect, adminOnly, getPackagesByStatus);
router.post("/generate-reset-link", generateResetLinkForUser);
router.get("/packages-by-status", getPackageStats);

export default router;
