import User from "../../models/User.js";
import { verifyToken } from "../../lib/jwt.js";
import { connectDB } from "../../lib/db.js";

/**
 * Toggle email subscription ON / OFF
 */
export default async function handler(req, res) {
  try {
    await connectDB();

    // 1. Get JWT from header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Token missing" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    // 2. Read subscription value from request
    const { isSubscribed } = req.body;

    if (typeof isSubscribed !== "boolean") {
      return res.status(400).json({
        message: "isSubscribed must be true or false"
      });
    }

    // 3. Update subscription status
    const user = await User.findByIdAndUpdate(
      decoded.userId,
      { isSubscribed },
      { new: true }
    ).select("-password");

    // 4. Respond with updated status
    res.json({
      message: "Subscription updated successfully",
      isSubscribed: user.isSubscribed
    });

  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}
