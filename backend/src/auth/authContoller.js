import bcrypt from "bcrypt";
import prisma from "../db/prismaClient.js";
import { generateToken } from "../utils/token.js";

// Register
export const registerUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        provider: "local",
      },
    });

    const token = generateToken({ id: user.id, isAdmin: user.isAdmin });

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: { id: user.id, email: user.email },
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || user.provider !== "local") {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Include isAdmin in the JWT token payload
    const token = generateToken({ id: user.id, isAdmin: user.isAdmin });

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user.id, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Google Callback
export const googleAuthCallback = async (req, res) => {
  const user = req.user;

  try {
    const token = generateToken({ id: user.id, isAdmin: user.isAdmin });

    res.cookie("token", token, {
      httpOnly: false,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.redirect(process.env.FRONTEND_URL);
  } catch (err) {
    console.error("Google Auth Callback error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Logout
export const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: false,
    secure: false,
    sameSite: "lax",
  });
  res.status(200).json({ message: "Logged out successfully" });
};
