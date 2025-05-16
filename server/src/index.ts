import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path"; // ✅ Add this at the top
import connectDB from "./config/db";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import packageRoutes from "./routes/packageRoutes";
import adminStatsRoutes from "./routes/adminStats";
import notFound from "./middleware/notFound";
import errorHandler from "./middleware/errorHandler";
import testRoutes from "./routes/testRoutes";
import purchaseRequestRoutes from "./routes/purchaseRequestRoutes";
import settingRoutes from "./routes/settingRoutes";
import supportRoutes from "./routes/support";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// ✅ Your API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/admin/stats", adminStatsRoutes);
app.use("/api/test", testRoutes);
app.use("/api/purchase-requests", purchaseRequestRoutes);
app.use("/api/settings", settingRoutes);
app.use("/api/support", supportRoutes);

// ✅ Serve frontend in production
if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
  });
}

// ❌ Handle 404s + errors
app.use(notFound);
app.use(errorHandler);

// Start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
