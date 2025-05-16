import dotenv from "dotenv";
dotenv.config(); // must be first
import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  console.log("MONGO_URI:", uri); // ← DEBUG LINE

  if (!uri) throw new Error("MONGO_URI is undefined");

  const conn = await mongoose.connect(uri);
  console.log(`MongoDB connected ✅: ${conn.connection.host}`);
};

export default connectDB;
