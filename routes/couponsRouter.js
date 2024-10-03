import express from "express";
import {
  claimCoupon,
  createCoupon,
  deleteCoupon,
  getAllCoupons,
  getUserClaimedCoupons,
  updateCoupon,
  uploadCouponImages,
} from "../controllers/couponsController.js";
import { upload } from "../config/cloudinaryConfig.js";
import { userMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin routes
router.post("/create", upload.array("images", 3), createCoupon);
router.post(
  "/:couponId/upload-image",
  upload.single("image"),
  uploadCouponImages
);
router.delete("/:id", deleteCoupon);
router.put("/:id", upload.array("images", 3), updateCoupon);

// user routes
router.get("/all-coupons", getAllCoupons);
router.post("/claim", userMiddleware, claimCoupon);
router.get("/user-coupons", userMiddleware, getUserClaimedCoupons);

export default router;
