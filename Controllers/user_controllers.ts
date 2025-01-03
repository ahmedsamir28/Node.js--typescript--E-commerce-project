import expressAsyncHandler from "express-async-handler";
import {uploadSingleImage} from "../Middlewares/uploadImageMiddleware";
import {createItem, deleteItem, getAllItems, getSpecificItem, updateItem} from "./handlers_factory_controllers";
import {NextFunction, Request, Response} from "express";
import {v4 as uuidv4} from "uuid";
import sharp from "sharp";
import userModel from "../Model/user_model";
import ApiError from "../Utils/apiError";
import user_model from "../Model/user_model";

//Upload single image
export const uploadUserImage = uploadSingleImage('image')

//Image Proccessing with sharp
export const resizeUserIMage = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const fileName = `user-${uuidv4()}-${Date.now()}.jpeg`
    if (req.file) {
        await sharp(req.file.buffer)
            .resize(600, 600)
            .toFormat('jpeg')
            .toFile(`Uploads/Users/${fileName}`)
        // Save image into our db
        req.body.image = fileName
    }
    next()
})
/**
 * @desc    Create a new user
 * @route   POST /api/v1/users
 * @access  Private
 */
export const createUser = createItem(userModel)

/**
 * @desc    Get list of users
 * @route   GET /api/v1/users
 * @access  Public
 */
export const getUsers = getAllItems(userModel)

/**
 * @desc    Get specific user
 * @route   GET /api/v1/users/:id
 * @access  Public
 */
export const getSpecificUser = getSpecificItem(userModel)

/**
 * @desc    Update specific user
 * @route   UPDATE /api/v1/users/:id
 * @access  Private
 */
export const updateUser = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params;
    const document = await user_model.findByIdAndUpdate(
        id,
        req.body,
        {new: true}
    );
    if (!document) {
        return next(new ApiError(`No item for this ID ${id}`, 400))
    }
    res.status(200).json({success: true, data: document});
})

/**
 * @desc    Delete specific user
 * @route   DELETE /api/v1/users/:id
 * @access  Private
 */
export const deleteUser = deleteItem(userModel)
