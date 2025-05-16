"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateResetLinkForUser = exports.getPackagesByStatus = void 0;
const Package_1 = __importDefault(require("../models/Package"));
const crypto_1 = __importDefault(require("crypto"));
const User_1 = __importDefault(require("../models/User"));
const getPackagesByStatus = async (req, res) => {
    try {
        const stats = await Package_1.default.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } },
        ]);
        const formattedStats = {};
        stats.forEach((item) => {
            formattedStats[item._id] = item.count;
        });
        res.json(formattedStats);
    }
    catch (error) {
        console.error("Error getting package stats", error);
        res.status(500).json({ message: "Failed to get package stats" });
    }
};
exports.getPackagesByStatus = getPackagesByStatus;
const generateResetLinkForUser = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User_1.default.findOne({ email });
        if (!user)
            return res.status(404).json({ message: "User not found" });
        const token = crypto_1.default.randomBytes(32).toString("hex");
        user.resetPasswordToken = token;
        user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
        await user.save();
        const resetUrl = `https://yourfrontend.com/reset/${token}`;
        res.status(200).json({ resetUrl });
    }
    catch (err) {
        res.status(500).json({ message: "Error generating reset link" });
    }
};
exports.generateResetLinkForUser = generateResetLinkForUser;
