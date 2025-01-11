import { createItem, deleteItem, getAllItems, getSpecificItem, updateItem } from "./handlers_factory_controllers";
import couponModel from "../Model/coupon_model";

/**
 * @desc    Create a new coupons
 * @route   POST /api/v1/categories
 * @access  Private
 */
export const createCoupon = createItem(couponModel)

/**
 * @desc    Get list of coupons
 * @route   GET /api/v1/categories
 * @access  Public
 */
export const getCoupons = getAllItems(couponModel)

/**
 * @desc    Get specific coupons
 * @route   GET /api/v1/categories/:id
 * @access  Public
 */
export const getSpecificCoupon = getSpecificItem(couponModel)

/**
 * @desc    Update specific coupons
 * @route   UPDATE /api/v1/categories/:id
 * @access  Private
 */
export const updateCoupon = updateItem(couponModel)

/**
 * @desc    Delete specific coupons
 * @route   DELETE /api/v1/categories/:id
 * @access  Private
 */
export const deleteCoupon = deleteItem(couponModel)
