import { Request, Response, NextFunction } from "express";
import Package from "../models/Package";
import sendEmail from "../utils/sendEmail";
import User from "../models/User";

// 📦 Track a package by tracking number
export const trackPackage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const pkg = await Package.findOne({
      trackingNumber: req.params.trackingNumber,
    });
    if (!pkg) {
      res.status(404).json({ message: "Package not found" });
      return;
    }
    res.status(200).json(pkg);
  } catch (err) {
    next(err);
  }
};

// 📦 Create a new package
export const createPackage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const {
      customerName,
      whatsapp,
      sender,
      description,
      price,
      shipping,
      delivery,
      note,
      userId,
      creditsToUse = 0,
    } = req.body;

    if (
      !customerName ||
      !whatsapp ||
      !description ||
      !price ||
      !shipping ||
      !delivery ||
      !userId
    ) {
      res.status(400).json({ message: "Missing required fields." });
      return;
    }

    const trackingNumber = `HT${Date.now().toString().slice(-9)}`;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const email = user.email;

    // ✅ Convert and apply credits safely
    const parsedCredits = Number(creditsToUse);
    let creditsApplied = 0;

    if (
      !isNaN(parsedCredits) &&
      user.credits &&
      user.credits >= parsedCredits
    ) {
      user.credits -= parsedCredits;
      await user.save();
      creditsApplied = parsedCredits;
    }

    const newPackage = await Package.create({
      customerName,
      whatsapp,
      sender,
      description,
      price,
      shipping,
      delivery,
      note,
      userId,
      email,
      trackingNumber,
      creditsUsed: creditsApplied,
      screenshotUrl: req.file ? `/uploads/${req.file.filename}` : undefined,
    });

    if (userId && whatsapp) {
      await User.findByIdAndUpdate(userId, { phone: whatsapp });
    }

    // ✅ Reward referral credit after first package
    const totalPackages = await Package.countDocuments({ userId });

    if (totalPackages === 1) {
      const user = await User.findById(userId);

      if (user && user.referredBy) {
        const referrer = await User.findOne({ referralCode: user.referredBy });
        if (referrer) {
          referrer.credits = (referrer.credits || 0) + 1;
          await referrer.save();
          console.log(`🎉 Referral credit awarded to ${referrer.email}`);
        }
      }
    }

    res.status(201).json(newPackage);
  } catch (err: any) {
    console.error("❌ Package creation failed:", err.message);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
}; // ✅ ← this was missing

// 📦 Get all packages for a user (excluding soft-deleted)
export const getUserPackages = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const packages = await Package.find({
      userId: req.params.userId,
      removedByUser: { $ne: true },
    });

    const formatted = packages.map((pkg) => ({
      _id: pkg._id,
      trackingNumber: pkg.trackingNumber,
      status: pkg.status,
      description: pkg.description,
      createdAt: pkg.createdAt,
      screenshotUrl: pkg.screenshotUrl || null,
      finalFee: pkg.finalFee,
      isPaid: pkg.isPaid,
      receiptUrl: pkg.receiptUrl || null,
      sender: pkg.sender || "Unknown",
    }));

    res.status(200).json(formatted);
  } catch (err) {
    next(err);
  }
};

// 📦 Get a single package by ID
export const getPackageById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) {
      res.status(404).json({ message: "Package not found" });
      return;
    }
    res.status(200).json(pkg);
  } catch (err) {
    next(err);
  }
};

// 🗑️ Hard delete (admin)
export const deletePackage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await Package.findByIdAndDelete(req.params.id);
    if (!result) {
      res.status(404).json({ message: "Package not found" });
      return;
    }
    res.status(200).json({ message: "Package deleted successfully" });
  } catch (err) {
    next(err);
  }
};

// 🗑️ Soft delete (user)
export const softDeletePackageForUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const pkg = await Package.findByIdAndUpdate(
      req.params.id,
      { removedByUser: true },
      { new: true }
    );
    if (!pkg) {
      res.status(404).json({ message: "Package not found" });
      return;
    }
    res.status(200).json({ message: "Package hidden for user" });
  } catch (err) {
    next(err);
  }
};

// 🗑️ Soft delete (admin)
export const softDeletePackageForAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const pkg = await Package.findByIdAndUpdate(
      req.params.id,
      { isDeletedByAdmin: true },
      { new: true }
    );
    if (!pkg) {
      res.status(404).json({ message: "Package not found" });
      return;
    }
    res.status(200).json({ message: "Package hidden from admin panel" });
  } catch (err) {
    next(err);
  }
};

// 🔄 Update package status
export const updatePackageStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status } = req.body;

    const pkg = await Package.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!pkg) {
      res.status(404).json({ message: "Package not found" });
      return;
    }

    if (status === "Delivered" && pkg.userId) {
      const user = await User.findById(pkg.userId);
      if (user && user.email) {
        const subject = "📦 Your Package Has Arrived!";
        const text = `Hi ${user.name}, your package (${pkg.trackingNumber}) has been delivered in Haiti!`;
        const html = `
          <h2>📦 Your Package Has Arrived!</h2>
          <p>Hi ${user.name},</p>
          <p>Your package <strong>${pkg.trackingNumber}</strong> has been <strong>delivered</strong> in Haiti.</p>
          <p>Thanks for using <strong>Haiti Mailbox</strong>.</p>
        `;

        await sendEmail(user.email, subject, text, html);
        console.log(`✅ Delivery email sent to ${user.email}`);
      }
    }

    res.status(200).json(pkg);
  } catch (err) {
    console.error("❌ Failed to update package status:", err);
    next(err);
  }
};

// 🚫 User cancels a package if still allowed
export const cancelPackage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) {
      res.status(404).json({ message: "Package not found" });
      return;
    }

    if (!["Pending", "Awaiting Payment"].includes(pkg.status)) {
      res.status(400).json({
        message:
          "You can only cancel packages that are Pending or Awaiting Payment",
      });
      return;
    }

    pkg.status = "Cancelled";
    await pkg.save();

    res.status(200).json({ message: "Package cancelled successfully", pkg });
  } catch (err) {
    next(err);
  }
};

// 📦 Get all packages (admin view)
export const getAllPackagesForAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const total = await Package.countDocuments();
    const pages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;

    const packages = await Package.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userId", "name email credits"); // ✅ Include credits

    res.status(200).json({
      data: packages,
      total,
      page,
      limit,
      pages,
    });
  } catch (err) {
    next(err);
  }
};
