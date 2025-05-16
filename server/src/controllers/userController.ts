import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// ✅ Generate token function
const generateToken = (id: string, isAdmin: boolean) => {
  return jwt.sign({ id, isAdmin }, process.env.JWT_SECRET!, {
    expiresIn: "30d",
  });
};

export const getUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

export const updateUserProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { password, ...otherUpdates } = req.body;

    const updates: any = { ...otherUpdates };

    if (password && !password.match(/^\$2[aby]\$/)) {
      // Only hash if it's a plain text password
      updates.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: "Failed to update user" });
  }
};

// GET /api/users - Admin fetch all users
export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await User.find().select("-password"); // Hide password
    res.status(200).json(users);
  } catch (err) {
    console.error("❌ Failed to fetch users:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    next(err);
  }
};

export const updateUserAccount = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { email, password } = req.body;

    const updates: any = {};
    if (email) updates.email = email;
    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      updates.password = hashed;
    }

    const updated = await User.findByIdAndUpdate(id, updates, { new: true });

    if (!updated) {
      res.status(200).json({ message: "Account updated" });
    }

    res.status(200).json({ message: "Account updated" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update account" });
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    // ✅ Use bcrypt.compare instead of raw comparison
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = generateToken(
      (user._id as mongoose.Types.ObjectId).toHexString(),
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

export const promoteUserToAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const updated = await User.findByIdAndUpdate(id, { isAdmin: true });

    if (!updated) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ message: "User promoted to admin" });
  } catch (err) {
    console.error("Promote failed:", err);
    res.status(500).json({ message: "Failed to promote user" });
  }
};
