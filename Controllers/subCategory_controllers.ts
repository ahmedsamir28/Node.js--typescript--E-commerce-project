import { NextFunction, Request, Response } from "express";
import subCategoryModel from "../Model/subCategory_model";
import { createItem, deleteItem, getAllItems, getSpecificItem, updateItem } from "./handlers_factory_controllers";

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
 * @desc    Create filter object for nested routes
 * @route   Middleware for GET requests
 */
export const createFilterObj = (req:CustomRequest, res: Response, next: NextFunction) => {
    let filterObject = {};
    if (req.params.categoryId) filterObject = { category: req.params.categoryId };
    req.filterObj = filterObject;
    next();
};

/**
 * @desc    Create a new subCategory
 * @route   POST /api/v1/subcategories
 * @access  Private
 */
export const createSubCategory = createItem(subCategoryModel)

/**
 * @desc    Get list of subCategories
 * @route   GET /api/v1/subcategories
 * @access  Public
 */
export const getSubCategories = getAllItems(subCategoryModel)
/**
 * @desc    Get specific subCategory
 * @route   GET /api/v1/subcategories/:id
 * @access  Public
 */
export const getSpecificSubCategory = getSpecificItem(subCategoryModel)
/**
 * @desc    Update specific subCategory
 * @route   PATCH /api/v1/subcategories/:id
 * @access  Private
 */
export const updateSubCategory = updateItem(subCategoryModel)

/**
 * @desc    Delete specific subCategory
 * @route   DELETE /api/v1/subcategories/:id
 * @access  Private
 */
export const deleteSubCategory = deleteItem(subCategoryModel)