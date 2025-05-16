"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSoftDeletePurchaseRequest = exports.cancelPurchaseRequest = exports.deletePurchaseRequest = exports.updatePurchaseStatus = exports.uploadPurchaseReceipt = exports.markPurchaseAsPaid = exports.setPurchaseFinalFee = exports.getAllPurchaseRequests = exports.createPurchaseRequest = void 0;
const PurchaseRequest_1 = __importDefault(require("../models/PurchaseRequest"));
const User_1 = __importDefault(require("../models/User")); // ✅ required to access referrer
// 📥 Create a new purchase request
const createPurchaseRequest = async (req, res, next) => {
    try {
        const { userId, itemUrl, estimatedPrice, quantity, notes, referenceNumber, } = req.body;
        const screenshotUrl = req.file
            ? `/uploads/${req.file.filename}`
            : undefined;
        const newRequest = await PurchaseRequest_1.default.create({
            userId,
            itemUrl,
            estimatedPrice,
            quantity,
            notes,
            referenceNumber, // ✅ Now accepting any string format
            screenshotUrl,
        });
        // ✅ Reward referral credit after first request
        const totalRequests = await PurchaseRequest_1.default.countDocuments({ userId });
        if (totalRequests === 1) {
            const user = await User_1.default.findById(userId);
            if (user?.referredBy) {
                const referrer = await User_1.default.findOne({ referralCode: user.referredBy });
                if (referrer) {
                    referrer.credits = (referrer.credits || 0) + 1;
                    await referrer.save();
                    console.log(`🎉 Referral credit awarded to ${referrer.email}`);
                }
            }
        }
        res.status(201).json(newRequest);
    }
    catch (err) {
        next(err);
    }
};
exports.createPurchaseRequest = createPurchaseRequest;
// 📄 Get all requests (admin)
const getAllPurchaseRequests = async (req, res, next) => {
    try {
        const requests = await PurchaseRequest_1.default.find({ isHiddenFromAdmin: false }) // ✅ soft-delete filtering
            .sort({ createdAt: -1 })
            .populate("userId", "name email");
        res.status(200).json(requests);
    }
    catch (err) {
        next(err);
    }
};
exports.getAllPurchaseRequests = getAllPurchaseRequests;
// 🟡 Admin sets final fee and changes status to Awaiting Payment
const setPurchaseFinalFee = async (req, res, next) => {
    try {
        const { finalFee } = req.body;
        const request = await PurchaseRequest_1.default.findByIdAndUpdate(req.params.id, {
            finalFee,
            status: "Awaiting Payment",
        }, { new: true });
        if (!request) {
            res.status(404).json({ message: "Request not found" });
            return;
        }
        res.status(200).json(request);
    }
    catch (err) {
        next(err);
    }
};
exports.setPurchaseFinalFee = setPurchaseFinalFee;
// ✅ After reviewing receipt, admin marks as paid + status becomes "Ordered"
const markPurchaseAsPaid = async (req, res, next) => {
    try {
        const request = await PurchaseRequest_1.default.findByIdAndUpdate(req.params.id, {
            isPaid: true,
            status: "Ordered",
        }, { new: true });
        if (!request) {
            res.status(404).json({ message: "Request not found" });
            return;
        }
        res.status(200).json(request);
    }
    catch (err) {
        next(err);
    }
};
exports.markPurchaseAsPaid = markPurchaseAsPaid;
// ✅ Receipt Upload from User
const uploadPurchaseReceipt = async (req, res, next) => {
    try {
        const { id } = req.params;
        const receiptUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
        const updated = await PurchaseRequest_1.default.findByIdAndUpdate(id, { receiptUrl }, { new: true });
        if (!updated) {
            res.status(404).json({ message: "Request not found" });
            return;
        }
        res.status(200).json({ receiptUrl });
    }
    catch (err) {
        next(err);
    }
};
exports.uploadPurchaseReceipt = uploadPurchaseReceipt;
// 🔄 Manual status override (optional)
const updatePurchaseStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const request = await PurchaseRequest_1.default.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
        if (!request) {
            res.status(404).json({ message: "Request not found" });
            return;
        }
        res.status(200).json(request);
    }
    catch (err) {
        next(err);
    }
};
exports.updatePurchaseStatus = updatePurchaseStatus;
// ❌ Admin soft delete (hide from admin panel only)
const deletePurchaseRequest = async (req, res, next) => {
    try {
        const request = await PurchaseRequest_1.default.findByIdAndUpdate(req.params.id, { isHiddenFromAdmin: true }, // ✅ Soft delete flag
        { new: true });
        if (!request) {
            res.status(404).json({ message: "Request not found" });
            return;
        }
        res.status(200).json({ message: "Request hidden from admin view" });
    }
    catch (err) {
        next(err);
    }
};
exports.deletePurchaseRequest = deletePurchaseRequest;
// ❌ Cancel request
const cancelPurchaseRequest = async (req, res, next) => {
    try {
        const request = await PurchaseRequest_1.default.findById(req.params.id);
        if (!request) {
            res.status(404).json({ message: "Request not found" });
            return;
        }
        if (!["Pending", "Awaiting Payment"].includes(request.status)) {
            res.status(400).json({ message: "Cannot cancel at this stage" });
            return;
        }
        request.status = "Cancelled";
        await request.save();
        res.status(200).json({ message: "Request cancelled", request });
    }
    catch (err) {
        next(err);
    }
};
exports.cancelPurchaseRequest = cancelPurchaseRequest;
// 🗑️ Soft delete by user (only hide from user's view)
const userSoftDeletePurchaseRequest = async (req, res, next) => {
    try {
        const request = await PurchaseRequest_1.default.findById(req.params.id);
        if (!request) {
            res.status(404).json({ message: "Request not found" });
            return;
        }
        request.set("deletedByUser", true); // ✅ make sure to set this explicitly
        await request.save(); // ✅ save it properly
        res.status(200).json({ message: "Hidden from user view" });
    }
    catch (err) {
        next(err);
    }
};
exports.userSoftDeletePurchaseRequest = userSoftDeletePurchaseRequest;
