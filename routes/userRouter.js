import express from "express";
import {
  signup,
  login,
  getMe,
  updateProfile,
} from "../controllers/userController.js";
import { userMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", userMiddleware, getMe);
router.put("/update-profile", userMiddleware, updateProfile);

export default router;
