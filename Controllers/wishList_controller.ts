import {NextFunction, Request, Response} from "express";
import expressAsyncHandler from "express-async-handler";
import userModel, {IUser} from "../Model/user_model";
import ApiError from "../Utils/apiError";


/**
 * @desc    Add product to wishList
 * @route   POST /api/v1/wishlist
 * @access  Private/User
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