import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import packageRoutes from "./routes/packageRoutes";
import adminStatsRoutes from "./routes/adminStats"; // ✅ Admin Stats
import notFound from "./middleware/notFound";
import errorHandler from "./middleware/errorHandler";
import testRoutes from "./routes/testRoutes";
import purchaseRequestRoutes from "./routes/purchaseRequestRoutes";
import settingRoutes from "./routes/settingRoutes";
import supportRoutes from "./routes/support";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ====================
// 🛡️ Middlewares
// ====================
app.use(cors()); // Enable CORS for frontend requests
app.use(express.json()); // Parse JSON request bodies

// ✅ Serve uploaded screenshots statically
app.use("/uploads", express.static("uploads"));
// Now you can access files via: http://localhost:5000/uploads/yourfile.jpg

// ====================
// 🚀 Routes
// ====================
app.use("/api/auth", authRoutes); // User login/register
app.use("/api/users", userRoutes); // CRUD for users
app.use("/api/packages", packageRoutes); // Packages (submit, track, list)
app.use("/api/admin/stats", adminStatsRoutes); // Admin dashboard stats
app.use("/api/test", testRoutes);
app.use("/api/purchase-requests", purchaseRequestRoutes);
app.use("/api/settings", settingRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/support", supportRoutes);

// ====================
// ❌ 404 Handler + Global Error Handler
// ====================
app.use(notFound);
app.use(errorHandler);

// ====================
// 🛢️ Connect to Database and Start Server
// ====================
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
