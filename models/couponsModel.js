import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  businessName: {
    type: String,
    required: true,
    trim: true,
  },
  businessInstagram: {
    type: String,
    required: true,
    trim: true,
  },
  instructions: {
    type: String,
    trim: true,
  },
  categories: {
    coffee: Boolean,
    breakfast: Boolean,
    meal: Boolean,
    dinner: Boolean,
    lifestyle: Boolean,
    beauty: Boolean,
  },
  totalCoupons: {
    type: Number,
    required: true,
    min: 1,
  },
  minPurchaseQuantity: {
    type: Number,
    required: true,
    min: 1,
  },
  couponValue: {
    type: Number,
    required: true,
    min: 0,
  },
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;
