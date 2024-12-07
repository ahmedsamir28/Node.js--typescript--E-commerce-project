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
exports.deleteBrand = exports.updateBrand = exports.getSpecificBrand = exports.getBrands = exports.createBrand = void 0;
const asyncHandler = require('express-async-handler');
const slugify_1 = __importDefault(require("slugify"));
const apiError_1 = __importDefault(require("../Utils/apiError"));
const brand_model_1 = __importDefault(require("../Model/brand_model"));
/**
 * @desc    Create a new brands
 * @route   POST /api/v1/brands
 * @access  Private
 */
exports.createBrand = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    const brand = yield brand_model_1.default.create({ name, slug: (0, slugify_1.default)(name) });
    res.status(201).json({ data: brand });
}));
/**
 * @desc    Get list of brands
 * @route   GET /api/v1/brands
 * @access  Public
 */
exports.getBrands = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 5;
    const skip = (page - 1) * limit;
    const brands = yield brand_model_1.default.find({}).skip(skip).limit(limit);
    res.status(200).json({ results: brands.length, page, success: true, data: brands });
}));
/**
 * @desc    Get specific brands
 * @route   GET /api/v1/brands/:id
 * @access  Public
 */
exports.getSpecificBrand = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const brand = yield brand_model_1.default.findById(id);
    if (!brand) {
        return next(new apiError_1.default(`No brand for this ID ${id}`, 404));
    }
    res.status(200).json({ success: true, data: brand });
}));
/**
 * @desc    Update specific brands
 * @route   UPDATE /api/v1/brands/:id
 * @access  Private
 */
exports.updateBrand = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name } = req.body;
    const brandName = yield brand_model_1.default.findById(id);
    if ((brandName === null || brandName === void 0 ? void 0 : brandName.name) === name) {
        return next(new apiError_1.default("The new brand name is the same as the existing name.", 400));
    }
    const brand = yield brand_model_1.default.findByIdAndUpdate({ _id: id }, { name, slug: (0, slugify_1.default)(name) }, { new: true });
    if (!brand) {
        return next(new apiError_1.default(`No brand for this ID ${id}`, 404));
    }
    res.status(200).json({ success: true, data: brand });
}));
/**
 * @desc    Delete specific brands
 * @route   DELETE /api/v1/brands/:id
 * @access  Private
 */
exports.deleteBrand = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const brand = yield brand_model_1.default.findByIdAndDelete(id);
    if (!brand) {
        return next(new apiError_1.default(`No brand for this ID ${id}`, 404));
    }
    res.status(202).send();
}));
