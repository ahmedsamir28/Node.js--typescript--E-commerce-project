import expressAsyncHandler from "express-async-handler";
import {Request, Response, NextFunction} from "express";
import userModel from "../Model/user_model";
import bcrypt from "bcrypt";

export const signup = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const {name, email, password, passwordConfirm} = req.body;
    // Check if passwords match
    if (password !== passwordConfirm) {
        res.status(400).json({message: "Passwords do not match"});
        return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        name,
        email,
        password: hashedPassword,
    });

    // Remove the password from the response
    const userResponse = { ...user.toObject(), password: undefined };

    res.status(201).json({ data: userResponse });});