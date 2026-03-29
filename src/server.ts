import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err: Error) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1); // kill the process if DB fails — important
  });