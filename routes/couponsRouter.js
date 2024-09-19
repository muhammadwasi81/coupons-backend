import express from "express";
import {
  createCoupon,
  getAllCoupons,
} from "../controllers/couponsController.js";
import upload from "../config/multerConfig.js";

const router = express.Router();

router.post("/create", upload.array("images", 3), createCoupon);
router.get("/all", getAllCoupons);

router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res
        .status(400)
        .json({ message: "Too many files uploaded. Maximum is 3." });
    }
  }
  res.status(500).json({ message: err.message });
});

export default router;
