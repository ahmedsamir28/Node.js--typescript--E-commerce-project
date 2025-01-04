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
exports.deleteCategory = exports.updateCategory = exports.getSpecificCategory = exports.getCategories = exports.createCategory = exports.resizeImage = exports.uploadCategoryImage = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const uploadImageMiddleware_1 = require("../Middlewares/uploadImageMiddleware");
const category_model_1 = __importDefault(require("../Model/category_model"));
const handlers_factory_controllers_1 = require("./handlers_factory_controllers");
const uuid_1 = require("uuid");
const sharp_1 = __importDefault(require("sharp"));
//Upload single image
exports.uploadCategoryImage = (0, uploadImageMiddleware_1.uploadSingleImage)('image');
//Image Proccessing with sharp
exports.resizeImage = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const fileName = `category-${(0, uuid_1.v4)()}-${Date.now()}.jpeg`;
    if (req.file) {
        yield (0, sharp_1.default)(req.file.buffer)
            .resize(600, 600)
            .toFormat('jpeg')
            .toFile(`Uploads/Categories/${fileName}`);
        // Save image into our db
        req.body.image = fileName;
    }
    next();
}));
/**
 * @desc    Create a new category
 * @route   POST /api/v1/categories
 * @access  Private
 */
exports.createCategory = (0, handlers_factory_controllers_1.createItem)(category_model_1.default);
/**
 * @desc    Get list of categories
 * @route   GET /api/v1/categories
 * @access  Public
 */
exports.getCategories = (0, handlers_factory_controllers_1.getAllItems)(category_model_1.default);
/**
 * @desc    Get specific category
 * @route   GET /api/v1/categories/:id
 * @access  Public
 */
exports.getSpecificCategory = (0, handlers_factory_controllers_1.getSpecificItem)(category_model_1.default);
/**
 * @desc    Update specific category
 * @route   UPDATE /api/v1/categories/:id
 * @access  Private
 */
exports.updateCategory = (0, handlers_factory_controllers_1.updateItem)(category_model_1.default);
/**
 * @desc    Delete specific category
 * @route   DELETE /api/v1/categories/:id
 * @access  Private
 */
exports.deleteCategory = (0, handlers_factory_controllers_1.deleteItem)(category_model_1.default);
