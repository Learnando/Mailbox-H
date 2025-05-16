import express from "express";
import {
  getGlobalMessage,
  updateGlobalMessage,
} from "../controllers/settingController";

const router = express.Router();

router.get("/global-message", getGlobalMessage);
router.post("/global-message", updateGlobalMessage); // Admin only

export default router;
