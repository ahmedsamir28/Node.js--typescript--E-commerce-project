import expressAsyncHandler from "express-async-handler";
import {Request, Response, NextFunction} from "express";
import userModel from "../Model/user_model";
import bcrypt from "bcrypt";
import ApiError from "../Utils/apiError";
import {createToken} from "../Utils/createToken";
import jwt from "jsonwebtoken";
import apiError from "../Utils/apiError";

/**
 * @desc    SignUp
 * @route   POST /api/v1/auth/signup
 * @access  Public
 */
export const signup = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const {name, email, password, passwordConfirm} = req.body;
    // Check if passwords match
    if (password !== passwordConfirm) {
        return next(new ApiError("Passwords do not match", 400));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
        name,
        email,
        password: hashedPassword,
    });

    // Generate token
    const token = createToken(user._id as string);
    // Remove the password from the response
    const userResponse = {...user.toObject(), password: undefined};
    res.status(201).json({data: userResponse, token});
});

/**
 * @desc    Login
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
export const login = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const {email, password} = req.body;
    // Check if email and password are provided
    if (!email || !password) {
        return next(new ApiError("Please provide email and password", 400));
    }
    const user = await userModel.findOne({email}).select("+password");

    // Check if the user exists and the password is correct
    if (!user || !(await bcrypt.compare(password, user.password as string))) {
        return next(new ApiError("Incorrect email or password", 401));
    }

    // Generate a JWT token
    const token = createToken(user._id as string);
    // Remove the password from the response
    const userResponse = {...user.toObject(), password: undefined};
    res.status(200).json({data: userResponse, token});
});

/**
 * @desc    Protect routes - Ensure user is logged in
 * @access  Private
 */
export const protect = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // 1) Check if the token is in the headers
    let token: string | undefined;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
        return next(
            new ApiError("You are not logged in. Please log in to access this route.", 401)
        );
    }

    // 2) Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as { id: string , iat:number };

    // 3) Check if the user still exists
    const currentUser = await userModel.findById(decoded.id);
    if (!currentUser) {
        return next(new ApiError("The user belonging to this token no longer exists.", 401));
    }

    // 4) Check if user changed their password after the token was created
    if (currentUser.passwordChangedAt) {
        const passwordChangedTimestamp = Math.floor(currentUser.passwordChangedAt.getTime() / 1000);
        if (passwordChangedTimestamp > decoded.iat ) {
            return next(new ApiError("User recently changed their password. Please log in again.", 401));
        }
    }

    req.user = currentUser;
    next();
});

/**
 * @desc    Authorization (User permission)
 * @access  ["admin","manager"]
 */

export  const allowedTo = (...roles:string[])=>expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // 1) access roles
    // 2) access register user (req.user.role)
    const userRole = req.user!.role as string
    if (!roles.includes(userRole)) {
        return next(
            new apiError("You are not allowed to access this route.", 401)
        )
    }
    next()
})