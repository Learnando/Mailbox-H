"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminOnly = void 0;
const User_1 = __importDefault(require("../models/User"));
const adminOnly = async (req, res, next) => {
    try {
        const user = await User_1.default.findById(req.userId);
        if (!user || !user.isAdmin) {
            res.status(403).json({ message: "Access denied: Admins only." });
            return; // ✅ Add return after res.json to stop the request
        }
        next();
    }
    catch (error) {
        console.error("Admin middleware error:", error);
        res.status(500).json({ message: "Server error in Admin middleware." });
        return;
    }
};
exports.adminOnly = adminOnly;
