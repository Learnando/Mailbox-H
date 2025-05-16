"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// Store uploaded files in /uploads
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
});
const upload = (0, multer_1.default)({
    storage,
    fileFilter: (_req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        if (allowedTypes.test(ext)) {
            cb(null, true);
        }
        else {
            cb(new Error("Only image files are allowed"));
        }
    },
});
exports.default = upload;
