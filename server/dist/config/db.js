"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // must be first
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    const uri = process.env.MONGO_URI;
    console.log("MONGO_URI:", uri); // ← DEBUG LINE
    if (!uri)
        throw new Error("MONGO_URI is undefined");
    const conn = await mongoose_1.default.connect(uri);
    console.log(`MongoDB connected ✅: ${conn.connection.host}`);
};
exports.default = connectDB;
