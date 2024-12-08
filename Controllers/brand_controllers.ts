import brandModel from "../Model/brand_model";
import { createItem, deleteItem, getAllItems, getSpecificItem, updateItem } from "./handlers_factory_controllers";

/**
 * @desc    Create a new brands
 * @route   POST /api/v1/brands
 * @access  Private
 */
export const createBrand = createItem(brandModel)
/**
 * @desc    Get list of brands
 * @route   GET /api/v1/brands
 * @access  Public
 */
export const getBrands = getAllItems(brandModel)
/**
 * @desc    Get specific brands
 * @route   GET /api/v1/brands/:id
 * @access  Public
 */
export const getSpecificBrand =getSpecificItem(brandModel)
/**
 * @desc    Update specific brands
 * @route   UPDATE /api/v1/brands/:id
 * @access  Private
 */
export const updateBrand = updateItem(brandModel)
/**
 * @desc    Delete specific brands
 * @route   DELETE /api/v1/brands/:id
 * @access  Private
 */
export const deleteBrand = deleteItem(brandModel)