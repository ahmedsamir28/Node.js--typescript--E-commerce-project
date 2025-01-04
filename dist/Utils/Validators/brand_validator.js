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
exports.deleteBrandValidator = exports.updateBrandValidator = exports.createBrandValidator = exports.getBrandValidator = void 0;
const express_validator_1 = require("express-validator");
const validatorMiddleware_1 = __importDefault(require("../../Middlewares/validatorMiddleware"));
const brand_model_1 = __importDefault(require("../../Model/brand_model"));
const slugify_1 = __importDefault(require("slugify"));
exports.getBrandValidator = [
    (0, express_validator_1.check)("id").isMongoId().withMessage("Invalid Brand id format"),
    validatorMiddleware_1.default,
];
exports.createBrandValidator = [
    (0, express_validator_1.check)("name")
        .notEmpty()
        .withMessage("Brand required")
        .isLength({ min: 3 })
        .withMessage("Too short Brand name")
        .isLength({ max: 20 })
        .withMessage("Too long Brand name")
        .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
        // Custom validator to check uniqueness
        const brand = yield brand_model_1.default.findOne({ name: value });
        if (brand) {
            throw new Error('Brand name already exists');
        }
        return true;
    }))
        .custom((val, { req }) => {
        req.body.slug = (0, slugify_1.default)(val);
        return true;
    }),
    validatorMiddleware_1.default,
];
exports.updateBrandValidator = [
    (0, express_validator_1.check)("id")
        .isMongoId()
        .withMessage("Invalid Brand id format"),
    (0, express_validator_1.check)("name")
        .optional()
        .notEmpty()
        .withMessage("Brand required")
        .isLength({ min: 3 })
        .withMessage("Too short Brand name")
        .isLength({ max: 20 })
        .withMessage("Too long Brand name")
        .custom((val, { req }) => {
        req.body.slug = (0, slugify_1.default)(val);
        return true;
    }),
    validatorMiddleware_1.default,
];
exports.deleteBrandValidator = [
    (0, express_validator_1.check)("id").isMongoId().withMessage("Invalid Brand id format"),
    validatorMiddleware_1.default,
];
