import express from "express";
import {
  signup,
  login,
  getMe,
  updateProfile,
  forgotPassword,
  resetPassword,
  getAllUsers,
  toggleUserBlock,
  deleteAccount,
} from "../controllers/userController.js";
import { userMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();
// Admi routes
router.get("/all-users", getAllUsers);
router.post("/toggle-block/:userId", toggleUserBlock);

// user routes
router.post("/signup", signup);
router.post("/login", login);
router.get("/me", userMiddleware, getMe);
router.put("/update-profile", userMiddleware, updateProfile);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:resetToken", resetPassword);
router.delete("/delete-account", userMiddleware, deleteAccount);

export default router;
