import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  // Make sure the user object includes isAdmin
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1d" });
};
