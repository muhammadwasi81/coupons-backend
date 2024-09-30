import express from "express";
import {
  signup,
  login,
  getMe,
  updateProfile,
  forgotPassword,
  resetPassword,
  adminLogin,
} from "../controllers/userController.js";
import { userMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

//Admin routes
router.post("/admin-login", adminLogin);

// user routes
router.post("/signup", signup);
router.post("/login", login);
router.get("/me", userMiddleware, getMe);
router.put("/update-profile", userMiddleware, updateProfile);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:resetToken", resetPassword);

export default router;
