import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  businessName: { type: String, required: true, trim: true },
  businessInstagram: { type: String, required: true, trim: true },
  instructions: { type: String, trim: true },
  categories: [
    {
      type: String,
      enum: ["coffee", "breakfast", "meal", "dinner", "lifestyle", "beauty"],
      required: true,
    },
  ],
  totalCoupons: { type: Number, required: true, min: 1 },
  availableCoupons: { type: Number, required: true, min: 0 },
  minPurchaseQuantity: { type: Number, required: true, min: 1 },
  couponValue: { type: Number, required: true, min: 0 },
  couponValueUnit: {
    type: String,
    enum: ["percentage", "fixed"],
    required: true,
  },
  images: [
    {
      type: String,
      validate: {
        validator: function (v) {
          return this.images.length <= 3;
        },
        message: "Maximum of 3 images allowed",
      },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  expiresAt: {
    type: Date,
    default: function () {
      return new Date(+this.createdAt + 30 * 24 * 60 * 60 * 1000);
    },
  },
  claimedBy: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      claimedAt: { type: Date, default: Date.now },
      expiresAt: { type: Date },
    },
  ],
});

couponSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;
