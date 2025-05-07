import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "passport";
import authRoutes from "./src/auth/authRoutes.js";
import adminRoutes from "./src/admin/adminRoutes.js";
import eventsRoutes from "./src/events/eventRoutes.js";
import bookingRoutes from "./src/bookings/bookingsRoutes.js";
import userRoutes from "./src/user/userRoutes.js";
import errorHandler from "./src/middleware/errorHandler.js";
import isAdmin from "./src/admin/adminMiddleware.js";
import authenticateJWT from "./src/auth/authMiddleware.js";

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

app.use("/auth", authRoutes);
app.use("/admin", isAdmin, adminRoutes);
app.use("/events", eventsRoutes);
app.use("/bookings", bookingRoutes);
app.use("/user", userRoutes);

app.get("/", (req, res) => {
  res.send("Hello, this is Areeb Technology's Task!");
});

app.use(errorHandler); // Place this AFTER all routes

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
