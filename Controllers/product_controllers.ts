import { NextFunction, Request, Response } from "express";
const asyncHandler = require('express-async-handler')
import slugify from "slugify";
import ApiError from "../Utils/apiError";
import ProductModel from "../Model/product_model";
import ApiFeatures from "../Utils/apiFeatures";

/**
 * @desc    Create a new product
 * @route   POST /api/v1/products
 * @access  Private
 */
export const createProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    req.body.slug = slugify(req.body.title)
    const product = await ProductModel.create(req.body);
    res.status(201).json({ data: product });
});

/**
 * @desc    Get list of products
 * @route   GET /api/v1/products
 * @access  Public
 */
export const getProducts = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 5;
    const skip = (page - 1) * limit;

    // const queryStringObject = { ...req.query };
    // const excludesFields: string[] = ['page', 'sort', 'limit', 'fields', 'keyword'];
    // excludesFields.forEach((element) => delete queryStringObject[element]);

    // let queryStr = JSON.stringify(queryStringObject);
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    // let filter: any = {};

    // if (queryStr) {
    //     filter = { ...filter, ...JSON.parse(queryStr) };
    // }

    // if (req.query.keyword) {
    //     const keyword = req.query.keyword as string;
    //     const regex = new RegExp(keyword, 'i');
    //     filter.$or = [
    //         { title: { $regex: regex } },
    //         { description: { $regex: regex } }
    //     ];
    // }

    // const sort = req.query.sort ? (req.query.sort as string).split(',').join(' ') : '-createAt';
    // const fields = req.query.fields ? (req.query.fields as string).split(',').join(' ') : '';

    // const products = await ProductModel.find(filter)
    //     .select(fields)
    //     .skip(skip)
    //     .sort(sort)
    //     .limit(limit);
const apiFeatures = new ApiFeatures(ProductModel,req.query).filter()
const { mongooseQuery } = apiFeatures;
const documents = await mongooseQuery;
    res.status(200).json({ results: documents.length, page, success: true, data: documents });
});

/**
 * @desc    Get specific product
 * @route   GET /api/v1/products/:id
 * @access  Public
 */
export const getSpecificProduct = asyncHandler(async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const product = await ProductModel.findById(id).populate({ path: 'category', select: 'name -_id' });
    if (!product) {
        return next(new ApiError(`No product for this ID ${id}`, 404))
    }
    res.status(200).json({ success: true, data: product });
});

/**
 * @desc    Update specific product
 * @route   UPDATE /api/v1/products/:id
 * @access  Private
 */
export const updateProduct = asyncHandler(async (req: Request<{ id: string }, {}, { title: string, slug: string }>, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (req.body.title) {
        req.body.slug = slugify(req.body.title)
    }

    const productName = await ProductModel.findById(id);
    if (productName?.title === req.body.title) {
        return next(new ApiError("The new product name is the same as the existing name.", 400))
    }

    const product = await ProductModel.findByIdAndUpdate(
        { _id: id },
        req.body,
        { new: true }
    );
    if (!product) {
        return next(new ApiError(`No product for this ID ${id}`, 404))
    }
    res.status(200).json({ success: true, data: product });
});

/**
 * @desc    Delete specific product
 * @route   DELETE /api/v1/products/:id
 * @access  Private
 */
export const deleteProducts = asyncHandler(async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const product = await ProductModel.findByIdAndDelete(id);

    if (!product) {
        return next(new ApiError(`No product for this ID ${id}`, 404))
    }
    res.status(202).send();
});

// /**
//  * @desc    Search products by keyword
//  * @route   GET /api/v1/products/search
//  * @access  Public
//  */
export const searchProducts = asyncHandler(async (req: Request, res: Response) => {
    const keyword: string = req.query.keyword as string; // Define keyword type
    if (!keyword) {
        return res.status(400).json({ success: false, message: "Keyword is required" });
    }
    const regex = new RegExp(keyword, "i");

    const categories = await ProductModel.find({
        $or: [{ title: { $regex: regex } }],
    });

    res.status(200).json({ success: true, data: categories });
});

