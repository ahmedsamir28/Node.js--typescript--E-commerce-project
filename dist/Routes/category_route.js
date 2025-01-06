"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const category_controllers_1 = require("../Controllers/category_controllers");
const category_validator_1 = require("../Utils/Validators/category_validator");
const subCategory_Route_1 = __importDefault(require("./subCategory_Route"));
const auth_controller_1 = require("../Controllers/auth_controller");
const router = express_1.default.Router();
router.use('/:categoryId/subcategories', subCategory_Route_1.default);
router.route('/')
    .get(category_controllers_1.getCategories)
    .post(auth_controller_1.protect, (0, auth_controller_1.allowedTo)('admin', 'manager'), category_controllers_1.uploadCategoryImage, category_controllers_1.resizeImage, category_validator_1.createCategoryValidator, category_controllers_1.createCategory);
router.route('/:id').get(category_validator_1.getCategoryValidator, category_controllers_1.getSpecificCategory).put(category_validator_1.updateCategoryValidator, category_controllers_1.updateCategory).delete(category_validator_1.deleteCategoryValidator, category_controllers_1.deleteCategory);
exports.default = router;
