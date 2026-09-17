import express from "express";

import {
  signup,
  verifyEmail,
  login,
  forgotPassword,
  resetPassword,
  logout,
  getCurrentUser,
  refreshAccessToken,
} from "../controllers/auth.controllers.js";

import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/refresh-token", refreshAccessToken);

router.post("/verify-email", verifyEmail);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

router.post("/logout", verifyJWT, logout);

router.get("/me", verifyJWT, getCurrentUser);

export default router;
