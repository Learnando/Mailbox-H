import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/User";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail";

// ✅ Generate token function
const generateToken = (id: string, isAdmin: boolean) => {
  return jwt.sign({ id, isAdmin }, process.env.JWT_SECRET!, {
    expiresIn: "30d",
  });
};

// ✅ Register Controller
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password, ref } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      res.status(409).json({ message: "User already exists" });
      return;
    }

    const virtualAddress = `HUB001-${Date.now().toString().slice(-6)}`;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      virtualAddress,
      referredBy: ref || null,
    });

    newUser.referralCode = `user${new mongoose.Types.ObjectId().toString().slice(-6)}`;
    await newUser.save();

    const token = generateToken(
      String(newUser._id), // ✅ FIXED HERE
      newUser.isAdmin || false
    );

    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      virtualAddress: newUser.virtualAddress,
      isAdmin: newUser.isAdmin,
      referralCode: newUser.referralCode,
      credits: newUser.credits,
      token,
    });
  } catch (err) {
    next(err);
  }
};

// ✅ Login Controller
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = generateToken(
      String(user._id), // ✅ FIXED HERE
      user.isAdmin || false
    );

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      virtualAddress: user.virtualAddress,
      isAdmin: user.isAdmin,
      referralCode: user.referralCode,
      credits: user.credits,
      token,
    });
  } catch (err) {
    next(err);
  }
};

// ✅ Forgot Password
export const forgotPassword = async (
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
    const message = `
      <h3>Password Reset Requested</h3>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link will expire in 1 hour.</p>
    `;

    await sendEmail(user.email, "Reset Your Password", message);
    res.status(200).json({ message: "Password reset email sent." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};

// ✅ Reset Password
export const resetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      res.status(400).json({ message: "Token is invalid or expired." });
      return;
    }

    user.password = password; // hashed automatically in pre-save
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password has been reset successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};
