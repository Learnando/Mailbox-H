"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const upload_1 = __importDefault(require("../middleware/upload"));
const packageController_1 = require("../controllers/packageController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const Package_1 = __importDefault(require("../models/Package"));
const router = express_1.default.Router();
// ✅ Submit a new package (with file upload)
router.post("/", upload_1.default.single("screenshot"), packageController_1.createPackage);
// ✅ Track a package by tracking number
router.get("/track/:trackingNumber", packageController_1.trackPackage);
// ✅ Get all packages for admin (paginated + includes credits)
router.get("/all", packageController_1.getAllPackagesForAdmin);
// ✅ Get all packages for admin (paginated - backup route)
router.get("/all", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const total = await Package_1.default.countDocuments();
        const packages = await Package_1.default.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        res.status(200).json({
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
            data: packages,
        });
    }
    catch (err) {
        res.status(500).json({ message: "Failed to fetch packages" });
    }
});
// ✅ Get all packages submitted by a specific user
router.get("/user/:userId", packageController_1.getUserPackages);
// ✅ Get a single package by ID
router.get("/:id", packageController_1.getPackageById);
// ✅ Soft delete (user)
router.delete("/user-delete/:id", packageController_1.softDeletePackageForUser);
// ✅ Soft delete (admin)
router.delete("/:id", packageController_1.softDeletePackageForAdmin);
// ✅ Update status of a package
router.patch("/:id/status", packageController_1.updatePackageStatus);
// ✅ Upload a payment receipt
router.patch("/:id/upload-receipt", upload_1.default.single("receipt"), async (req, res, next) => {
    try {
        const pkg = await Package_1.default.findByIdAndUpdate(req.params.id, { receiptUrl: req.file ? `/uploads/${req.file.filename}` : "" }, { new: true });
        if (!pkg) {
            res.status(404).json({ message: "Package not found" });
            return;
        }
        res.status(200).json(pkg);
    }
    catch (err) {
        next(err);
    }
});
// ✅ Admin marks as paid
router.patch("/:id/paid", async (req, res, next) => {
    try {
        const { isPaid, status } = req.body;
        const pkg = await Package_1.default.findByIdAndUpdate(req.params.id, { isPaid, status }, { new: true });
        if (!pkg) {
            res.status(404).json({ message: "Package not found" });
            return;
        }
        res.status(200).json(pkg);
    }
    catch (err) {
        next(err);
    }
});
// ✅ Set final fee and status
router.patch("/:id/fee", async (req, res, next) => {
    try {
        const { finalFee, status } = req.body;
        const pkg = await Package_1.default.findByIdAndUpdate(req.params.id, { finalFee, status }, { new: true });
        if (!pkg) {
            res.status(404).json({ message: "Package not found" });
            return;
        }
        res.status(200).json(pkg);
    }
    catch (err) {
        console.error("❌ Failed to update final fee:", err);
        next(err);
    }
});
// ✅ Cancel package
router.patch("/:id/cancel", packageController_1.cancelPackage);
// ✅ Leave a review after delivery
router.patch("/:id/review", authMiddleware_1.isAuth, async (req, res, next) => {
    try {
        const { rating, review } = req.body;
        const packageId = req.params.id;
        if (!rating || rating < 1 || rating > 5) {
            res.status(400).json({ message: "Rating must be between 1 and 5" });
            return;
        }
        const pkg = await Package_1.default.findById(packageId);
        if (!pkg) {
            res.status(404).json({ message: "Package not found" });
            return;
        }
        if (pkg.status !== "Delivered") {
            res
                .status(403)
                .json({ message: "You can only review delivered packages." });
            return;
        }
        pkg.rating = rating;
        pkg.review = review;
        await pkg.save();
        res
            .status(200)
            .json({ message: "Thank you for your feedback!", package: pkg });
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
