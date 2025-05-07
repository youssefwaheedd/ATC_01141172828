// src/admin/adminRoutes.js
import express from "express";
import {
  createAdmin,
  getAllAdmins,
  updateAdmin,
  deleteAdmin,
} from "./adminController.js";
import authenticateJWT from "../auth/authMiddleware.js"; // Auth middleware for protected routes
import isAdmin from "./adminMiddleware.js";

const router = express.Router();

// Protect these routes with authenticateJWT to ensure only authenticated users can access them
router.post("/create", authenticateJWT, createAdmin); // Only admins can create new admins
router.get("/", authenticateJWT, getAllAdmins); // Get all admins
router.put("/:id", authenticateJWT, updateAdmin); // Update an admin
router.delete("/:id", authenticateJWT, deleteAdmin); // Delete an admin
router.get("/test", authenticateJWT, (req, res) => {
  res.json({ message: "You are an admin 🎉" });
});
export default router;
