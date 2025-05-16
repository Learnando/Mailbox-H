"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.promoteUserToAdmin = exports.login = exports.updateUserAccount = exports.deleteUser = exports.getAllUsers = exports.updateUserProfile = exports.getUserProfile = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// ✅ Generate token function
const generateToken = (id, isAdmin) => {
    return jsonwebtoken_1.default.sign({ id, isAdmin }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};
const getUserProfile = async (req, res, next) => {
    try {
        const user = await User_1.default.findById(req.params.id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json(user);
    }
    catch (err) {
        next(err);
    }
};
exports.getUserProfile = getUserProfile;
const updateUserProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { password, ...otherUpdates } = req.body;
        const updates = { ...otherUpdates };
        if (password && !password.match(/^\$2[aby]\$/)) {
            // Only hash if it's a plain text password
            updates.password = await bcryptjs_1.default.hash(password, 10);
        }
        const updatedUser = await User_1.default.findByIdAndUpdate(id, updates, {
            new: true,
        });
        if (!updatedUser) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json(updatedUser);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to update user" });
    }
};
exports.updateUserProfile = updateUserProfile;
// GET /api/users - Admin fetch all users
const getAllUsers = async (req, res, next) => {
    try {
        const users = await User_1.default.find().select("-password"); // Hide password
        res.status(200).json(users);
    }
    catch (err) {
        console.error("❌ Failed to fetch users:", err);
        res.status(500).json({ message: "Failed to fetch users" });
    }
};
exports.getAllUsers = getAllUsers;
const deleteUser = async (req, res, next) => {
    try {
        const user = await User_1.default.findByIdAndDelete(req.params.id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json({ message: "User deleted successfully" });
    }
    catch (err) {
        next(err);
    }
};
exports.deleteUser = deleteUser;
const updateUserAccount = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, password } = req.body;
        const updates = {};
        if (email)
            updates.email = email;
        if (password) {
            const hashed = await bcryptjs_1.default.hash(password, 10);
            updates.password = hashed;
        }
        const updated = await User_1.default.findByIdAndUpdate(id, updates, { new: true });
        if (!updated) {
            res.status(200).json({ message: "Account updated" });
        }
        res.status(200).json({ message: "Account updated" });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to update account" });
    }
};
exports.updateUserAccount = updateUserAccount;
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        // ✅ Use bcrypt.compare instead of raw comparison
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        const token = generateToken(user._id.toHexString(), user.isAdmin || false);
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
const promoteUserToAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await User_1.default.findByIdAndUpdate(id, { isAdmin: true });
        if (!updated) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json({ message: "User promoted to admin" });
    }
    catch (err) {
        console.error("Promote failed:", err);
        res.status(500).json({ message: "Failed to promote user" });
    }
};
exports.promoteUserToAdmin = promoteUserToAdmin;
