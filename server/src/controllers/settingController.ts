import { Request, Response, NextFunction } from "express";
import Setting from "../models/Setting";

export const getGlobalMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let setting = await Setting.findOne();
    if (!setting) {
      setting = await Setting.create({ globalMessage: "" });
    }
    res.json({ message: setting.globalMessage });
  } catch (err) {
    next(err);
  }
};

export const updateGlobalMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log("📥 Received request to update message:");
    console.log("👉 req.body:", req.body);

    const { message } = req.body;

    if (typeof message !== "string") {
      console.log("❌ Message is not a string:", message);
      res.status(400).json({ error: "Message must be a string" });
      return;
    }

    let setting = await Setting.findOne();
    if (!setting) {
      console.log("ℹ️ No existing setting found. Creating new...");
      setting = await Setting.create({ globalMessage: message });
    } else {
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
  } catch (err) {
    console.error("🔥 Failed to update global message:", err);
    next(err);
  }
};
