import mongoose from "mongoose";

/**
 * Connects the application to MongoDB Atlas
 * This function is called once when server starts
 */
export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1); // Stop server if DB fails
  }
};
