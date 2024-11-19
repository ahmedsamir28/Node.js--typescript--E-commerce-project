import { NextFunction, Request, Response } from "express";
const asyncHandler = require('express-async-handler')
import categoryModel from "../Model/category_model";
import slugify from "slugify";
import ApiError from "../Utils/apiError";

/**
 * @desc    Create a new category
 * @route   POST /api/v1/categories
 * @access  Private
 */
export const createCategory = asyncHandler(async (req: Request, res: Response) => {
    const { name }: { name: string } = req.body;
    const category = await categoryModel.create({ name, slug: slugify(name) });
    res.status(201).json({ data: category });
});

/**
 * @desc    Get list of categories
 * @route   GET /api/v1/categories
 * @access  Public
 */
export const getCategories = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 5;
    const skip = (page - 1) * limit;

    const categories = await categoryModel.find({}).skip(skip).limit(limit);
    res.status(200).json({ results: categories.length, page, success: true, data: categories });
});

/**
 * @desc    Get specific category
 * @route   GET /api/v1/categories/:id
 * @access  Public
 */
export const getSpecificCategory = asyncHandler(async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const category = await categoryModel.findById(id);
    if (!category) {
        return next(new ApiError(`No category for this ID ${id}`, 404))
    }
    res.status(200).json({ success: true, data: category });
});

/**
 * @desc    Update specific category
 * @route   UPDATE /api/v1/categories/:id
 * @access  Private
 */
export const updateCategory = asyncHandler(async (req: Request<{ id: string }, {}, { name: string }>, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { name } = req.body;
    const categoryName = await categoryModel.findById(id);
    if (categoryName?.name === name) {
        return next(new ApiError("The new category name is the same as the existing name.", 400))
    }

    const category = await categoryModel.findByIdAndUpdate(
        { _id: id },
        { name, slug: slugify(name) },
        { new: true }
    );
    if (!category) {
        return next(new ApiError(`No category for this ID ${id}`, 404))
    }
    res.status(200).json({ success: true, data: category });
});

/**
 * @desc    Delete specific category
 * @route   DELETE /api/v1/categories/:id
 * @access  Private
 */
export const deleteCategory = asyncHandler(async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const category = await categoryModel.findByIdAndDelete(id);

    if (!category) {
        return next(new ApiError(`No category for this ID ${id}`, 404))
    }
    res.status(202).send();
});

/**
 * @desc    Search categories by keyword
 * @route   GET /api/v1/categories/search
 * @access  Public
 */
// export const searchCategories = asyncHandler(async (req: Request, res: Response) => {
//     const keyword: string = req.query.keyword as string; // Define keyword type
//     if (!keyword) {
//         return res.status(400).json({ success: false, message: "Keyword is required" });
//     }
//     const regex = new RegExp(keyword, "i");
//     const categories = await categoryModel.find({
//         $or: [{ name: { $regex: regex } }],
//     });

//     res.status(200).json({ success: true, data: categories });
// });
