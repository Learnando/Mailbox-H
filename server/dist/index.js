"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const packageRoutes_1 = __importDefault(require("./routes/packageRoutes"));
const adminStats_1 = __importDefault(require("./routes/adminStats")); // ✅ Admin Stats
const notFound_1 = __importDefault(require("./middleware/notFound"));
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const testRoutes_1 = __importDefault(require("./routes/testRoutes"));
const purchaseRequestRoutes_1 = __importDefault(require("./routes/purchaseRequestRoutes"));
const settingRoutes_1 = __importDefault(require("./routes/settingRoutes"));
const support_1 = __importDefault(require("./routes/support"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// ====================
// 🛡️ Middlewares
// ====================
app.use((0, cors_1.default)()); // Enable CORS for frontend requests
app.use(express_1.default.json()); // Parse JSON request bodies
// ✅ Serve uploaded screenshots statically
app.use("/uploads", express_1.default.static("uploads"));
// Now you can access files via: http://localhost:5000/uploads/yourfile.jpg
// ====================
// 🚀 Routes
// ====================
app.use("/api/auth", authRoutes_1.default); // User login/register
app.use("/api/users", userRoutes_1.default); // CRUD for users
app.use("/api/packages", packageRoutes_1.default); // Packages (submit, track, list)
app.use("/api/admin/stats", adminStats_1.default); // Admin dashboard stats
app.use("/api/test", testRoutes_1.default);
app.use("/api/purchase-requests", purchaseRequestRoutes_1.default);
app.use("/api/settings", settingRoutes_1.default);
app.use("/api/packages", packageRoutes_1.default);
app.use("/api/support", support_1.default);
// ====================
// ❌ 404 Handler + Global Error Handler
// ====================
app.use(notFound_1.default);
app.use(errorHandler_1.default);
// ====================
// 🛢️ Connect to Database and Start Server
// ====================
(0, db_1.default)().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
});
