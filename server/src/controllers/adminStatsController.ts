import { Request, Response } from "express";
import Package from "../models/Package";
import crypto from "crypto";
import User from "../models/User";

export const getPackagesByStatus = async (req: Request, res: Response) => {
  try {
    const stats = await Package.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const formattedStats: Record<string, number> = {};
    stats.forEach((item) => {
      formattedStats[item._id] = item.count;
    });

    res.json(formattedStats);
  } catch (error) {
    console.error("Error getting package stats", error);
    res.status(500).json({ message: "Failed to get package stats" });
  }
};

export const generateResetLinkForUser = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    const resetUrl = `https://yourfrontend.com/reset/${token}`;
    res.status(200).json({ resetUrl });
  } catch (err) {
    res.status(500).json({ message: "Error generating reset link" });
  }
};
