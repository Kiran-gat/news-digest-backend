import mongoose from "mongoose";

/**
 * User Schema
 * Defines structure of user document in MongoDB
 */
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true, // No duplicate emails
    },
    password: {
      type: String,
      required: true, // Stored as HASH
    },
      // NEW: User's favorite news topics
    topics: {
      type: [String], // Example: ["technology", "sports"]
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
