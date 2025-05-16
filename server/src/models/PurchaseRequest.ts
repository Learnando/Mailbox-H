import mongoose, { Schema, Document } from "mongoose";

export interface IPurchaseRequest extends Document {
  userId: mongoose.Types.ObjectId;
  itemUrl: string;
  notes?: string;
  estimatedPrice: number;
  quantity: number;
  status:
    | "Pending"
    | "Ordered"
    | "Delivered"
    | "Cancelled"
    | "Awaiting Payment"
    | "Shipped";
  screenshotUrl?: string;
  receiptUrl?: string;
  finalFee?: number;
  isPaid?: boolean;
  referenceNumber?: number; // ✅ NEW FIELD
  isHiddenFromAdmin?: boolean; // ✅ NEW
  deletedByUser?: boolean; // ✅ Added for user soft-delete
  createdAt?: Date;
  updatedAt?: Date;
}

const purchaseRequestSchema = new Schema<IPurchaseRequest>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    itemUrl: { type: String, required: true },
    notes: { type: String },
    estimatedPrice: { type: Number, required: true },
    quantity: { type: Number, default: 1 },
    referenceNumber: { type: String }, // ✅ NEW FIELD ADDED HERE

    status: {
      type: String,
      enum: [
        "Pending",
        "Ordered",
        "Awaiting Payment",
        "Shipped", // ✅ included
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },

    screenshotUrl: { type: String },
    receiptUrl: { type: String },
    finalFee: { type: Number, default: null },
    isPaid: { type: Boolean, default: false },

    // ✅ Soft delete flag for admin panel
    isHiddenFromAdmin: { type: Boolean, default: false },
    deletedByUser: { type: Boolean, default: false }, // ✅ Added here
  },
  { timestamps: true }
);

const PurchaseRequest = mongoose.model<IPurchaseRequest>(
  "PurchaseRequest",
  purchaseRequestSchema
);

export default PurchaseRequest;
