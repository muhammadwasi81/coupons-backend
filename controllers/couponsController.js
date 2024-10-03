import Coupon from "../models/couponsModel.js";
import { cloudinary } from "../config/cloudinaryConfig.js";
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
      availableCoupons: parseInt(totalCoupons),
      minPurchaseQuantity: parseInt(minPurchaseQuantity),
      couponValue: parseFloat(couponValue),
      couponValueUnit,
    };

    if (req.files && req.files.length > 0) {
      couponData.images = req.files.map((file) => file.path);
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
      couponObject.images = couponObject.images.map((image) => image);
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

export const getUserClaimedCoupons = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(userId, "LLLLLLL");
    const now = new Date();

    const coupons = await Coupon.find({
      claimedBy: {
        $elemMatch: {
          user: userId,
          expiresAt: { $gt: now },
        },
      },
    });

    if (coupons.length === 0) {
      return res
        .status(404)
        .json({ message: "No active claimed coupons found" });
    }

    const activeCoupons = coupons.map((coupon) => {
      const couponObject = coupon.toObject();
      couponObject.claimedBy = couponObject.claimedBy.filter(
        (claim) => claim.user.toString() === userId && claim.expiresAt > now
      );
      return couponObject;
    });

    res.status(200).json(activeCoupons);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching user's claimed coupons",
      error: error.message,
    });
  }
};

export const claimCoupon = async (req, res) => {
  try {
    const userId = req.user.id;
    const { couponId } = req.body;

    if (!couponId) {
      return res.status(400).json({ message: "Coupon ID is required" });
    }

    const coupon = await Coupon.findById(couponId);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    if (coupon.availableCoupons <= 0) {
      return res.status(400).json({ message: "No more coupons available" });
    }

    if (new Date() > coupon.expiresAt) {
      return res.status(400).json({ message: "Coupon has expired" });
    }

    const alreadyClaimed = coupon.claimedBy.some(
      (claim) =>
        claim.user.toString() === userId && new Date() < claim.expiresAt
    );
    if (alreadyClaimed) {
      return res
        .status(400)
        .json({ message: "User already has an active claim for this coupon" });
    }

    const claimExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    coupon.availableCoupons -= 1;
    coupon.claimedBy.push({ user: userId, expiresAt: claimExpiresAt });

    await coupon.save();

    res.status(200).json({
      message: "Coupon claimed successfully",
      expiresAt: claimExpiresAt,
    });
  } catch (error) {
    console.error("Error claiming coupon:", error);
    res
      .status(500)
      .json({ message: "Error claiming coupon", error: error.message });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    res.status(200).json({ message: "Coupon deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting coupon", error: error.message });
  }
};

export const updateCoupon = async (req, res) => {
  try {
    const couponId = req.params.id;
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
      couponData.images = req.files.map((file) => file.path);
    }

    console.log("Updated Coupon Data:", couponData);

    const updatedCoupon = await Coupon.findByIdAndUpdate(couponId, couponData, {
      new: true,
    });

    if (!updatedCoupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    res
      .status(200)
      .json({ message: "Coupon updated successfully", coupon: updatedCoupon });
  } catch (error) {
    console.error("Error updating coupon:", error);
    res
      .status(400)
      .json({ message: "Error updating coupon", error: error.message });
  }
};

export const uploadCouponImages = async (req, res) => {
  try {
    const { couponId } = req.params;
    console.log(couponId);
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const coupon = await Coupon.findById(couponId);
    console.log(coupon, "coupon");
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    const uploadResult = await cloudinary.uploader.upload(req.file.path);

    coupon.images.push(uploadResult.secure_url);

    await coupon.save();

    res.status(200).json({
      message: "Image uploaded successfully",
      coupon: coupon,
    });
  } catch (error) {
    console.error("Error uploading coupon image:", error);
    res
      .status(400)
      .json({ message: "Error uploading image", error: error.message });
  }
};
