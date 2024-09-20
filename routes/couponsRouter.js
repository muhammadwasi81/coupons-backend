import express from "express";
import {
  createCoupon,
  getAllCoupons,
} from "../controllers/couponsController.js";
import upload from "../config/multerConfig.js";
import { admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", upload.array("images", 3), admin, createCoupon);
router.get("/all-coupons", getAllCoupons);

export default router;
