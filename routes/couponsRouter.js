import express from "express";
import {
  createCoupon,
  getAllCoupons,
} from "../controllers/couponsController.js";
import upload from "../config/multerConfig.js";

const router = express.Router();

router.post("/create", upload.array("images", 3), createCoupon);
router.get("/all-coupons", getAllCoupons);

export default router;
