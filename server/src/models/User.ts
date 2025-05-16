import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs"; // ✅ Add this

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  virtualAddress?: string;
  hubId?: mongoose.Types.ObjectId;
  isAdmin: boolean;
  referralCode?: string;
  referredBy?: string;
  credits?: number;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}

const userSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    virtualAddress: { type: String, unique: true },
    hubId: { type: mongoose.Schema.Types.ObjectId, ref: "Hub" },
    isAdmin: { type: Boolean, default: false },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },

    // 🎯 Referral fields
    referralCode: { type: String, unique: true },
    referredBy: { type: String, default: null },
    credits: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// ✅ Auto-hash password before saving
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model<IUser>("User", userSchema);
export default User;
