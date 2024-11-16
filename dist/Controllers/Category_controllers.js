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
exports.deleteCategory = exports.updateCategory = exports.getSpecificCategory = exports.getCategories = exports.createCategory = void 0;
const asyncHandler = require('express-async-handler');
const category_schema_1 = __importDefault(require("../Model/category_schema"));
const slugify_1 = __importDefault(require("slugify"));
const apiError_1 = __importDefault(require("../Utils/apiError"));
/**
 * @desc    Create a new category
 * @route   POST /api/v1/categories
 * @access  Private
 */
exports.createCategory = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    const category = yield category_schema_1.default.create({ name, slug: (0, slugify_1.default)(name) });
    res.status(200).json({ data: category });
}));
/**
 * @desc    Get list of categories
 * @route   GET /api/v1/categories
 * @access  Public
 */
exports.getCategories = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 5;
    const skip = (page - 1) * limit;
    const categories = yield category_schema_1.default.find({}).skip(skip).limit(limit);
    res.status(200).json({ results: categories.length, page, success: true, data: categories });
}));
/**
 * @desc    Get specific category
 * @route   GET /api/v1/categories/:id
 * @access  Public
 */
exports.getSpecificCategory = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const category = yield category_schema_1.default.findById(id);
    if (!category) {
        return next(new apiError_1.default(`No category for this ID ${id}`, 404));
    }
    res.status(200).json({ success: true, data: category });
}));
/**
 * @desc    Update specific category
 * @route   UPDATE /api/v1/categories/:id
 * @access  Private
 */
exports.updateCategory = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name } = req.body;
    const categoryName = yield category_schema_1.default.findById(id);
    if ((categoryName === null || categoryName === void 0 ? void 0 : categoryName.name) === name) {
        return next(new apiError_1.default("The new category name is the same as the existing name.", 400));
    }
    const category = yield category_schema_1.default.findByIdAndUpdate({ _id: id }, { name, slug: (0, slugify_1.default)(name) }, { new: true });
    if (!category) {
        return next(new apiError_1.default(`No category for this ID ${id}`, 404));
    }
    res.status(200).json({ success: true, data: category });
}));
/**
 * @desc    Delete specific category
 * @route   DELETE /api/v1/categories/:id
 * @access  Private
 */
exports.deleteCategory = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const category = yield category_schema_1.default.findByIdAndDelete(id);
    if (!category) {
        return next(new apiError_1.default(`No category for this ID ${id}`, 404));
    }
    res.status(202).send();
}));
/**
 * @desc    Search categories by keyword
 * @route   GET /api/v1/categories/search
 * @access  Public
 */
// export const searchCategories = asyncHandler(async (req: Request, res: Response) => {
//     const keyword: string = req.query.keyword as string; // Define keyword type
//     if (!keyword) {
//         return res.status(400).json({ success: false, message: "Keyword is required" });
//     }
//     const regex = new RegExp(keyword, "i");
//     const categories = await categoryModel.find({
//         $or: [{ name: { $regex: regex } }],
//     });
//     res.status(200).json({ success: true, data: categories });
// });
