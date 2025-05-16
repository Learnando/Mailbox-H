"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const supportMessageSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }, // ✅ add this
    message: { type: String, required: true },
}, { timestamps: true });
const SupportMessage = mongoose_1.default.model("SupportMessage", supportMessageSchema);
exports.default = SupportMessage;
