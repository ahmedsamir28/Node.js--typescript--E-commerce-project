import expressAsyncHandler from "express-async-handler";
import { uploadSingleImage } from "../Middlewares/uploadImageMiddleware";
import categoryModel from "../Model/category_model";
import { createItem, deleteItem, getAllItems, getSpecificItem, updateItem } from "./handlers_factory_controllers";
import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";

//Upload single image
export const uploadCategoryImage = uploadSingleImage('image')

//Image Proccessing with sharp
export const resizeImage = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const fileName = `category-${uuidv4()}-${Date.now()}.jpeg`
    if (req.file) {
        await sharp(req.file.buffer)
        .resize(600,600)
        .toFormat('jpeg')
        .toFile(`Uploads/Categories/${fileName}`)
        // Save image into our db
        req.body.image = fileName
    }
    next()
})
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
export const deleteCategory = deleteItem(categoryModel)
