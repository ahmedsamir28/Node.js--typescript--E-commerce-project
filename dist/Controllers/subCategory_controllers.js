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
exports.deleteSubCategory = exports.updateSubCategory = exports.getSpecificSubCategory = exports.getSubCategories = exports.createFilterObj = exports.createSubCategory = exports.setCategoryIdToBody = void 0;
const asyncHandler = require("express-async-handler");
const slugify_1 = __importDefault(require("slugify"));
const apiError_1 = __importDefault(require("../Utils/apiError"));
const subCategory_model_1 = __importDefault(require("../Model/subCategory_model"));
// Middleware: Set category ID in the request body
const setCategoryIdToBody = (req, res, next) => {
    if (!req.body.category)
        req.body.category = req.params.categoryId;
    next();
};
exports.setCategoryIdToBody = setCategoryIdToBody;
/**
 * @desc    Create a new subCategory
 * @route   POST /api/v1/subcategories
 * @access  Private
 */
exports.createSubCategory = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, category } = req.body;
    const subCategory = yield subCategory_model_1.default.create({
        name,
        slug: (0, slugify_1.default)(name),
        category,
    });
    res.status(201).json({ data: subCategory });
}));
/**
 * @desc    Create filter object for nested routes
 * @route   Middleware for GET requests
 */
const createFilterObj = (req, res, next) => {
    let filterObject;
    if (req.params.categoryId)
        filterObject = { category: req.params.categoryId };
    req.filterObj = filterObject;
    next();
};
exports.createFilterObj = createFilterObj;
/**
 * @desc    Get list of subCategories
 * @route   GET /api/v1/subcategories
 * @access  Public
 */
exports.getSubCategories = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 5;
    const skip = (page - 1) * limit;
    // Default `req.filterObj` to an empty object if undefined
    const filter = req.filterObj || {};
    const subCategories = yield subCategory_model_1.default.find(filter).skip(skip).limit(limit);
    res.status(200).json({
        results: subCategories.length,
        page,
        success: true,
        data: subCategories,
    });
}));
/**
 * @desc    Get specific subCategory
 * @route   GET /api/v1/subcategories/:id
 * @access  Public
 */
exports.getSpecificSubCategory = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const subCategory = yield subCategory_model_1.default.findById(id);
    if (!subCategory) {
        return next(new apiError_1.default(`No subCategory found for ID ${id}`, 404));
    }
    res.status(200).json({ success: true, data: subCategory });
}));
/**
 * @desc    Update specific subCategory
 * @route   PATCH /api/v1/subcategories/:id
 * @access  Private
 */
exports.updateSubCategory = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name } = req.body;
    const existingSubCategory = yield subCategory_model_1.default.findById(id);
    if ((existingSubCategory === null || existingSubCategory === void 0 ? void 0 : existingSubCategory.name) === name) {
        return next(new apiError_1.default("The new name is the same as the existing name.", 400));
    }
    const subCategory = yield subCategory_model_1.default.findByIdAndUpdate(id, { name, slug: (0, slugify_1.default)(name) }, { new: true });
    if (!subCategory) {
        return next(new apiError_1.default(`No subCategory found for ID ${id}`, 404));
    }
    res.status(200).json({ success: true, data: subCategory });
}));
/**
 * @desc    Delete specific subCategory
 * @route   DELETE /api/v1/subcategories/:id
 * @access  Private
 */
exports.deleteSubCategory = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const subCategory = yield subCategory_model_1.default.findByIdAndDelete(id);
    if (!subCategory) {
        return next(new apiError_1.default(`No subCategory found for ID ${id}`, 404));
    }
    res.status(202).send();
}));
