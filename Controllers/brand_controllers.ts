import expressAsyncHandler from "express-async-handler";
import { uploadSingleImage } from "../Middlewares/uploadImageMiddleware";
import brandModel from "../Model/brand_model";
import { createItem, deleteItem, getAllItems, getSpecificItem, updateItem } from "./handlers_factory_controllers";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";
import { NextFunction, Request, Response } from "express";

//Upload single image
export const uploadBrandImage = uploadSingleImage('image')

//Image Proccessing with sharp
export const resizeBrandImage = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
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