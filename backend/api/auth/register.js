import bcrypt from "bcrypt";
import User from "../../models/User.js";
import { connectDB } from "../../lib/db.js";


/**
 * Register new user
 */

export default async function handler(req, res) {
  
  try {
    if (req.method !== "POST") {
  return res.status(405).json({
    message: "Only POST method allowed"
  });
}
    await connectDB(); 
    const { email, password } = req.body;

    // 1. Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Save user
    await User.create({
      email,
      password: hashedPassword,
    });

    // 5. Respond
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Registration failed" });
  }
};
