import { Request, Response, NextFunction } from "express";
import User from "../models/User";

interface AuthRequest extends Request {
  userId?: string;
}

export const adminOnly = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.userId);

    if (!user || !user.isAdmin) {
      res.status(403).json({ message: "Access denied: Admins only." });
      return; // ✅ Add return after res.json to stop the request
    }

    next();
  } catch (error) {
    console.error("Admin middleware error:", error);
    res.status(500).json({ message: "Server error in Admin middleware." });
    return;
  }
};
