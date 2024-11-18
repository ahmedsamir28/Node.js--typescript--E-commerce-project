import { NextFunction, Request, Response } from "express";
const asyncHandler = require("express-async-handler");
import slugify from "slugify";
import ApiError from "../Utils/apiError";
import subCategoryModel from "../Model/subCategory_model";
import { FilterQuery } from "mongoose";

// Create a custom interface extending Express Request
interface CustomRequest extends Request {
    filterObj?: Record<string, any>;
}

// Middleware: Set category ID in the request body
export const setCategoryIdToBody = (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.category) req.body.category = req.params.categoryId;
    next();
};

/**
 * @desc    Create a new subCategory
 * @route   POST /api/v1/subcategories
 * @access  Private
 */
export const createSubCategory = asyncHandler(async (req: Request, res: Response) => {
    const { name, category }: { name: string; category: string } = req.body;
    const subCategory = await subCategoryModel.create({
        name,
        slug: slugify(name),
        category,
    });

    res.status(201).json({ data: subCategory });
});

/**
 * @desc    Create filter object for nested routes
 * @route   Middleware for GET requests
 */
export const createFilterObj = (req:CustomRequest, res: Response, next: NextFunction) => {
    let filterObject;
    if (req.params.categoryId) filterObject = { category: req.params.categoryId };
    req.filterObj = filterObject;
    next();
};

/**
 * @desc    Get list of subCategories
 * @route   GET /api/v1/subcategories
 * @access  Public
 */
export const getSubCategories = asyncHandler(async (req: CustomRequest, res: Response) => {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 5;
    const skip = (page - 1) * limit;
    // Default `req.filterObj` to an empty object if undefined
    const filter = req.filterObj || {}
    const subCategories = await subCategoryModel.find(filter).skip(skip).limit(limit);
    res.status(200).json({
        results: subCategories.length,
        page,
        success: true,
        data: subCategories,
    });
});

/**
 * @desc    Get specific subCategory
 * @route   GET /api/v1/subcategories/:id
 * @access  Public
 */
export const getSpecificSubCategory = asyncHandler(async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const subCategory = await subCategoryModel.findById(id);
    if (!subCategory) {
        return next(new ApiError(`No subCategory found for ID ${id}`, 404));
    }
    res.status(200).json({ success: true, data: subCategory });
});

/**
 * @desc    Update specific subCategory
 * @route   PATCH /api/v1/subcategories/:id
 * @access  Private
 */
export const updateSubCategory = asyncHandler(async (req: Request<{ id: string }, {}, { name: string }>, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { name } = req.body;
    const existingSubCategory = await subCategoryModel.findById(id);
    if (existingSubCategory?.name === name) {
        return next(new ApiError("The new name is the same as the existing name.", 400));
    }
    const subCategory = await subCategoryModel.findByIdAndUpdate(
        id,
        { name, slug: slugify(name) },
        { new: true }
    );
    if (!subCategory) {
        return next(new ApiError(`No subCategory found for ID ${id}`, 404));
    }
    res.status(200).json({ success: true, data: subCategory });
});

/**
 * @desc    Delete specific subCategory
 * @route   DELETE /api/v1/subcategories/:id
 * @access  Private
 */
export const deleteSubCategory = asyncHandler(async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const subCategory = await subCategoryModel.findByIdAndDelete(id);
    if (!subCategory) {
        return next(new ApiError(`No subCategory found for ID ${id}`, 404));
    }

    res.status(202).send();
});
