"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// Define the schema
const productSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Category",
        required: [true, "Product must belong to category"],
    },
    subcategories: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "SubCategory",
        },
    ],
    brand: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, {
    timestamps: true,
});
const setImageUrl = (doc) => {
    if (doc.imageCover) {
        const imageCoverUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`;
        doc.imageCover = imageCoverUrl;
    }
    if (doc.images) {
        const images = [];
        doc.images.forEach((image) => {
            const imageUrl = `${process.env.BASE_URL}/products/${image}`;
            images.push(imageUrl);
        });
        doc.images = images;
    }
};
productSchema.post('init', (doc) => {
    setImageUrl(doc);
});
productSchema.post('save', (doc) => {
    setImageUrl(doc);
});
// Create and export the model
const ProductModel = mongoose_1.default.model("Product", productSchema);
exports.default = ProductModel;
