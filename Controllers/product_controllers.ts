import ProductModel from "../Model/product_model";
import { createItem, deleteItem, getAllItems, getSpecificItem, updateItem } from "./handlers_factory_controllers";

/**
 * @desc    Create a new product
 * @route   POST /api/v1/products
 * @access  Private
 */
export const createProduct  = createItem(ProductModel)

/**
 * @desc    Get list of products
 * @route   GET /api/v1/products
 * @access  Public
 */
export const getProducts = getAllItems(ProductModel,'Products')
/**
 * @desc    Get specific product
 * @route   GET /api/v1/products/:id
 * @access  Public
 */
export const getSpecificProduct = getSpecificItem(ProductModel)
/**
 * @desc    Update specific product
 * @route   UPDATE /api/v1/products/:id
 * @access  Private
 */
export const updateProduct = updateItem(ProductModel)

/**
 * @desc    Delete specific product
 * @route   DELETE /api/v1/products/:id
 * @access  Private
 */
export const deleteProducts = deleteItem(ProductModel)

