import User from "../../../models/User.js";
import { verifyToken } from "../../../lib/jwt.js";
import { connectDB } from "../../../lib/db.js";

/**
 * Remove a single topic from user's topics array
 */
export default async function handler(req, res) {
  try {
    await connectDB();

    // 1. Get token
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Token missing" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    // 2. Get topic from body
    const { topic } = req.body;

    if (!topic || typeof topic !== "string") {
      return res.status(400).json({ message: "Valid topic required" });
    }

    // 3. Remove topic
    const user = await User.findByIdAndUpdate(
      decoded.userId,
      { $pull: { topics: topic } },
      { new: true }
    ).select("-password");

    res.json({
      message: "Topic removed successfully",
      topics: user.topics
    });

  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}
