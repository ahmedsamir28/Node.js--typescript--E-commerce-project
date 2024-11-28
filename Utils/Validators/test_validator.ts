import { check, body } from "express-validator";
import { RequestHandler, Request } from "express";
import { Types } from "mongoose";
import validatorMiddleware from "../../Middlewares/validatorMiddleware";
import categoryModel from "../../Model/category_model";
import subCategoryModel from "../../Model/subCategory_model";
import ProductModel from "../../Model/product_model";

// Define interfaces for better type safety
interface ProductBody {
    title: string;
    description: string;
    quantity: number;
    sold?: number;
    price: number;
    priceAfterDiscount?: number;
    colors?: string[];
    imageCover: string;
    images?: string[];
    category: string;
    subcategories?: string[];
    brand?: string;
    ratingsAverage?: number;
    ratingsQuantity?: number;
}

// Custom error messages for reusability
const ERROR_MESSAGES = {
    INVALID_ID: "Invalid ID format",
    TITLE_EXISTS: "Product with this title already exists",
    INVALID_DISCOUNT: "Price after discount must be lower than price",
    INVALID_SUBCATEGORIES: "Some subcategories do not belong to the specified category",
    RATING_RANGE: "Rating must be between 1.0 and 5.0",
} as const;

// Helper functions for validation
const isValidMongoId = (id: string): boolean => Types.ObjectId.isValid(id);

const checkProductTitleExists = async (title: string): Promise<boolean> => {
    const product = await ProductModel.findOne({ title }, 'title');
    return !!product;
};

const validateSubcategories = async (subcategoryIds: string[], categoryId: string): Promise<boolean> => {
    const subcategories = await subCategoryModel.find({
        _id: { $in: subcategoryIds },
        category: categoryId
    }, '_id');
    
    return subcategories.length === subcategoryIds.length;
};

// Type for validator middleware array
type ValidatorMiddleware = RequestHandler[];

export const createProductValidator: ValidatorMiddleware = [
    check("title")
        .trim()
        .isLength({ min: 3 })
        .withMessage("Title must be at least 3 characters")
        .notEmpty()
        .withMessage("Product title is required")
        .custom(async (val) => {
            if (await checkProductTitleExists(val)) {
                throw new Error(ERROR_MESSAGES.TITLE_EXISTS);
            }
            return true;
        }),

    check("description")
        .trim()
        .notEmpty()
        .withMessage("Product description is required")
        .isLength({ max: 2000 })
        .withMessage("Description is too long"),

    check("quantity")
        .notEmpty()
        .withMessage("Product quantity is required")
        .isInt({ min: 0 })
        .withMessage("Product quantity must be a non-negative number"),

    check("sold")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Sold quantity must be a non-negative number"),

    check("price")
        .notEmpty()
        .withMessage("Product price is required")
        .isFloat({ min: 0 })
        .withMessage("Product price must be a non-negative number")
        .custom((val) => {
            if (val.toString().length > 32) {
                throw new Error("Price is too long");
            }
            return true;
        }),

    check("priceAfterDiscount")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Price after discount must be a non-negative number")
        .custom((value, { req }) => {
            if (parseFloat(value) >= parseFloat(req.body.price)) {
                throw new Error(ERROR_MESSAGES.INVALID_DISCOUNT);
            }
            return true;
        }),

    check("colors")
        .optional()
        .isArray()
        .withMessage("Colors should be an array of strings")
        .custom((values: string[]) => {
            return values.every(color => typeof color === 'string' && color.trim().length > 0);
        })
        .withMessage("Each color must be a non-empty string"),

    check("imageCover")
        .notEmpty()
        .withMessage("Product image cover is required")
        .isURL()
        .withMessage("Image cover must be a valid URL"),

    check("images")
        .optional()
        .isArray()
        .withMessage("Images should be an array of strings")
        .custom((values: string[]) => {
            return values.every(img => typeof img === 'string' && img.trim().length > 0);
        })
        .withMessage("Each image must be a non-empty string"),

    check("category")
        .notEmpty()
        .withMessage("Product must belong to a category")
        .isMongoId()
        .withMessage(ERROR_MESSAGES.INVALID_ID)
        .custom(async (categoryId) => {
            const category = await categoryModel.findById(categoryId).select('_id');
            if (!category) {
                throw new Error(`No category found for ID: ${categoryId}`);
            }
            return true;
        }),

    check("subcategories")
        .optional()
        .isArray()
        .withMessage("Subcategories should be an array")
        .custom(async (subcategoryIds: string[], { req }) => {
            if (!Array.isArray(subcategoryIds) || !subcategoryIds.every(id => isValidMongoId(id))) {
                throw new Error("Invalid subcategory IDs format");
            }

            if (!await validateSubcategories(subcategoryIds, req.body.category)) {
                throw new Error(ERROR_MESSAGES.INVALID_SUBCATEGORIES);
            }
            return true;
        }),

    check("brand")
        .optional()
        .isMongoId()
        .withMessage(ERROR_MESSAGES.INVALID_ID),

    check("ratingsAverage")
        .optional()
        .isFloat({ min: 1, max: 5 })
        .withMessage(ERROR_MESSAGES.RATING_RANGE),

    check("ratingsQuantity")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Ratings quantity must be a non-negative number"),

    validatorMiddleware,
];

export const getProductValidator: ValidatorMiddleware = [
    check("id")
        .isMongoId()
        .withMessage(ERROR_MESSAGES.INVALID_ID),
    validatorMiddleware,
];

export const updateProductValidator: ValidatorMiddleware = [
    check("id")
        .isMongoId()
        .withMessage(ERROR_MESSAGES.INVALID_ID),
    
    body("title")
        .optional()
        .trim()
        .isLength({ min: 3 })
        .withMessage("Title must be at least 3 characters")
        .custom(async (val, { req }) => {
            const { id } = (req as Request<{ id: string }>).params;
            const existingProduct = await ProductModel.findOne({ 
                title: val,
                _id: { $ne: id }
            });
            if (existingProduct) {
                throw new Error(ERROR_MESSAGES.TITLE_EXISTS);
            }
            return true;
        }),

    // Reuse relevant validators from createProductValidator for other fields
    body("price")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Product price must be a non-negative number"),

    body("quantity")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Product quantity must be a non-negative number"),

    validatorMiddleware,
];

export const deleteProductValidator: ValidatorMiddleware = [
    check("id")
        .isMongoId()
        .withMessage(ERROR_MESSAGES.INVALID_ID),
    validatorMiddleware,
];