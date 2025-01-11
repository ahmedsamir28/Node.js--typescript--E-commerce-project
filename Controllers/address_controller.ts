import {NextFunction, Request, Response} from "express";
import expressAsyncHandler from "express-async-handler";
import userModel from "../Model/user_model";
import user_model from "../Model/user_model";

/**
 * @desc    Add address to user addresses list
 * @route   POST /api/v1/addresses
 * @access  Protected/User
 */
export const addAddress = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // $addToSet =>add address object to user  array if address not exist
    const user = await userModel.findByIdAndUpdate(
        req.user!._id, {
            $addToSet: {addresses: req.body},
        }, {new: true}
    )
    res.status(200).json({
        status: "Success",
        message: 'address added successfully.',
        data: user?.addresses
    })
});

/**
 * @desc    Remove addresses  from user
 * @route   POST /api/v1/addresses
 * @access  Protected/User
 */
export const removeAddress = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // $pull => remove address object user addresses array  if  addressId exist
    const user = await user_model.findByIdAndUpdate(
        req.user!._id, {
            $pull: {addresses: {_id: req.params.addressId}},
        },{new: true}
    )
    res.status(200).json({
        status: "Success",
        message: 'address removed successfully.',
        data: user?.addresses
    })
})

/**
 * @desc    Get addresses user addresses list
 * @route   POST /api/v1/addresses
 * @access  Protected/User
 */
export const getLoggedUserAddresses = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = await userModel.findById(req.user?._id).populate("addresses");
    res.status(200).json({
        status: "Success",
        result:user?.addresses?.length,
        data:user?.addresses
    })
})