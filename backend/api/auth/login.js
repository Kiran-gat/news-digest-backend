import bcrypt from "bcrypt";
import User from "../../models/User.js";
import { generateToken } from "../../lib/jwt.js";

/**
 * Login user
 */

export default async function handler(req, res) {
  await connectDB(); 
  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // 2. Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3. Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 4. Generate token
    const token = generateToken(user._id);

    // 5. Respond
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
};
