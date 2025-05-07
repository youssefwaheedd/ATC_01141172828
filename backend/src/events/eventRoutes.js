import express from "express";
import {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
  getEventById,
} from "./eventController.js";
import isAdmin from "../admin/adminMiddleware.js"; // Ensure admin privileges
import authenticateJWT from "../auth/authMiddleware.js"; // Ensure authentication

const router = express.Router();

// Admin routes
router.get("/:id", authenticateJWT, isAdmin, getEventById); // Get event by ID (admin only)
router.post("/", authenticateJWT, isAdmin, createEvent); // Create event (admin only)
router.put("/:id", authenticateJWT, isAdmin, updateEvent); // Update event (admin only)
router.delete("/:id", authenticateJWT, isAdmin, deleteEvent); // Delete event (admin only)

// Public route
router.get("/", getEvents);

export default router;
