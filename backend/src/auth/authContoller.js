import bcrypt from "bcrypt";
import prisma from "../db/prismaClient.js";
import { generateToken } from "../utils/token.js";
import jwt from "jsonwebtoken";

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

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

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

    const token = generateToken({ id: user.id, isAdmin: user.isAdmin });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({
      message: "User logged in successfully",
    });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const googleAuthCallback = async (req, res) => {
  const user = req.user;

  try {
    const token = generateToken({ id: user.id, isAdmin: user.isAdmin });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.redirect(process.env.FRONTEND_URL);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  res.status(200).json({ message: "Logged out successfully" });
};

export const getCurrentUser = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        isAdmin: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (err) {
    console.error("Error in getCurrentUser:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
