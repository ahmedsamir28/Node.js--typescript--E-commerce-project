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
exports.deleteBrand = exports.updateBrand = exports.getSpecificBrand = exports.getBrands = exports.createBrand = exports.resizeBrandImage = exports.uploadBrandImage = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const uploadImageMiddleware_1 = require("../Middlewares/uploadImageMiddleware");
const brand_model_1 = __importDefault(require("../Model/brand_model"));
const handlers_factory_controllers_1 = require("./handlers_factory_controllers");
const uuid_1 = require("uuid");
const sharp_1 = __importDefault(require("sharp"));
//Upload single image
exports.uploadBrandImage = (0, uploadImageMiddleware_1.uploadSingleImage)('image');
//Image Proccessing with sharp
exports.resizeBrandImage = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
 * @desc    Create a new brands
 * @route   POST /api/v1/brands
 * @access  Private
 */
exports.createBrand = (0, handlers_factory_controllers_1.createItem)(brand_model_1.default);
/**
 * @desc    Get list of brands
 * @route   GET /api/v1/brands
 * @access  Public
 */
exports.getBrands = (0, handlers_factory_controllers_1.getAllItems)(brand_model_1.default);
/**
 * @desc    Get specific brands
 * @route   GET /api/v1/brands/:id
 * @access  Public
 */
exports.getSpecificBrand = (0, handlers_factory_controllers_1.getSpecificItem)(brand_model_1.default);
/**
 * @desc    Update specific brands
 * @route   UPDATE /api/v1/brands/:id
 * @access  Private
 */
exports.updateBrand = (0, handlers_factory_controllers_1.updateItem)(brand_model_1.default);
/**
 * @desc    Delete specific brands
 * @route   DELETE /api/v1/brands/:id
 * @access  Private
 */
exports.deleteBrand = (0, handlers_factory_controllers_1.deleteItem)(brand_model_1.default);
