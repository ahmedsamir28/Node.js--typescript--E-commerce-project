"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProducts = exports.updateProduct = exports.getSpecificProduct = exports.getProducts = exports.createProduct = void 0;
const asyncHandler = require('express-async-handler');
const slugify_1 = __importDefault(require("slugify"));
const apiError_1 = __importDefault(require("../Utils/apiError"));
const product_model_1 = __importDefault(require("../Model/product_model"));
/**
 * @desc    Create a new product
 * @route   POST /api/v1/products
 * @access  Private
 */
exports.createProduct = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    req.body.slug = (0, slugify_1.default)(req.body.title);
    const product = yield product_model_1.default.create(req.body);
    res.status(201).json({ data: product });
}));
/**
 * @desc    Get list of products
 * @route   GET /api/v1/products
 * @access  Public
 */
exports.getProducts = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 5;
    const skip = (page - 1) * limit;
    const products = yield product_model_1.default.find({ price: req.query.price }).skip(skip).limit(limit).populate({ path: 'category', select: 'name -_id' });
    res.status(200).json({ results: products.length, page, success: true, data: products });
}));
/**
 * @desc    Get specific product
 * @route   GET /api/v1/products/:id
 * @access  Public
 */
exports.getSpecificProduct = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const product = yield product_model_1.default.findById(id).populate({ path: 'category', select: 'name -_id' });
    if (!product) {
        return next(new apiError_1.default(`No product for this ID ${id}`, 404));
    }
    res.status(200).json({ success: true, data: product });
}));
/**
 * @desc    Update specific product
 * @route   UPDATE /api/v1/products/:id
 * @access  Private
 */
exports.updateProduct = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (req.body.title) {
        req.body.slug = (0, slugify_1.default)(req.body.title);
    }
    const productName = yield product_model_1.default.findById(id);
    if ((productName === null || productName === void 0 ? void 0 : productName.title) === req.body.title) {
        return next(new apiError_1.default("The new product name is the same as the existing name.", 400));
    }
    const product = yield product_model_1.default.findByIdAndUpdate({ _id: id }, req.body, { new: true });
    if (!product) {
        return next(new apiError_1.default(`No product for this ID ${id}`, 404));
    }
    res.status(200).json({ success: true, data: product });
}));
/**
 * @desc    Delete specific product
 * @route   DELETE /api/v1/products/:id
 * @access  Private
 */
exports.deleteProducts = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const product = yield product_model_1.default.findByIdAndDelete(id);
    if (!product) {
        return next(new apiError_1.default(`No product for this ID ${id}`, 404));
    }
    res.status(202).send();
}));
// /**
//  * @desc    Search products by keyword
//  * @route   GET /api/v1/products/search
//  * @access  Public
//  */
// export const searchProducts= asyncHandler(async (req: Request, res: Response) => {
//     const keyword: string = req.query.keyword as string; // Define keyword type
//     if (!keyword) {
//         return res.status(400).json({ success: false, message: "Keyword is required" });
//     }
//     const regex = new RegExp(keyword, "i");
//     const categories = await ProductModel.find({
//         $or: [{ title: { $regex: regex } }],
//     });
//     res.status(200).json({ success: true, data: categories });
// });
