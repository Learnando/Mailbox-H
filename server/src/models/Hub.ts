import mongoose from "mongoose";

const hubSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    code: { type: String, unique: true, required: true }, // e.g. "HUB001"
  },
  {
    timestamps: true,
  }
);

const Hub = mongoose.model("Hub", hubSchema);
export default Hub;
