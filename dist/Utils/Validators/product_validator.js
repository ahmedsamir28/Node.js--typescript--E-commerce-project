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
const validatorMiddleware_1 = __importDefault(require("../../Middlewares/validatorMiddleware"));
const category_model_1 = __importDefault(require("../../Model/category_model"));
const subCategory_model_1 = __importDefault(require("../../Model/subCategory_model"));
const product_model_1 = __importDefault(require("../../Model/product_model"));
exports.createProductValidator = [
    (0, express_validator_1.check)("title")
        .isLength({ min: 3 })
        .withMessage("Title must be at least 3 characters")
        .notEmpty()
        .withMessage("Product title is required")
        .custom((val_1, _a) => __awaiter(void 0, [val_1, _a], void 0, function* (val, { req }) {
        const product = yield product_model_1.default.findOne({ title: req.body.title });
        if (product) {
            throw new Error('Product with this title already exists');
        }
        return true;
    })),
    (0, express_validator_1.check)("description")
        .notEmpty()
        .withMessage("Product description is required")
        .isLength({ max: 2000 })
        .withMessage("Description is too long"),
    (0, express_validator_1.check)("quantity")
        .notEmpty()
        .withMessage("Product quantity is required")
        .isNumeric()
        .withMessage("Product quantity must be a number"),
    (0, express_validator_1.check)("sold")
        .optional()
        .isNumeric()
        .withMessage("Sold quantity must be a number"),
    (0, express_validator_1.check)("price")
        .notEmpty()
        .withMessage("Product price is required")
        .isNumeric()
        .withMessage("Product price must be a number")
        .isLength({ max: 32 })
        .withMessage("Price is too long"),
    (0, express_validator_1.check)("priceAfterDiscount")
        .optional()
        .isNumeric()
        .withMessage("Price after discount must be a number")
        .toFloat()
        .custom((value, { req }) => {
        if (req.body.price <= value) {
            throw new Error("Price after discount must be lower than price");
        }
        return true;
    }),
    (0, express_validator_1.check)("colors")
        .optional()
        .isArray()
        .withMessage("Colors should be an array of strings"),
    (0, express_validator_1.check)("imageCover").notEmpty().withMessage("Product image cover is required"),
    (0, express_validator_1.check)("images")
        .optional()
        .isArray()
        .withMessage("Images should be an array of strings"),
    (0, express_validator_1.check)("category")
        .notEmpty()
        .withMessage("Product must belong to a category")
        .isMongoId()
        .withMessage("Invalid category ID format")
        .custom((categoryId) => __awaiter(void 0, void 0, void 0, function* () {
        const category = yield category_model_1.default.findById(categoryId);
        if (!category) {
            throw new Error(`No category found for ID: ${categoryId}`);
        }
    })),
    (0, express_validator_1.check)("subcategories")
        .optional()
        .isArray()
        .withMessage("Subcategories should be an array")
        .custom((subcategoriesIds) => __awaiter(void 0, void 0, void 0, function* () {
        const subcategories = yield subCategory_model_1.default.find({
            _id: { $in: subcategoriesIds },
        });
        if (subcategories.length !== subcategoriesIds.length) {
            throw new Error("Invalid subcategory IDs");
        }
    }))
        .custom((val_1, _a) => __awaiter(void 0, [val_1, _a], void 0, function* (val, { req }) {
        const subCategories = yield subCategory_model_1.default.find({
            category: req.body.category,
        });
        const subCategoriesIdsInDB = subCategories.map((sub) => sub._id.toString());
        const isValid = val.every((id) => subCategoriesIdsInDB.includes(id));
        if (!isValid) {
            throw new Error("Some subcategories do not belong to the specified category");
        }
    })),
    (0, express_validator_1.check)("brand").optional().isMongoId().withMessage("Invalid brand ID format"),
    (0, express_validator_1.check)("ratingsAverage")
        .optional()
        .isNumeric()
        .withMessage("Ratings average must be a number")
        .isFloat({ min: 1, max: 5 })
        .withMessage("Rating must be between 1.0 and 5.0"),
    (0, express_validator_1.check)("ratingsQuantity")
        .optional()
        .isNumeric()
        .withMessage("Ratings quantity must be a number"),
    validatorMiddleware_1.default,
];
exports.getProductValidator = [
    (0, express_validator_1.check)("id").isMongoId().withMessage("Invalid ID format"),
    validatorMiddleware_1.default,
];
exports.updateProductValidator = [
    (0, express_validator_1.check)("id").isMongoId().withMessage("Invalid ID format"),
    (0, express_validator_1.body)("title")
        .optional()
        .custom((val_1, _a) => __awaiter(void 0, [val_1, _a], void 0, function* (val, { req }) {
        const { id } = req.params;
        const productName = yield product_model_1.default.findById(id);
        if ((productName === null || productName === void 0 ? void 0 : productName.title) === req.body.title) {
            throw new Error('Product with this title already exists');
        }
        return true;
    })),
    validatorMiddleware_1.default,
];
exports.deleteProductValidator = [
    (0, express_validator_1.check)("id").isMongoId().withMessage("Invalid ID format"),
    validatorMiddleware_1.default,
];
