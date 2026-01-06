import User from "../../models/User.js";
import { verifyToken } from "../../lib/jwt.js";
import { connectDB } from "../../lib/db.js";
import { applyCors } from "../../lib/cors.js";

/**
 * Get logged-in user's profile
 */

export default async function handler(req, res) {
  
  try {
     // APPLY CORS FIRST
  const isPreflight = applyCors(req, res);
  if (isPreflight) return;
    await connectDB(); 
    // 1. Get Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Token missing" });
    }

    // 2. Extract token
    const token = authHeader.split(" ")[1];

    // 3. Verify token
    const decoded = verifyToken(token);

    // 4. Fetch user
    const user = await User.findById(decoded.userId).select("-password");

    res.json(user);
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
