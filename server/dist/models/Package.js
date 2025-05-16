"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const packageSchema = new mongoose_1.default.Schema({
    customerName: { type: String, required: true },
    whatsapp: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    shipping: { type: String, required: true },
    delivery: { type: String, required: true },
    note: { type: String, default: "" },
    screenshotUrl: { type: String, default: "" },
    receiptUrl: { type: String, default: "" },
    sender: { type: String, required: false }, // ✅
    email: { type: String, required: true },
    creditsUsed: { type: Number, default: 0 }, // ✅ Add this field
    //✅ Add this field
    rating: { type: Number, min: 1, max: 5 },
    review: { type: String },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    trackingNumber: {
        type: String,
        required: true,
        unique: true,
    },
    status: {
        type: String,
        enum: [
            "Pending",
            "Awaiting Payment",
            "Shipped",
            "Delivered",
            "Cancelled",
        ], // ✅ Added "Cancelled"
        default: "Pending",
    },
    finalFee: {
        type: Number,
        default: null,
    },
    isPaid: {
        type: Boolean,
        default: false,
    },
    isDeletedByAdmin: {
        type: Boolean,
        default: false, // ✅ Soft delete for admin
    },
    removedByUser: {
        type: Boolean,
        default: false, // ✅ Soft delete for user
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Package", packageSchema);
