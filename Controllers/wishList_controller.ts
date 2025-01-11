import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import userModel, { IUser } from "../Model/user_model";
import ApiError from "../Utils/apiError";


/**
 * @desc    Add product to wishList
 * @route   POST /api/v1/wishlist
 * @access  protected/User
 */
export const addProductToWishList = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // if (!req.user) {
    //     return next(new ApiError('User not authenticated', 401));
    // }

    const user = await userModel.findByIdAndUpdate(
        req.user?._id,
        {
            $addToSet: { wishlist: req.body.productId },
        },
        { new: true }
    ).populate('wishlist');

    // if (!user) {
    //     return next(new ApiError('User not found', 404));
    // }

    res.status(200).json({
        status: "success",
        message: "Product added to wishlist",
        data: user?.wishlist
    });
});

/**
 * @desc    Remove product from wishList
 * @route   POST /api/v1/wishlist
 * @access  protected/User
 */
export const removeProductFromWishList = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // $pull => remove productId to wishlist array if productId not exist 
    const user = await userModel.findByIdAndUpdate(
        req.user?._id,
        {
            $pull: { wishlist: req.params.productId }
        },
        { new: true }
    )
    res.status(200).json({
        status: "success",
        message: "Product removed from wishlist",
        data: user?.wishlist
    })
})

/**
 * @desc    Get logged user wishList
 * @route   POST /api/v1/wishlist
 * @access  protected/User
 */
export const getLoggedUserWishList = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = await userModel.findById(req.user?._id).populate('wishlist')
    res.status(200).json({
        status:'Success',
        result:user?.wishlist?.length,
        data: user?.wishlist
    })
})