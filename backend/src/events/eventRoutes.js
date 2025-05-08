import express from "express";
import {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
  getEventById,
} from "./eventController.js";
import isAdmin from "../admin/adminMiddleware.js";
import authenticateJWT from "../auth/authMiddleware.js";

const router = express.Router();

// Admin routes
router.get("/:id", authenticateJWT, isAdmin, getEventById);
router.post("/", authenticateJWT, isAdmin, createEvent);
router.put("/:id", authenticateJWT, isAdmin, updateEvent);
router.delete("/:id", authenticateJWT, isAdmin, deleteEvent);

// Public route
router.get("/", getEvents);

export default router;
