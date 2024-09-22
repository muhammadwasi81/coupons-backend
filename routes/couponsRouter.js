import express from "express";
import {
  claimCoupon,
  createCoupon,
  getAllCoupons,
  getUserClaimedCoupons,
} from "../controllers/couponsController.js";
import upload from "../config/cloudinaryConfig.js";
import { userMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", upload.array("images", 3), createCoupon);
router.get("/all-coupons", userMiddleware, getAllCoupons);
router.post("/claim", userMiddleware, claimCoupon);
router.get("/user-coupons/:userId", userMiddleware, getUserClaimedCoupons);

export default router;
