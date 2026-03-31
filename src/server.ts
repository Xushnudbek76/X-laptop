import mongoose from "mongoose";
import dotenv from 'dotenv';
import app from "app"
dotenv.config();

mongoose
  .connect(process.env.MONGO_URI as string)
  .then((data) => {
    console.log("MongoDB connected successfully");
    const PORT = process.env.PORT ?? 3003;
    app.listen(PORT, function() {
      console.log(`The server is running successfully 😊 on port: ${PORT}`);
    })
  })
  .catch((err: Error) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1); 
  });