import mongoose, { Schema, Document, Model } from "mongoose";

// Define the interface for the Product document
interface IProduct extends Document {
    title: string;
    slug: string;
    description: string;
    quantity: number;
    sold: number;
    price: number;
    priceAfterDiscount?: number;
    colors: string[];
    imageCover: string;
    images: string[];
    category: mongoose.Types.ObjectId;
    subcategories?: mongoose.Types.ObjectId[];
    brand?: mongoose.Types.ObjectId;
    ratingsAverage?: number;
    ratingsQuantity?: number;
    createdAt: Date;
    updatedAt: Date;
}

// Define the schema
const productSchema: Schema<IProduct> = new Schema<IProduct>(
    {
        title: {
            type: String,
            required: true,
            unique:true,
            trim: true,
            minlength: [3, "Too short product title"],
            maxlength: [100, "Too long product title"],
        },
        slug: {
            type: String,
            required: true,
            lowercase: true,
        },
        description: {
            type: String,
            required: [true, "Product description is required"],
            minlength: [20, "Too short product description"],
        },
        quantity: {
            type: Number,
            required: [true, "Product quantity is required"],
        },
        sold: {
            type: Number,
            default: 0,
        },
        price: {
            type: Number,
            required: [true, "Product price is required"],
            trim: true,
            max: [200000, "Too long product price"],
        },
        priceAfterDiscount: {
            type: Number,
        },
        colors: {
            type: [String],
        },
        imageCover: {
            type: String,
            required: [true, "Product Image cover is required"],
        },
        images: {
            type: [String],
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: [true, "Product must belong to category"],
        },
        subcategories: [
            {
                type: Schema.Types.ObjectId,
                ref: "SubCategory",
            },
        ],
        brand: {
            type: Schema.Types.ObjectId,
            ref: "Brand",
        },
        ratingsAverage: {
            type: Number,
            min: [1, "Rating must be above or equal 1.0"],
            max: [5, "Rating must be below or equal 5.0"],
        },
        ratingsQuantity: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Create and export the model
const ProductModel= mongoose.model<IProduct>("Product", productSchema);

export default ProductModel;