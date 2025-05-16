import express, { Request, Response, NextFunction } from "express";
import upload from "../middleware/upload";
import {
  createPackage,
  getUserPackages,
  getPackageById,
  trackPackage,
  updatePackageStatus,
  softDeletePackageForUser,
  softDeletePackageForAdmin,
  cancelPackage,
  getAllPackagesForAdmin,
} from "../controllers/packageController";
import { isAuth } from "../middleware/authMiddleware";
import Package from "../models/Package";

const router = express.Router();

// ✅ Submit a new package (with file upload)
router.post("/", upload.single("screenshot"), createPackage);

// ✅ Track a package by tracking number
router.get("/track/:trackingNumber", trackPackage);

// ✅ Get all packages for admin (paginated + includes credits)
router.get("/all", getAllPackagesForAdmin);

// ✅ Get all packages for admin (paginated - backup route)
router.get("/all", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const total = await Package.countDocuments();
    const packages = await Package.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
      data: packages,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch packages" });
  }
});

// ✅ Get all packages submitted by a specific user
router.get("/user/:userId", getUserPackages);

// ✅ Get a single package by ID
router.get("/:id", getPackageById);

// ✅ Soft delete (user)
router.delete("/user-delete/:id", softDeletePackageForUser);

// ✅ Soft delete (admin)
router.delete("/:id", softDeletePackageForAdmin);

// ✅ Update status of a package
router.patch("/:id/status", updatePackageStatus);

// ✅ Upload a payment receipt
router.patch(
  "/:id/upload-receipt",
  upload.single("receipt"),
  async (req, res, next) => {
    try {
      const pkg = await Package.findByIdAndUpdate(
        req.params.id,
        { receiptUrl: req.file ? `/uploads/${req.file.filename}` : "" },
        { new: true }
      );

      if (!pkg) {
        res.status(404).json({ message: "Package not found" });
        return;
      }

      res.status(200).json(pkg);
    } catch (err) {
      next(err);
    }
  }
);

// ✅ Admin marks as paid
router.patch("/:id/paid", async (req, res, next) => {
  try {
    const { isPaid, status } = req.body;

    const pkg = await Package.findByIdAndUpdate(
      req.params.id,
      { isPaid, status },
      { new: true }
    );

    if (!pkg) {
      res.status(404).json({ message: "Package not found" });
      return;
    }

    res.status(200).json(pkg);
  } catch (err) {
    next(err);
  }
});

// ✅ Set final fee and status
router.patch("/:id/fee", async (req, res, next) => {
  try {
    const { finalFee, status } = req.body;

    const pkg = await Package.findByIdAndUpdate(
      req.params.id,
      { finalFee, status },
      { new: true }
    );

    if (!pkg) {
      res.status(404).json({ message: "Package not found" });
      return;
    }

    res.status(200).json(pkg);
  } catch (err) {
    console.error("❌ Failed to update final fee:", err);
    next(err);
  }
});

// ✅ Cancel package
router.patch("/:id/cancel", cancelPackage);

// ✅ Leave a review after delivery
router.patch(
  "/:id/review",
  isAuth,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { rating, review } = req.body as { rating: number; review: string };
      const packageId = req.params.id;

      if (!rating || rating < 1 || rating > 5) {
        res.status(400).json({ message: "Rating must be between 1 and 5" });
        return;
      }

      const pkg = await Package.findById(packageId);
      if (!pkg) {
        res.status(404).json({ message: "Package not found" });
        return;
      }

      if (pkg.status !== "Delivered") {
        res
          .status(403)
          .json({ message: "You can only review delivered packages." });
        return;
      }

      pkg.rating = rating;
      pkg.review = review;
      await pkg.save();

      res
        .status(200)
        .json({ message: "Thank you for your feedback!", package: pkg });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
