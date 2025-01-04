"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSubCategory = exports.updateSubCategory = exports.getSpecificSubCategory = exports.getSubCategories = exports.createSubCategory = exports.createFilterObj = exports.setCategoryIdToBody = void 0;
const subCategory_model_1 = __importDefault(require("../Model/subCategory_model"));
const handlers_factory_controllers_1 = require("./handlers_factory_controllers");
// Middleware: Set category ID in the request body
const setCategoryIdToBody = (req, res, next) => {
    if (!req.body.category)
        req.body.category = req.params.categoryId;
    next();
};
exports.setCategoryIdToBody = setCategoryIdToBody;
/**
 * @desc    Create filter object for nested routes
 * @route   Middleware for GET requests
 */
const createFilterObj = (req, res, next) => {
    let filterObject = {};
    if (req.params.categoryId)
        filterObject = { category: req.params.categoryId };
    req.filterObj = filterObject;
    next();
};
exports.createFilterObj = createFilterObj;
/**
 * @desc    Create a new subCategory
 * @route   POST /api/v1/subcategories
 * @access  Private
 */
exports.createSubCategory = (0, handlers_factory_controllers_1.createItem)(subCategory_model_1.default);
/**
 * @desc    Get list of subCategories
 * @route   GET /api/v1/subcategories
 * @access  Public
 */
exports.getSubCategories = (0, handlers_factory_controllers_1.getAllItems)(subCategory_model_1.default);
/**
 * @desc    Get specific subCategory
 * @route   GET /api/v1/subcategories/:id
 * @access  Public
 */
exports.getSpecificSubCategory = (0, handlers_factory_controllers_1.getSpecificItem)(subCategory_model_1.default);
/**
 * @desc    Update specific subCategory
 * @route   PATCH /api/v1/subcategories/:id
 * @access  Private
 */
exports.updateSubCategory = (0, handlers_factory_controllers_1.updateItem)(subCategory_model_1.default);
/**
 * @desc    Delete specific subCategory
 * @route   DELETE /api/v1/subcategories/:id
 * @access  Private
 */
exports.deleteSubCategory = (0, handlers_factory_controllers_1.deleteItem)(subCategory_model_1.default);
