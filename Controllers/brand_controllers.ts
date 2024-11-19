import { NextFunction, Request, Response } from "express";
const asyncHandler = require('express-async-handler')
import slugify from "slugify";
import ApiError from "../Utils/apiError";
import brandModel from "../Model/brand_modal";

/**
 * @desc    Create a new brands
 * @route   POST /api/v1/brands
 * @access  Private
 */
export const createBrand = asyncHandler(async (req: Request, res: Response) => {
    const { name }: { name: string } = req.body;
    const brand = await brandModel.create({ name, slug: slugify(name) });
    res.status(200).json({ data: brand });
});

/**
 * @desc    Get list of brands
 * @route   GET /api/v1/brands
 * @access  Public
 */
export const getBrands = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 5;
    const skip = (page - 1) * limit;

    const brands = await brandModel.find({}).skip(skip).limit(limit);
    res.status(200).json({ results: brands.length, page, success: true, data: brands });
});

/**
 * @desc    Get specific brands
 * @route   GET /api/v1/brands/:id
 * @access  Public
 */
export const getSpecificBrand = asyncHandler(async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const brand = await brandModel.findById(id);
    if (!brand) {
        return next(new ApiError(`No brand for this ID ${id}`, 404))
    }
    res.status(200).json({ success: true, data: brand });
});

/**
 * @desc    Update specific brands
 * @route   UPDATE /api/v1/brands/:id
 * @access  Private
 */
export const updateBrand = asyncHandler(async (req: Request<{ id: string }, {}, { name: string }>, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { name } = req.body;
    const brandName = await brandModel.findById(id);
    if (brandName?.name === name) {
        return next(new ApiError("The new brand name is the same as the existing name.", 400))
    }

    const brand = await brandModel.findByIdAndUpdate(
        { _id: id },
        { name, slug: slugify(name) },
        { new: true }
    );
    if (!brand) {
        return next(new ApiError(`No brand for this ID ${id}`, 404))
    }
    res.status(200).json({ success: true, data: brand });
});

/**
 * @desc    Delete specific brands
 * @route   DELETE /api/v1/brands/:id
 * @access  Private
 */
export const deleteBrand = asyncHandler(async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const brand = await brandModel.findByIdAndDelete(id);

    if (!brand) {
        return next(new ApiError(`No brand for this ID ${id}`, 404))
    }
    res.status(202).send();
});

