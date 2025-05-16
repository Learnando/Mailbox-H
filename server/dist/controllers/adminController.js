"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPackageStats = exports.generateResetLinkForUser = void 0;
const crypto_1 = __importDefault(require("crypto"));
const User_1 = __importDefault(require("../models/User"));
const Package_1 = __importDefault(require("../models/Package"));
const generateResetLinkForUser = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const token = crypto_1.default.randomBytes(32).toString("hex");
        user.resetPasswordToken = token;
        user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
        await user.save();
        const resetUrl = `https://yourfrontend.com/reset/${token}`;
        res.status(200).json({ resetUrl });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
exports.generateResetLinkForUser = generateResetLinkForUser;
const getPackageStats = async (req, res) => {
    try {
        const stats = await Package_1.default.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
        ]);
        res.status(200).json(stats);
    }
    catch (err) {
        console.error("Error fetching package stats:", err);
        res.status(500).json({ message: "Failed to fetch stats" });
    }
};
exports.getPackageStats = getPackageStats;
