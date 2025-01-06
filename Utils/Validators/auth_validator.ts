import { check } from "express-validator";
import slugify from "slugify";
import validatorMiddleware from "../../Middlewares/validatorMiddleware";
import userModel from "../../Model/user_model";

/**
 * @desc    Validator for user signup
 */
export const signupValidator = [
    check("name")
        .notEmpty()
        .withMessage("User name is required")
        .isLength({ min: 3 })
        .withMessage("User name must be at least 3 characters")
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),

    check("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email address")
        .custom((val: string) =>
            userModel.findOne({ email: val }).then((user) => {
                if (user) {
                    return Promise.reject(new Error("Email already in use"));
                }
            })
        ),

    check("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters")
        .custom((password, { req } ) => {
            if (password !== req.body.passwordConfirm) {
                throw new Error("Password confirmation does not match");
            }
            return true;
        }),

    check("passwordConfirm")
        .notEmpty()
        .withMessage("Password confirmation is required"),

    validatorMiddleware,
];

/**
 * @desc    Validator for user login
 */
export const loginValidator = [
    check("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email address"),

    check("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),

    validatorMiddleware,
];