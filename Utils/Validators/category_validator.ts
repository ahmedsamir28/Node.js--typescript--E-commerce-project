import { check } from "express-validator";
import { RequestHandler } from "express";
import validatorMiddleware from "../../Middlewares/validatorMiddleware";
import slugify from "slugify";

// Updated type definition to handle both validation chains and middleware
type ValidatorMiddleware = (RequestHandler | any)[];

export const getCategoryValidator: ValidatorMiddleware = [
    check("id").isMongoId().withMessage("Invalid category id format"),
    validatorMiddleware,
];

export const createCategoryValidator: ValidatorMiddleware = [
    check("name")
        .notEmpty()
        .withMessage("Category required")
        .isLength({ min: 3 })
        .withMessage("Too short category name")
        .isLength({ max: 20 })
        .withMessage("Too long category name")
        .custom((val ,{req})=>{
            req.body.slug = slugify(val)
            return true
        }),
    validatorMiddleware,
];

export const updateCategoryValidator: ValidatorMiddleware = [
    check("id")
        .isMongoId()
        .withMessage("Invalid category id format"),
    check("name")
        .optional()
        .notEmpty()
        .withMessage("Category required")
        .isLength({ min: 3 })
        .withMessage("Too short category name")
        .isLength({ max: 20 })
        .withMessage("Too long category name")
        .custom((val ,{req})=>{
            req.body.slug = slugify(val)
            return true
        }),
    validatorMiddleware,
];

export const deleteCategoryValidator: ValidatorMiddleware = [
    check("id").isMongoId().withMessage("Invalid category id format"),
    validatorMiddleware,
];