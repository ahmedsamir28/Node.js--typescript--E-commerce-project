import { NextFunction, Request, Response } from "express";
import { createItem, deleteItem, getAllItems, getSpecificItem, updateItem } from "./handlers_factory_controllers";
import reviewModel from "../Model/review_model";

// Define the custom type for filterObj added to the request object
interface CustomRequest extends Request {
    filterObj?: Record<string, any>; // Make filterObj optional
}

// Nested route
// Get /api/v1/products/:productId/reviews
export const createFilterObj = (req: CustomRequest, res: Response, next: NextFunction): void => {
    const filterObject: Record<string, any> = {};
    if (req.params.productId) {
        filterObject.product = req.params.productId;
    }
    req.filterObj = filterObject;  // filterObj is now properly handled
    next();
};

// Nested route
export const setProductAndUserIdToBody = (req: Request, res: Response, next: NextFunction): void => {
    if (!req.body.product) {
        req.body.product = req.params.productId;
    }
    if (!req.body.user) {
        req.body.user = (req as any).user._id; // TypeScript requires type assertion for dynamic properties like `req.user`
    }
    next();
};

/**
 * @desc    Create a new review
 * @route   POST /api/v1/reviews
 * @access  Private
 */
export const createReview = createItem(reviewModel);

/**
 * @desc    Get list of reviews
 * @route   GET /api/v1/reviews
 * @access  Public
 */
export const getReviews = getAllItems(reviewModel);

/**
 * @desc    Get specific review
 * @route   GET /api/v1/reviews/:id
 * @access  Public
 */
export const getSpecificReview = getSpecificItem(reviewModel);

/**
 * @desc    Update specific review
 * @route   PUT /api/v1/reviews/:id
 * @access  Private
 */
export const updateReview = updateItem(reviewModel);

/**
 * @desc    Delete specific review
 * @route   DELETE /api/v1/reviews/:id
 * @access  Private
 */
export const deleteReview = deleteItem(reviewModel);
