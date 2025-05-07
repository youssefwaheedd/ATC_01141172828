// src/bookings/bookingsRoutes.js
import express from "express";
import {
  createBooking,
  getUserBookings,
  deleteBooking,
} from "./bookingsController.js";
import authenticateJWT from "../auth/authMiddleware.js"; // Ensure authentication for users

const router = express.Router();

// User routes
router.post("/", authenticateJWT, createBooking); // User creates a booking
router.get("/", authenticateJWT, getUserBookings); // User gets all their bookings
router.delete("/:id", authenticateJWT, deleteBooking); // User deletes a booking

export default router;
