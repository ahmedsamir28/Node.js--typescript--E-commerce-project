import mongoose, { Schema, Document } from "mongoose";

// Define the interface for the Review document
interface IReview extends Document {
    review: string;
    ratings: number;
    user: mongoose.Types.ObjectId;
    product: mongoose.Types.ObjectId;
}

// Define the schema
const reviewSchema: Schema<IReview> = new Schema<IReview>(
    {
        review: {
            type: String,
        },
        ratings: {
            type: Number,
            min: [1, 'Min rating value is 1.0'],
            max: [5, 'Max ratings value is 5.0'],
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Review must belong to user'],
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: [true, 'Review must belong to product'],
        }
    },
    {
        timestamps: true,
    }
);

// Middleware to populate user data
// reviewSchema.pre(/^find/, function (this: mongoose.Query<any, any>, next) {
//     this.populate({
//         path: 'user',
//         select: 'name'
//     });
//     next();
// });

// Create and export the model
const reviewModel = mongoose.model<IReview>("Review", reviewSchema);

export default reviewModel;