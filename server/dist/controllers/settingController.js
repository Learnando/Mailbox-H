"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateGlobalMessage = exports.getGlobalMessage = void 0;
const Setting_1 = __importDefault(require("../models/Setting"));
const getGlobalMessage = async (req, res, next) => {
    try {
        let setting = await Setting_1.default.findOne();
        if (!setting) {
            setting = await Setting_1.default.create({ globalMessage: "" });
        }
        res.json({ message: setting.globalMessage });
    }
    catch (err) {
        next(err);
    }
};
exports.getGlobalMessage = getGlobalMessage;
const updateGlobalMessage = async (req, res, next) => {
    try {
        console.log("📥 Received request to update message:");
        console.log("👉 req.body:", req.body);
        const { message } = req.body;
        if (typeof message !== "string") {
            console.log("❌ Message is not a string:", message);
            res.status(400).json({ error: "Message must be a string" });
            return;
        }
        let setting = await Setting_1.default.findOne();
        if (!setting) {
            console.log("ℹ️ No existing setting found. Creating new...");
            setting = await Setting_1.default.create({ globalMessage: message });
        }
        else {
            console.log("✏️ Updating existing setting...");
            setting.globalMessage = message;
            await setting.save();
        }
        console.log("✅ Message saved successfully:", setting.globalMessage);
        res.status(200).json({
            success: true,
            message: "Global message updated.",
            globalMessage: setting.globalMessage,
        });
    }
    catch (err) {
        console.error("🔥 Failed to update global message:", err);
        next(err);
    }
};
exports.updateGlobalMessage = updateGlobalMessage;
