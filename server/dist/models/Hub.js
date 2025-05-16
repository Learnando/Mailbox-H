"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const hubSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    code: { type: String, unique: true, required: true }, // e.g. "HUB001"
}, {
    timestamps: true,
});
const Hub = mongoose_1.default.model("Hub", hubSchema);
exports.default = Hub;
