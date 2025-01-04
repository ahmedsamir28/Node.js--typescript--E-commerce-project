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
exports.deleteUser = exports.updateUser = exports.getSpecificUser = exports.getUsers = exports.createUser = exports.resizeUserIMage = exports.uploadUserImage = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const uploadImageMiddleware_1 = require("../Middlewares/uploadImageMiddleware");
const handlers_factory_controllers_1 = require("./handlers_factory_controllers");
const uuid_1 = require("uuid");
const sharp_1 = __importDefault(require("sharp"));
const user_model_1 = __importDefault(require("../Model/user_model"));
const apiError_1 = __importDefault(require("../Utils/apiError"));
const user_model_2 = __importDefault(require("../Model/user_model"));
//Upload single image
exports.uploadUserImage = (0, uploadImageMiddleware_1.uploadSingleImage)('image');
//Image Proccessing with sharp
exports.resizeUserIMage = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const fileName = `user-${(0, uuid_1.v4)()}-${Date.now()}.jpeg`;
    if (req.file) {
        yield (0, sharp_1.default)(req.file.buffer)
            .resize(600, 600)
            .toFormat('jpeg')
            .toFile(`Uploads/Users/${fileName}`);
        // Save image into our db
        req.body.image = fileName;
    }
    next();
}));
/**
 * @desc    Create a new user
 * @route   POST /api/v1/users
 * @access  Private
 */
exports.createUser = (0, handlers_factory_controllers_1.createItem)(user_model_1.default);
/**
 * @desc    Get list of users
 * @route   GET /api/v1/users
 * @access  Public
 */
exports.getUsers = (0, handlers_factory_controllers_1.getAllItems)(user_model_1.default);
/**
 * @desc    Get specific user
 * @route   GET /api/v1/users/:id
 * @access  Public
 */
exports.getSpecificUser = (0, handlers_factory_controllers_1.getSpecificItem)(user_model_1.default);
/**
 * @desc    Update specific user
 * @route   UPDATE /api/v1/users/:id
 * @access  Private
 */
exports.updateUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const document = yield user_model_2.default.findByIdAndUpdate(id, req.body, { new: true });
    if (!document) {
        return next(new apiError_1.default(`No item for this ID ${id}`, 400));
    }
    res.status(200).json({ success: true, data: document });
}));
/**
 * @desc    Delete specific user
 * @route   DELETE /api/v1/users/:id
 * @access  Private
 */
exports.deleteUser = (0, handlers_factory_controllers_1.deleteItem)(user_model_1.default);
