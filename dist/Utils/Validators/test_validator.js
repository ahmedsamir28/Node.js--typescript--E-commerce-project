"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProductValidator = exports.updateProductValidator = exports.getProductValidator = exports.createProductValidator = void 0;
const express_validator_1 = require("express-validator");
const mongoose_1 = require("mongoose");
const validatorMiddleware_1 = __importDefault(require("../../Middlewares/validatorMiddleware"));
const category_model_1 = __importDefault(require("../../Model/category_model"));
const subCategory_model_1 = __importDefault(require("../../Model/subCategory_model"));
const product_model_1 = __importDefault(require("../../Model/product_model"));
// Custom error messages for reusability
const ERROR_MESSAGES = {
    INVALID_ID: "Invalid ID format",
    TITLE_EXISTS: "Product with this title already exists",
    INVALID_DISCOUNT: "Price after discount must be lower than price",
    INVALID_SUBCATEGORIES: "Some subcategories do not belong to the specified category",
    RATING_RANGE: "Rating must be between 1.0 and 5.0",
};
// Helper functions for validation
const isValidMongoId = (id) => mongoose_1.Types.ObjectId.isValid(id);
const checkProductTitleExists = (title) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_model_1.default.findOne({ title }, 'title');
    return !!product;
});
const validateSubcategories = (subcategoryIds, categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    const subcategories = yield subCategory_model_1.default.find({
        _id: { $in: subcategoryIds },
        category: categoryId
    }, '_id');
    return subcategories.length === subcategoryIds.length;
});
exports.createProductValidator = [
    (0, express_validator_1.check)("title")
        .trim()
        .isLength({ min: 3 })
        .withMessage("Title must be at least 3 characters")
        .notEmpty()
        .withMessage("Product title is required")
        .custom((val) => __awaiter(void 0, void 0, void 0, function* () {
        if (yield checkProductTitleExists(val)) {
            throw new Error(ERROR_MESSAGES.TITLE_EXISTS);
        }
        return true;
    })),
    (0, express_validator_1.check)("description")
        .trim()
        .notEmpty()
        .withMessage("Product description is required")
        .isLength({ max: 2000 })
        .withMessage("Description is too long"),
    (0, express_validator_1.check)("quantity")
        .notEmpty()
        .withMessage("Product quantity is required")
        .isInt({ min: 0 })
        .withMessage("Product quantity must be a non-negative number"),
    (0, express_validator_1.check)("sold")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Sold quantity must be a non-negative number"),
    (0, express_validator_1.check)("price")
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
    (0, express_validator_1.check)("priceAfterDiscount")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Price after discount must be a non-negative number")
        .custom((value, { req }) => {
        if (parseFloat(value) >= parseFloat(req.body.price)) {
            throw new Error(ERROR_MESSAGES.INVALID_DISCOUNT);
        }
        return true;
    }),
    (0, express_validator_1.check)("colors")
        .optional()
        .isArray()
        .withMessage("Colors should be an array of strings")
        .custom((values) => {
        return values.every(color => typeof color === 'string' && color.trim().length > 0);
    })
        .withMessage("Each color must be a non-empty string"),
    (0, express_validator_1.check)("imageCover")
        .notEmpty()
        .withMessage("Product image cover is required")
        .isURL()
        .withMessage("Image cover must be a valid URL"),
    (0, express_validator_1.check)("images")
        .optional()
        .isArray()
        .withMessage("Images should be an array of strings")
        .custom((values) => {
        return values.every(img => typeof img === 'string' && img.trim().length > 0);
    })
        .withMessage("Each image must be a non-empty string"),
    (0, express_validator_1.check)("category")
        .notEmpty()
        .withMessage("Product must belong to a category")
        .isMongoId()
        .withMessage(ERROR_MESSAGES.INVALID_ID)
        .custom((categoryId) => __awaiter(void 0, void 0, void 0, function* () {
        const category = yield category_model_1.default.findById(categoryId).select('_id');
        if (!category) {
            throw new Error(`No category found for ID: ${categoryId}`);
        }
        return true;
    })),
    (0, express_validator_1.check)("subcategories")
        .optional()
        .isArray()
        .withMessage("Subcategories should be an array")
        .custom((subcategoryIds_1, _a) => __awaiter(void 0, [subcategoryIds_1, _a], void 0, function* (subcategoryIds, { req }) {
        if (!Array.isArray(subcategoryIds) || !subcategoryIds.every(id => isValidMongoId(id))) {
            throw new Error("Invalid subcategory IDs format");
        }
        if (!(yield validateSubcategories(subcategoryIds, req.body.category))) {
            throw new Error(ERROR_MESSAGES.INVALID_SUBCATEGORIES);
        }
        return true;
    })),
    (0, express_validator_1.check)("brand")
        .optional()
        .isMongoId()
        .withMessage(ERROR_MESSAGES.INVALID_ID),
    (0, express_validator_1.check)("ratingsAverage")
        .optional()
        .isFloat({ min: 1, max: 5 })
        .withMessage(ERROR_MESSAGES.RATING_RANGE),
    (0, express_validator_1.check)("ratingsQuantity")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Ratings quantity must be a non-negative number"),
    validatorMiddleware_1.default,
];
exports.getProductValidator = [
    (0, express_validator_1.check)("id")
        .isMongoId()
        .withMessage(ERROR_MESSAGES.INVALID_ID),
    validatorMiddleware_1.default,
];
exports.updateProductValidator = [
    (0, express_validator_1.check)("id")
        .isMongoId()
        .withMessage(ERROR_MESSAGES.INVALID_ID),
    (0, express_validator_1.body)("title")
        .optional()
        .trim()
        .isLength({ min: 3 })
        .withMessage("Title must be at least 3 characters")
        .custom((val_1, _a) => __awaiter(void 0, [val_1, _a], void 0, function* (val, { req }) {
        const { id } = req.params;
        const existingProduct = yield product_model_1.default.findOne({
            title: val,
            _id: { $ne: id }
        });
        if (existingProduct) {
            throw new Error(ERROR_MESSAGES.TITLE_EXISTS);
        }
        return true;
    })),
    // Reuse relevant validators from createProductValidator for other fields
    (0, express_validator_1.body)("price")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Product price must be a non-negative number"),
    (0, express_validator_1.body)("quantity")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Product quantity must be a non-negative number"),
    validatorMiddleware_1.default,
];
exports.deleteProductValidator = [
    (0, express_validator_1.check)("id")
        .isMongoId()
        .withMessage(ERROR_MESSAGES.INVALID_ID),
    validatorMiddleware_1.default,
];
