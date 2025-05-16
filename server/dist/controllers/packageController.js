"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPackagesForAdmin = exports.cancelPackage = exports.updatePackageStatus = exports.softDeletePackageForAdmin = exports.softDeletePackageForUser = exports.deletePackage = exports.getPackageById = exports.getUserPackages = exports.createPackage = exports.trackPackage = void 0;
const Package_1 = __importDefault(require("../models/Package"));
const sendEmail_1 = __importDefault(require("../utils/sendEmail"));
const User_1 = __importDefault(require("../models/User"));
// 📦 Track a package by tracking number
const trackPackage = async (req, res, next) => {
    try {
        const pkg = await Package_1.default.findOne({
            trackingNumber: req.params.trackingNumber,
        });
        if (!pkg) {
            res.status(404).json({ message: "Package not found" });
            return;
        }
        res.status(200).json(pkg);
    }
    catch (err) {
        next(err);
    }
};
exports.trackPackage = trackPackage;
// 📦 Create a new package
const createPackage = async (req, res, next) => {
    try {
        const { customerName, whatsapp, sender, description, price, shipping, delivery, note, userId, creditsToUse = 0, } = req.body;
        if (!customerName ||
            !whatsapp ||
            !description ||
            !price ||
            !shipping ||
            !delivery ||
            !userId) {
            res.status(400).json({ message: "Missing required fields." });
            return;
        }
        const trackingNumber = `HT${Date.now().toString().slice(-9)}`;
        const user = await User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const email = user.email;
        // ✅ Convert and apply credits safely
        const parsedCredits = Number(creditsToUse);
        let creditsApplied = 0;
        if (!isNaN(parsedCredits) &&
            user.credits &&
            user.credits >= parsedCredits) {
            user.credits -= parsedCredits;
            await user.save();
            creditsApplied = parsedCredits;
        }
        const newPackage = await Package_1.default.create({
            customerName,
            whatsapp,
            sender,
            description,
            price,
            shipping,
            delivery,
            note,
            userId,
            email,
            trackingNumber,
            creditsUsed: creditsApplied,
            screenshotUrl: req.file ? `/uploads/${req.file.filename}` : undefined,
        });
        if (userId && whatsapp) {
            await User_1.default.findByIdAndUpdate(userId, { phone: whatsapp });
        }
        // ✅ Reward referral credit after first package
        const totalPackages = await Package_1.default.countDocuments({ userId });
        if (totalPackages === 1) {
            const user = await User_1.default.findById(userId);
            if (user && user.referredBy) {
                const referrer = await User_1.default.findOne({ referralCode: user.referredBy });
                if (referrer) {
                    referrer.credits = (referrer.credits || 0) + 1;
                    await referrer.save();
                    console.log(`🎉 Referral credit awarded to ${referrer.email}`);
                }
            }
        }
        res.status(201).json(newPackage);
    }
    catch (err) {
        console.error("❌ Package creation failed:", err.message);
        res.status(500).json({ message: err.message || "Internal Server Error" });
    }
}; // ✅ ← this was missing
exports.createPackage = createPackage;
// 📦 Get all packages for a user (excluding soft-deleted)
const getUserPackages = async (req, res, next) => {
    try {
        const packages = await Package_1.default.find({
            userId: req.params.userId,
            removedByUser: { $ne: true },
        });
        const formatted = packages.map((pkg) => ({
            _id: pkg._id,
            trackingNumber: pkg.trackingNumber,
            status: pkg.status,
            description: pkg.description,
            createdAt: pkg.createdAt,
            screenshotUrl: pkg.screenshotUrl || null,
            finalFee: pkg.finalFee,
            isPaid: pkg.isPaid,
            receiptUrl: pkg.receiptUrl || null,
            sender: pkg.sender || "Unknown",
        }));
        res.status(200).json(formatted);
    }
    catch (err) {
        next(err);
    }
};
exports.getUserPackages = getUserPackages;
// 📦 Get a single package by ID
const getPackageById = async (req, res, next) => {
    try {
        const pkg = await Package_1.default.findById(req.params.id);
        if (!pkg) {
            res.status(404).json({ message: "Package not found" });
            return;
        }
        res.status(200).json(pkg);
    }
    catch (err) {
        next(err);
    }
};
exports.getPackageById = getPackageById;
// 🗑️ Hard delete (admin)
const deletePackage = async (req, res, next) => {
    try {
        const result = await Package_1.default.findByIdAndDelete(req.params.id);
        if (!result) {
            res.status(404).json({ message: "Package not found" });
            return;
        }
        res.status(200).json({ message: "Package deleted successfully" });
    }
    catch (err) {
        next(err);
    }
};
exports.deletePackage = deletePackage;
// 🗑️ Soft delete (user)
const softDeletePackageForUser = async (req, res, next) => {
    try {
        const pkg = await Package_1.default.findByIdAndUpdate(req.params.id, { removedByUser: true }, { new: true });
        if (!pkg) {
            res.status(404).json({ message: "Package not found" });
            return;
        }
        res.status(200).json({ message: "Package hidden for user" });
    }
    catch (err) {
        next(err);
    }
};
exports.softDeletePackageForUser = softDeletePackageForUser;
// 🗑️ Soft delete (admin)
const softDeletePackageForAdmin = async (req, res, next) => {
    try {
        const pkg = await Package_1.default.findByIdAndUpdate(req.params.id, { isDeletedByAdmin: true }, { new: true });
        if (!pkg) {
            res.status(404).json({ message: "Package not found" });
            return;
        }
        res.status(200).json({ message: "Package hidden from admin panel" });
    }
    catch (err) {
        next(err);
    }
};
exports.softDeletePackageForAdmin = softDeletePackageForAdmin;
// 🔄 Update package status
const updatePackageStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const pkg = await Package_1.default.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
        if (!pkg) {
            res.status(404).json({ message: "Package not found" });
            return;
        }
        if (status === "Delivered" && pkg.userId) {
            const user = await User_1.default.findById(pkg.userId);
            if (user && user.email) {
                const subject = "📦 Your Package Has Arrived!";
                const text = `Hi ${user.name}, your package (${pkg.trackingNumber}) has been delivered in Haiti!`;
                const html = `
          <h2>📦 Your Package Has Arrived!</h2>
          <p>Hi ${user.name},</p>
          <p>Your package <strong>${pkg.trackingNumber}</strong> has been <strong>delivered</strong> in Haiti.</p>
          <p>Thanks for using <strong>Haiti Mailbox</strong>.</p>
        `;
                await (0, sendEmail_1.default)(user.email, subject, text, html);
                console.log(`✅ Delivery email sent to ${user.email}`);
            }
        }
        res.status(200).json(pkg);
    }
    catch (err) {
        console.error("❌ Failed to update package status:", err);
        next(err);
    }
};
exports.updatePackageStatus = updatePackageStatus;
// 🚫 User cancels a package if still allowed
const cancelPackage = async (req, res, next) => {
    try {
        const pkg = await Package_1.default.findById(req.params.id);
        if (!pkg) {
            res.status(404).json({ message: "Package not found" });
            return;
        }
        if (!["Pending", "Awaiting Payment"].includes(pkg.status)) {
            res.status(400).json({
                message: "You can only cancel packages that are Pending or Awaiting Payment",
            });
            return;
        }
        pkg.status = "Cancelled";
        await pkg.save();
        res.status(200).json({ message: "Package cancelled successfully", pkg });
    }
    catch (err) {
        next(err);
    }
};
exports.cancelPackage = cancelPackage;
// 📦 Get all packages (admin view)
const getAllPackagesForAdmin = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const total = await Package_1.default.countDocuments();
        const pages = Math.ceil(total / limit);
        const skip = (page - 1) * limit;
        const packages = await Package_1.default.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("userId", "name email credits"); // ✅ Include credits
        res.status(200).json({
            data: packages,
            total,
            page,
            limit,
            pages,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.getAllPackagesForAdmin = getAllPackagesForAdmin;
