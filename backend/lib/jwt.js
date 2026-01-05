import jwt from "jsonwebtoken";

/**
 * Generates JWT token for a user
 */
export const generateToken = (userId) => {
  return jwt.sign(
    { userId }, // Payload
    process.env.JWT_SECRET,
    { expiresIn: "1h" } // Token validity
  );
};

/**
 * Verifies JWT token
 */
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
