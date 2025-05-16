import express from "express";
import SupportMessage from "../models/SupportMessage";

const router = express.Router();

// POST /api/support
router.post("/", async (req, res) => {
  const { name, email, phone, message } = req.body;
  try {
    const newMessage = await SupportMessage.create({
      name,
      email,
      phone,
      message,
    });
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ error: "Failed to save message" });
  }
});

// GET /api/support (admin only)
router.get("/", async (req, res) => {
  try {
    const messages = await SupportMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to load messages" });
  }
});

// DELETE /api/support/:id
router.delete("/:id", async (req, res) => {
  try {
    await SupportMessage.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete message" });
  }
});

export default router;
