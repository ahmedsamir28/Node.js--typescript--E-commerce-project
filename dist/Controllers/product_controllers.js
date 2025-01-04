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
exports.deleteProducts = exports.updateProduct = exports.getSpecificProduct = exports.getProducts = exports.createProduct = exports.resizeProductImages = exports.uploadProductImages = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const product_model_1 = __importDefault(require("../Model/product_model"));
const handlers_factory_controllers_1 = require("./handlers_factory_controllers");
const uploadImageMiddleware_1 = require("../Middlewares/uploadImageMiddleware");
const uuid_1 = require("uuid");
const sharp_1 = __importDefault(require("sharp"));
exports.uploadProductImages = (0, uploadImageMiddleware_1.uploadMixOfImages)([
    { name: "imageCover", maxCount: 1 },
    { name: "images", maxCount: 5 },
]);
exports.resizeProductImages = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // 1 - image processing for imageCover
    if (req.files.imageCover) {
        const imageCoverFileName = `product-${(0, uuid_1.v4)()}-${Date.now()}-cover.jpeg`;
        yield (0, sharp_1.default)(req.files.imageCover[0].buffer)
            .resize(2000, 1333)
            .toFormat("jpeg")
            .jpeg({ quality: 95 })
            .toFile(`Uploads/Products/${imageCoverFileName}`);
        // Save image into our db
        req.body.imageCover = imageCoverFileName;
    }
    // 2 - image processing for images
    if ((_a = req.files) === null || _a === void 0 ? void 0 : _a.images) {
        req.body.images = [];
        yield Promise.all(req.files.images.map((img, index) => __awaiter(void 0, void 0, void 0, function* () {
            const imageName = `product-${(0, uuid_1.v4)()}-${Date.now()}-${index + 1}.jpeg`;
            yield (0, sharp_1.default)(img.buffer)
                .resize(2000, 1333)
                .toFormat("jpeg")
                .jpeg({ quality: 95 })
                .toFile(`Uploads/Products/${imageName}`);
            // Save image into our db
            req.body.images.push(imageName);
            return imageName;
        })));
    }
    next();
}));
/**
 * @desc    Create a new product
 * @route   POST /api/v1/products
 * @access  Private
 */
exports.createProduct = (0, handlers_factory_controllers_1.createItem)(product_model_1.default);
/**
 * @desc    Get list of products
 * @route   GET /api/v1/products
 * @access  Public
 */
exports.getProducts = (0, handlers_factory_controllers_1.getAllItems)(product_model_1.default, 'Products');
/**
 * @desc    Get specific product
 * @route   GET /api/v1/products/:id
 * @access  Public
 */
exports.getSpecificProduct = (0, handlers_factory_controllers_1.getSpecificItem)(product_model_1.default);
/**
 * @desc    Update specific product
 * @route   UPDATE /api/v1/products/:id
 * @access  Private
 */
exports.updateProduct = (0, handlers_factory_controllers_1.updateItem)(product_model_1.default);
/**
 * @desc    Delete specific product
 * @route   DELETE /api/v1/products/:id
 * @access  Private
 */
exports.deleteProducts = (0, handlers_factory_controllers_1.deleteItem)(product_model_1.default);
