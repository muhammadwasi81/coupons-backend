import Coupon from "../models/couponsModel.js";
import User from "../models/userModel.js";

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

export const claimCoupon = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(userId, "req.userId");
    const { couponId } = req.body;

    const coupon = await Coupon.findById(couponId);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    if (coupon.availableCoupons <= 0) {
      return res.status(400).json({ message: "No more coupons available" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const alreadyClaimed = user.claimedCoupons.some(
      (claim) => claim.coupon.toString() === couponId
    );
    if (alreadyClaimed) {
      return res
        .status(400)
        .json({ message: "User has already claimed this coupon" });
    }

    coupon.availableCoupons -= 1;
    user.claimedCoupons.push({ coupon: couponId });

    await coupon.save();
    await user.save();

    res.status(200).json({ message: "Coupon claimed successfully" });
  } catch (error) {
    console.error("Error claiming coupon:", error);
    res
      .status(500)
      .json({ message: "Error claiming coupon", error: error.message });
  }
};

export const getUserClaimedCoupons = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).populate("claimedCoupons.coupon");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const claimedCoupons = user.claimedCoupons.map((claim) => ({
      ...claim.coupon.toObject(),
      claimedAt: claim.claimedAt,
    }));

    res.status(200).json(claimedCoupons);
  } catch (error) {
    console.error("Error fetching user's claimed coupons:", error);
    res.status(500).json({
      message: "Error fetching claimed coupons",
      error: error.message,
    });
  }
};
