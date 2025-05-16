"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("../models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const sendEmail_1 = __importDefault(require("../utils/sendEmail"));
// ✅ Generate token function
const generateToken = (id, isAdmin) => {
    return jsonwebtoken_1.default.sign({ id, isAdmin }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};
// ✅ Register Controller
const register = async (req, res, next) => {
    try {
        const { name, email, password, ref } = req.body;
        const existing = await User_1.default.findOne({ email });
        if (existing) {
            res.status(409).json({ message: "User already exists" });
            return;
        }
        const virtualAddress = `HUB001-${Date.now().toString().slice(-6)}`;
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const newUser = new User_1.default({
            name,
            email,
            password: hashedPassword,
            virtualAddress,
            referredBy: ref || null,
        });
        newUser.referralCode = `user${new mongoose_1.default.Types.ObjectId().toString().slice(-6)}`;
        await newUser.save();
        const token = generateToken(String(newUser._id), // ✅ FIXED HERE
        newUser.isAdmin || false);
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
    }
    catch (err) {
        next(err);
    }
};
exports.register = register;
// ✅ Login Controller
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user || !(await bcryptjs_1.default.compare(password, user.password))) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        const token = generateToken(String(user._id), // ✅ FIXED HERE
        user.isAdmin || false);
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
    }
    catch (err) {
        next(err);
    }
};
exports.login = login;
// ✅ Forgot Password
const forgotPassword = async (req, res) => {
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
        const message = `
      <h3>Password Reset Requested</h3>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link will expire in 1 hour.</p>
    `;
        await (0, sendEmail_1.default)(user.email, "Reset Your Password", message);
        res.status(200).json({ message: "Password reset email sent." });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error." });
    }
};
exports.forgotPassword = forgotPassword;
// ✅ Reset Password
const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    try {
        const user = await User_1.default.findOne({
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
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error." });
    }
};
exports.resetPassword = resetPassword;
