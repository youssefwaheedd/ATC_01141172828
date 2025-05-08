import express from "express";
import passport from "./authConfig.js";
import {
  registerUser,
  loginUser,
  googleAuthCallback,
  logoutUser,
  getCurrentUser,
} from "./authContoller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", getCurrentUser);

router.get("/google", passport.authenticate("google", { scope: ["email"] }));
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleAuthCallback
);

export default router;
