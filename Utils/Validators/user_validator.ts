import { Request } from "express";
import { check, body } from "express-validator";
import slugify from "slugify";
import bcrypt from "bcrypt";
import validatorMiddleware from "../../Middlewares/validatorMiddleware";
import userModel from "../../Model/user_model";
import user_model from "../../Model/user_model";
/**
 * @desc    Validator for creating a user
 */
export const createUserValidator = [
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
        .custom((password, { req }) => {
            if (password !== req.body.passwordConfirm) {
                throw new Error("Password confirmation does not match");
            }
            return true;
        }),

    check("passwordConfirm")
        .notEmpty()
        .withMessage("Password confirmation is required"),

    check("phone")
        .optional()
        .isMobilePhone(["ar-EG", "ar-SA"])
        .withMessage("Invalid phone number, only Egyptian and Saudi Arabian numbers are accepted"),

    check("profileImg").optional(),
    check("role").optional(),

    validatorMiddleware,
];

/**
 * @desc    Validator for getting a user by ID
 */
export const getUserValidator = [
    check("id").isMongoId().withMessage("Invalid User ID format"),
    validatorMiddleware,
];

/**
 * @desc    Validator for updating a user
 */
export const updateUserValidator = [
    check("id").isMongoId().withMessage("Invalid User ID format"),
    body("name")
        .optional()
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
            user_model.findOne({ email: val }).then((user) => {
                if (user) {
                    return Promise.reject(new Error("Email already in use"));
                }
            })
        ),
    check("phone")
        .optional()
        .isMobilePhone(["ar-EG", "ar-SA"])
        .withMessage("Invalid phone number, only Egyptian and Saudi Arabian numbers are accepted"),

    check("profileImg").optional(),
    check("role").optional(),

    validatorMiddleware,
];

/**
 * @desc    Validator for changing a user's password
 */
export const changeUserPasswordValidator = [
    check("id").isMongoId().withMessage("Invalid User ID format"),
    body("currentPassword")
        .notEmpty()
        .withMessage("You must enter your current password"),
    body("passwordConfirm")
        .notEmpty()
        .withMessage("You must enter the password confirmation"),
    body("password")
        .notEmpty()
        .withMessage("You must enter a new password")
        .custom(async (val, { req }) => {
            // 1) Verify current password
            const user = await userModel.findById(req.params?.id);
            if (!user) {
                throw new Error("There is no user for this ID");
            }
            const isCorrectPassword = await bcrypt.compare(
                req.body.currentPassword,
                user.password
            );
            if (!isCorrectPassword) {
                throw new Error("Incorrect current password");
            }

            // 2) Verify password confirmation
            if (val !== req.body.passwordConfirm) {
                throw new Error("Password confirmation does not match");
            }
            return true;
        }),

    validatorMiddleware,
];

/**
 * @desc    Validator for deleting a user
 */
export const deleteUserValidator = [
    check("id").isMongoId().withMessage("Invalid User ID format"),
    validatorMiddleware,
];

/**
 * @desc    Validator for updating logged-in user data
 */
export const updateLoggedUserValidator = [
    body("name")
        .optional()
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
    check("phone")
        .optional()
        .isMobilePhone(["ar-EG", "ar-SA"])
        .withMessage("Invalid phone number, only Egyptian and Saudi Arabian numbers are accepted"),

    validatorMiddleware,
];