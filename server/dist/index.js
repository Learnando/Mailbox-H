"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path")); // ✅ Add this at the top
const db_1 = __importDefault(require("./config/db"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const packageRoutes_1 = __importDefault(require("./routes/packageRoutes"));
const adminStats_1 = __importDefault(require("./routes/adminStats"));
const notFound_1 = __importDefault(require("./middleware/notFound"));
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const testRoutes_1 = __importDefault(require("./routes/testRoutes"));
const purchaseRequestRoutes_1 = __importDefault(require("./routes/purchaseRequestRoutes"));
const settingRoutes_1 = __importDefault(require("./routes/settingRoutes"));
const support_1 = __importDefault(require("./routes/support"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/uploads", express_1.default.static("uploads"));
// ✅ Your API routes
app.use("/api/auth", authRoutes_1.default);
app.use("/api/users", userRoutes_1.default);
app.use("/api/packages", packageRoutes_1.default);
app.use("/api/admin/stats", adminStats_1.default);
app.use("/api/test", testRoutes_1.default);
app.use("/api/purchase-requests", purchaseRequestRoutes_1.default);
app.use("/api/settings", settingRoutes_1.default);
app.use("/api/support", support_1.default);
// ✅ Serve frontend in production
if (process.env.NODE_ENV === "production") {
    const __dirname = path_1.default.resolve();
    app.use(express_1.default.static(path_1.default.join(__dirname, "../frontend/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path_1.default.join(__dirname, "../frontend/dist", "index.html"));
    });
}
// ❌ Handle 404s + errors
app.use(notFound_1.default);
app.use(errorHandler_1.default);
// Start server
(0, db_1.default)().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
});
