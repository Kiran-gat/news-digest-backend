
import User from "../../models/User.js";
import { verifyToken } from "../../lib/jwt.js";

/**
 * Save or update user's favorite topics
 */

export default async function handler(req, res) {
  await connectDB(); 
  try {
    // 1. Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Token missing" });
    }

    const token = authHeader.split(" ")[1];

    // 2. Verify token and get userId
    const decoded = verifyToken(token);

    // 3. Get topics from request body
    const { topics } = req.body;

    if (!Array.isArray(topics)) {
      return res.status(400).json({ message: "Topics must be an array" });
    }

    // 4. Update topics for THIS user only
    const user = await User.findByIdAndUpdate(
      decoded.userId,
      { topics },
      { new: true }
    ).select("-password");

    // 5. Send updated user data
    res.json(user);
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
