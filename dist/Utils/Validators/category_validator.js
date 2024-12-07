"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategoryValidator = exports.updateCategoryValidator = exports.createCategoryValidator = exports.getCategoryValidator = void 0;
const express_validator_1 = require("express-validator");
const validatorMiddleware_1 = __importDefault(require("../../Middlewares/validatorMiddleware"));
exports.getCategoryValidator = [
    (0, express_validator_1.check)("id").isMongoId().withMessage("Invalid category id format"),
    validatorMiddleware_1.default,
];
exports.createCategoryValidator = [
    (0, express_validator_1.check)("name")
        .notEmpty()
        .withMessage("Category required")
        .isLength({ min: 3 })
        .withMessage("Too short category name")
        .isLength({ max: 20 })
        .withMessage("Too long category name"),
    validatorMiddleware_1.default,
];
exports.updateCategoryValidator = [
    (0, express_validator_1.check)("id")
        .isMongoId()
        .withMessage("Invalid category id format"),
    (0, express_validator_1.check)("name")
        .optional()
        .notEmpty()
        .withMessage("Category required")
        .isLength({ min: 3 })
        .withMessage("Too short category name")
        .isLength({ max: 20 })
        .withMessage("Too long category name"),
    validatorMiddleware_1.default,
];
exports.deleteCategoryValidator = [
    (0, express_validator_1.check)("id").isMongoId().withMessage("Invalid category id format"),
    validatorMiddleware_1.default,
];
