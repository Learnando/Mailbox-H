import { Request, Response, NextFunction } from "express";
import PurchaseRequest from "../models/PurchaseRequest";
import User from "../models/User"; // ✅ required to access referrer

// 📥 Create a new purchase request
export const createPurchaseRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      userId,
      itemUrl,
      estimatedPrice,
      quantity,
      notes,
      referenceNumber,
    } = req.body;

    const screenshotUrl = req.file
      ? `/uploads/${req.file.filename}`
      : undefined;

    const newRequest = await PurchaseRequest.create({
      userId,
      itemUrl,
      estimatedPrice,
      quantity,
      notes,
      referenceNumber, // ✅ Now accepting any string format
      screenshotUrl,
    });

    // ✅ Reward referral credit after first request
    const totalRequests = await PurchaseRequest.countDocuments({ userId });

    if (totalRequests === 1) {
      const user = await User.findById(userId);
      if (user?.referredBy) {
        const referrer = await User.findOne({ referralCode: user.referredBy });
        if (referrer) {
          referrer.credits = (referrer.credits || 0) + 1;
          await referrer.save();
          console.log(`🎉 Referral credit awarded to ${referrer.email}`);
        }
      }
    }

    res.status(201).json(newRequest);
  } catch (err) {
    next(err);
  }
};

// 📄 Get all requests (admin)
export const getAllPurchaseRequests = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const requests = await PurchaseRequest.find({ isHiddenFromAdmin: false }) // ✅ soft-delete filtering
      .sort({ createdAt: -1 })
      .populate("userId", "name email");
    res.status(200).json(requests);
  } catch (err) {
    next(err);
  }
};

// 🟡 Admin sets final fee and changes status to Awaiting Payment
export const setPurchaseFinalFee = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { finalFee } = req.body;

    const request = await PurchaseRequest.findByIdAndUpdate(
      req.params.id,
      {
        finalFee,
        status: "Awaiting Payment",
      },
      { new: true }
    );

    if (!request) {
      res.status(404).json({ message: "Request not found" });
      return;
    }

    res.status(200).json(request);
  } catch (err) {
    next(err);
  }
};

// ✅ After reviewing receipt, admin marks as paid + status becomes "Ordered"
export const markPurchaseAsPaid = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const request = await PurchaseRequest.findByIdAndUpdate(
      req.params.id,
      {
        isPaid: true,
        status: "Ordered",
      },
      { new: true }
    );

    if (!request) {
      res.status(404).json({ message: "Request not found" });
      return;
    }

    res.status(200).json(request);
  } catch (err) {
    next(err);
  }
};

// ✅ Receipt Upload from User
export const uploadPurchaseReceipt = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const receiptUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

    const updated = await PurchaseRequest.findByIdAndUpdate(
      id,
      { receiptUrl },
      { new: true }
    );

    if (!updated) {
      res.status(404).json({ message: "Request not found" });
      return;
    }

    res.status(200).json({ receiptUrl });
  } catch (err) {
    next(err);
  }
};

// 🔄 Manual status override (optional)
export const updatePurchaseStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status } = req.body;
    const request = await PurchaseRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!request) {
      res.status(404).json({ message: "Request not found" });
      return;
    }

    res.status(200).json(request);
  } catch (err) {
    next(err);
  }
};

// ❌ Admin soft delete (hide from admin panel only)
export const deletePurchaseRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const request = await PurchaseRequest.findByIdAndUpdate(
      req.params.id,
      { isHiddenFromAdmin: true }, // ✅ Soft delete flag
      { new: true }
    );

    if (!request) {
      res.status(404).json({ message: "Request not found" });
      return;
    }

    res.status(200).json({ message: "Request hidden from admin view" });
  } catch (err) {
    next(err);
  }
};

// ❌ Cancel request
export const cancelPurchaseRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const request = await PurchaseRequest.findById(req.params.id);
    if (!request) {
      res.status(404).json({ message: "Request not found" });
      return;
    }

    if (!["Pending", "Awaiting Payment"].includes(request.status)) {
      res.status(400).json({ message: "Cannot cancel at this stage" });
      return;
    }

    request.status = "Cancelled";
    await request.save();

    res.status(200).json({ message: "Request cancelled", request });
  } catch (err) {
    next(err);
  }
};

// 🗑️ Soft delete by user (only hide from user's view)
export const userSoftDeletePurchaseRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const request = await PurchaseRequest.findById(req.params.id);

    if (!request) {
      res.status(404).json({ message: "Request not found" });
      return;
    }

    request.set("deletedByUser", true); // ✅ make sure to set this explicitly
    await request.save(); // ✅ save it properly

    res.status(200).json({ message: "Hidden from user view" });
  } catch (err) {
    next(err);
  }
};
