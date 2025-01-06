import expressAsyncHandler from "express-async-handler";
import {uploadSingleImage} from "../Middlewares/uploadImageMiddleware";
import {createItem, deleteItem, getAllItems, getSpecificItem, updateItem} from "./handlers_factory_controllers";
import {NextFunction, Request, Response} from "express";
import {v4 as uuidv4} from "uuid";
import sharp from "sharp";
import userModel from "../Model/user_model";
import ApiError from "../Utils/apiError";
import user_model from "../Model/user_model";
import bcrypt from "bcrypt";
import {createToken} from "../Utils/createToken";

//Upload single image
export const uploadUserImage = uploadSingleImage('profileImg')

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
        {
            name: req.body.name,
            slug: req.body.slug,
            phone: req.body.phone,
            email: req.body.email,
            profileImg: req.body.profileImg,
            role: req.body.role,
        },
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

//Changes  user password
export const changeUserPassword = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const document = await userModel.findByIdAndUpdate(
        req.params.id,
        {
            password: await bcrypt.hash(req.body.password, 10),
            passwordChangedAt: Date.now()

        },
        {
            new: true
        }
    )
    if (!document) {
        return next(
            new ApiError(`no document for this id ${req.params.id}`, 404)
        )
    }
    res.status(200).json({success: true, data: document});
});

/**
 * @desc    Get logged user password
 * @route   GET /api/v1/users/getMe
 * @access  Private/Product
 */
export const getLoggedUserData = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id;
    console.log(userId)
    // 1) Find the user by ID
    const user = await userModel.findById(userId);
    if (!user) {
        return next(new ApiError("User not found", 404));
    }

    // 2) Remove the password from the response
    const userResponse = {...user.toObject(), password: undefined};

    // 3) Send the response
    res.status(200).json({
        status: "success",
        data: userResponse,
    });
});

/**
 * @desc    Update logged user password
 * @route   PUT  /api/v1/users/updateMyPassword
 * @access  Private/Product
 */
export const updateLoggedUserPassword = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { currentPassword, password, passwordConfirm } = req.body;
    // 1) Check if new password and confirm password match
    if (password !== passwordConfirm) {
        return next(new ApiError("New password and confirm password do not match", 400));
    }
    // 2) Get the user from the database
    const user = await userModel.findById(req.user?._id).select("+password");
    if (!user) {
        return next(new ApiError("User not found", 404));
    }

    // 3) Check if the current password is correct
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
        return next(new ApiError("Current password is incorrect", 401));
    }

    // 4) Hash the new password and update the user
    user.password = await bcrypt.hash(password, 10);
    user.passwordChangedAt = new Date(Date.now());
    await user.save();

    const token = createToken(user._id as string);

    const userResponse = { ...user.toObject(), password: undefined };

    res.status(200).json({ success: true, data: userResponse, token });
});

/**
 * @desc    Update logged user data (without password, role)
 * @route   PUT /api/v1/users/updateMe
 * @access  Private/Protect
 */
export const updateLoggedUserData = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, phone } = req.body;

    // 1) Update user data
    const updatedUser = await userModel.findByIdAndUpdate(
        req.user?._id,
        {
            name,
            email,
            phone,
        },
        { new: true }
    );

    // 2) Check if the user was found and updated
    if (!updatedUser) {
        return next(new ApiError("User not found", 404));
    }

    // 3) Send the response
    res.status(200).json({
        status: "success",
        data: updatedUser,
    });
});

/**
 * @desc    Deactivate logged user
 * @route   DELETE /api/v1/users/deleteMe
 * @access  Private/Protect
 */
export const deleteLoggedUserData = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // 1) Deactivate the user
    const user = await userModel.findByIdAndDelete(
        req.user?._id,
        { active: false },
    );

    // 2) Check if the user was found and deactivated
    if (!user) {
        return next(new ApiError("User not found", 404));
    }

    // 3) Send the response
    res.status(204).json({
        status: "success",
        data: null,
    });
});