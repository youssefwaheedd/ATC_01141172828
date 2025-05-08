import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "passport";
import authRoutes from "../src/auth/authRoutes.js";
import eventsRoutes from "../src/events/eventRoutes.js";
import bookingRoutes from "../src/bookings/bookingsRoutes.js";
import errorHandler from "../src/middleware/errorHandler.js";

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

app.use("/auth", authRoutes);
app.use("/events", eventsRoutes);
app.use("/bookings", bookingRoutes);

app.get("/", (req, res) => {
  res.send("Hello, this is Areeb Technology's Task!");
});

app.use(errorHandler);

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running locally on port ${PORT}`);
  });
}

export default app;
