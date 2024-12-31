import expressAsyncHandler from "express-async-handler";
import ProductModel from "../Model/product_model";
import { createItem, deleteItem, getAllItems, getSpecificItem, updateItem } from "./handlers_factory_controllers";
import { uploadMixOfImages } from "../Middlewares/uploadImageMiddleware";
import { v4 as uuidv4 } from "uuid";
import { NextFunction, Request, Response } from "express";
import sharp from "sharp";

export const uploadProductImages = uploadMixOfImages([
    { name: "imageCover", maxCount: 1 },
    { name: "images", maxCount: 5 },
]);

export const resizeProductImages = expressAsyncHandler(async (
    req: Request & { files?: any, body: any },
    res: Response,
    next: NextFunction) => {
    // 1 - image processing for imageCover
    if (req.files.imageCover) {
        const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
        await sharp(req.files.imageCover[0].buffer)
            .resize(2000, 1333)
            .toFormat("jpeg")
            .jpeg({ quality: 95 })
            .toFile(`Uploads/Products/${imageCoverFileName}`);
            
        // Save image into our db
        req.body.imageCover = imageCoverFileName;
    }

    // 2 - image processing for images
    if (req.files?.images) {
        req.body.images = [];
        await Promise.all(
            req.files.images.map(async (img: Express.Multer.File, index: number) => {
                const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
                await sharp(img.buffer)
                    .resize(2000, 1333)
                    .toFormat("jpeg")
                    .jpeg({ quality: 95 })
                    .toFile(`Uploads/Products/${imageName}`);

                // Save image into our db
                req.body.images.push(imageName);
                return imageName;
            })
        );
    }

    next();
});

/**
 * @desc    Create a new product
 * @route   POST /api/v1/products
 * @access  Private
 */
export const createProduct = createItem(ProductModel)

/**
 * @desc    Get list of products
 * @route   GET /api/v1/products
 * @access  Public
 */
export const getProducts = getAllItems(ProductModel, 'Products')
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

