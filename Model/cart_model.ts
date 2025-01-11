import mongoose, { Document, Schema } from "mongoose";

interface ICart extends Document {
    cartItems:
    createdAt: Date;
    updatedAt: Date;
}

const couponSchema = new Schema<ICoupon>(
    {
        name: {
            type: String,
            trim: true,
            required: [true, "Coupon name is required"],
            unique: true,
        },
        expire: {
            type: Date,
            required: [true, "Coupon expiration time is required"],

        },
        discount: {
            type: Number,
            required: [true, "Coupon discount value is required"],
            min: [0, "Discount cannot be negative."], // Ensure discount is non-negative
        },
    },
    { timestamps: true }
);

// Create the Coupon model
const couponModel = mongoose.model<ICoupon>("Coupon", couponSchema);

export default couponModel;