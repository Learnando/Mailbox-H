"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const SupportMessage_1 = __importDefault(require("../models/SupportMessage"));
const router = express_1.default.Router();
// POST /api/support
router.post("/", async (req, res) => {
    const { name, email, phone, message } = req.body;
    try {
        const newMessage = await SupportMessage_1.default.create({
            name,
            email,
            phone,
            message,
        });
        res.status(201).json(newMessage);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to save message" });
    }
});
// GET /api/support (admin only)
router.get("/", async (req, res) => {
    try {
        const messages = await SupportMessage_1.default.find().sort({ createdAt: -1 });
        res.json(messages);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to load messages" });
    }
});
// DELETE /api/support/:id
router.delete("/:id", async (req, res) => {
    try {
        await SupportMessage_1.default.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to delete message" });
    }
});
exports.default = router;
