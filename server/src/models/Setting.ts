import mongoose, { Schema, Document } from "mongoose";

export interface ISetting extends Document {
  globalMessage: string;
}

const SettingSchema: Schema = new Schema({
  globalMessage: {
    type: String,
    default: "",
  },
});

export default mongoose.model<ISetting>("Setting", SettingSchema);
