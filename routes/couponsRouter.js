import express from "express";
import {
  claimCoupon,
  createCoupon,
  deleteCoupon,
  getAllCoupons,
  getUserClaimedCoupons,
  updateCoupon,
} from "../controllers/couponsController.js";
import upload from "../config/cloudinaryConfig.js";
import { userMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin routes
router.post("/create", upload.array("images", 3), createCoupon);
router.delete("/:id", deleteCoupon);
router.put("/:id", updateCoupon);

// user routes
router.get("/all-coupons", getAllCoupons);
router.post("/claim", userMiddleware, claimCoupon);
router.get("/user-coupons", userMiddleware, getUserClaimedCoupons);

export default router;
