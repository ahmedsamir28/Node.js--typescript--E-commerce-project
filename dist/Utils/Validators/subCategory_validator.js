"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSubCategoryValidator = exports.updateSubCategoryValidator = exports.createSubCategoryValidator = exports.getSubCategoryValidator = void 0;
const { check } = require('express-validator');
const validatorMiddleware_1 = __importDefault(require("../../Middlewares/validatorMiddleware"));
exports.getSubCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid Subcategory id format'),
    validatorMiddleware_1.default,
];
exports.createSubCategoryValidator = [
    check('name')
        .notEmpty()
        .withMessage('SubCategory required')
        .isLength({ min: 2 })
        .withMessage('Too short Subcategory name')
        .isLength({ max: 32 })
        .withMessage('Too long Subcategory name'),
    check('category')
        .notEmpty()
        .withMessage('subCategory must be belong to category')
        .isMongoId()
        .withMessage('Invalid Category id format'),
    validatorMiddleware_1.default,
];
exports.updateSubCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid Subcategory id format'),
    validatorMiddleware_1.default,
];
exports.deleteSubCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid SubCategory id format'),
    validatorMiddleware_1.default,
];
