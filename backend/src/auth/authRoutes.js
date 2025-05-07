import express from "express";
import passport from "./authConfig.js";
import {
  registerUser,
  loginUser,
  googleAuthCallback,
  logoutUser,
} from "./authContoller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);

router.get("/google", passport.authenticate("google", { scope: ["email"] }));
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleAuthCallback
);

export default router;
