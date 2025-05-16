import { Request, Response } from "express";
import crypto from "crypto";
import User from "../models/User";
import Package from "../models/Package";

export const generateResetLinkForUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    const resetUrl = `https://yourfrontend.com/reset/${token}`;
    res.status(200).json({ resetUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPackageStats = async (req: Request, res: Response) => {
  try {
    const stats = await Package.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json(stats);
  } catch (err) {
    console.error("Error fetching package stats:", err);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
};
