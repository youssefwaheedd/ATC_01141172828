import express from "express";
import { getProfile } from "./userController.js"; // Import user controller functions
import authenticateJWT from "../auth/authMiddleware.js"; // Ensure authentication

const router = express.Router();

router.get("/", authenticateJWT, getProfile); // Get user profile

export default router;
