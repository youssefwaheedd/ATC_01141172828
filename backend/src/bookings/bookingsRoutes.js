import express from "express";
import {
  createBooking,
  getUserBookings,
  deleteBooking,
} from "./bookingsController.js";
import authenticateJWT from "../auth/authMiddleware.js";

const router = express.Router();

// User routes
router.post("/", authenticateJWT, createBooking);
router.get("/", authenticateJWT, getUserBookings);
router.delete("/:id", authenticateJWT, deleteBooking);

export default router;
