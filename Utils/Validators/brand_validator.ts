import { check } from "express-validator";
import { RequestHandler } from "express";
import validatorMiddleware from "../../Middlewares/validatorMiddleware";
import brandModel from "../../Model/brand_modal";

// Updated type definition to handle both validation chains and middleware
type ValidatorMiddleware = (RequestHandler | any)[];

export const getBrandValidator: ValidatorMiddleware = [
    check("id").isMongoId().withMessage("Invalid Brand id format"),
    validatorMiddleware,
];

export const createBrandValidator: ValidatorMiddleware = [
    check("name")
        .notEmpty()
        .withMessage("Brand required")
        .isLength({ min: 3 })
        .withMessage("Too short Brand name")
        .isLength({ max: 20 })
        .withMessage("Too long Brand name")
        .custom(async (value) => {
            // Custom validator to check uniqueness
            const brand = await brandModel.findOne({ name: value });
            if (brand) {
                throw new Error('Brand name already exists');
            }
            return true;
        }),
    validatorMiddleware,
];

export const updateBrandValidator: ValidatorMiddleware = [
    check("id")
        .isMongoId()
        .withMessage("Invalid Brand id format"),
    check("name")
        .optional()
        .notEmpty()
        .withMessage("Brand required")
        .isLength({ min: 3 })
        .withMessage("Too short Brand name")
        .isLength({ max: 20 })
        .withMessage("Too long Brand name"),
    validatorMiddleware,
];

export const deleteBrandValidator: ValidatorMiddleware = [
    check("id").isMongoId().withMessage("Invalid Brand id format"),
    validatorMiddleware,
];