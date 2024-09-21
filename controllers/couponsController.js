import Coupon from "../models/couponsModel.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imagesDir = path.join(__dirname, "..", "images");

export const createCoupon = async (req, res) => {
  try {
    const {
      businessName,
      businessInstagram,
      instructions,
      categories,
      totalCoupons,
      minPurchaseQuantity,
      couponValue,
      couponValueUnit,
    } = req.body;

    const categoriesObject = {
      coffee: categories === "coffee",
      breakfast: categories === "breakfast",
      meal: categories === "meal",
      dinner: categories === "dinner",
      lifestyle: categories === "lifestyle",
      beauty: categories === "beauty",
    };

    const couponData = {
      businessName,
      businessInstagram,
      instructions,
      categories: categoriesObject,
      totalCoupons: parseInt(totalCoupons),
      minPurchaseQuantity: parseInt(minPurchaseQuantity),
      couponValue: parseFloat(couponValue),
      couponValueUnit,
    };

    if (req.files && req.files.length > 0) {
      couponData.images = req.files.map((file) => file.filename);
    }

    console.log("Coupon Data:", couponData);

    const newCoupon = new Coupon(couponData);
    await newCoupon.save();
    res
      .status(201)
      .json({ message: "Coupon created successfully", coupon: newCoupon });
  } catch (error) {
    console.error("Error creating coupon:", error);
    res
      .status(400)
      .json({ message: "Error creating coupon", error: error.message });
  }
};

export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();

    const couponsWithFullImageUrls = coupons.map((coupon) => {
      const couponObject = coupon.toObject();
      couponObject.images = couponObject.images.map((image) => {
        return `${req.protocol}://${req.get(
          "host"
        )}/images/${encodeURIComponent(image)}`;
      });
      return couponObject;
    });

    console.log(couponsWithFullImageUrls, "couponsWithFullImageUrls");
    res.status(200).json(couponsWithFullImageUrls);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching coupons", error: error.message });
  }
};
