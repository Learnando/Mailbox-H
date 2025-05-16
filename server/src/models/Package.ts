import mongoose from "mongoose";

const packageSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    whatsapp: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    shipping: { type: String, required: true },
    delivery: { type: String, required: true },
    note: { type: String, default: "" },
    screenshotUrl: { type: String, default: "" },
    receiptUrl: { type: String, default: "" },
    sender: { type: String, required: false }, // ✅
    email: { type: String, required: true },
    creditsUsed: { type: Number, default: 0 }, // ✅ Add this field

    //✅ Add this field
    rating: { type: Number, min: 1, max: 5 },
    review: { type: String },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    trackingNumber: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: [
        "Pending",
        "Awaiting Payment",
        "Shipped",
        "Delivered",
        "Cancelled",
      ], // ✅ Added "Cancelled"
      default: "Pending",
    },
    finalFee: {
      type: Number,
      default: null,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    isDeletedByAdmin: {
      type: Boolean,
      default: false, // ✅ Soft delete for admin
    },
    removedByUser: {
      type: Boolean,
      default: false, // ✅ Soft delete for user
    },
  },
  { timestamps: true }
);

export default mongoose.model("Package", packageSchema);
