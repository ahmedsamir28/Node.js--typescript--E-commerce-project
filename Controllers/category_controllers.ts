import { uploadSingleImage } from "../Middlewares/uploadImageMiddleware";
import categoryModel from "../Model/category_model";
import { createItem, deleteItem, getAllItems, getSpecificItem, updateItem } from "./handlers_factory_controllers";

export const uploadCategoryImage = uploadSingleImage('image')

/**
 * @desc    Create a new category
 * @route   POST /api/v1/categories
 * @access  Private
 */
export const createCategory = createItem(categoryModel)

/**
 * @desc    Get list of categories
 * @route   GET /api/v1/categories
 * @access  Public
 */
export const getCategories = getAllItems(categoryModel)

/**
 * @desc    Get specific category
 * @route   GET /api/v1/categories/:id
 * @access  Public
 */
export const getSpecificCategory = getSpecificItem(categoryModel)

/**
 * @desc    Update specific category
 * @route   UPDATE /api/v1/categories/:id
 * @access  Private
 */
export const updateCategory = updateItem(categoryModel)

/**
 * @desc    Delete specific category
 * @route   DELETE /api/v1/categories/:id
 * @access  Private
 */
export const deleteCategory =deleteItem(categoryModel)
