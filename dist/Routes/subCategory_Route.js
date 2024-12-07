"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const subCategory_controllers_1 = require("../Controllers/subCategory_controllers");
const subCategory_validator_1 = require("../Utils/Validators/subCategory_validator");
// mergeParams: Allow us to access parameters on other routers
// ex: We need to access categoryId from category router
const router = express_1.default.Router({ mergeParams: true });
router
    .route('/')
    .get(subCategory_controllers_1.createFilterObj, subCategory_controllers_1.getSubCategories)
    .post(subCategory_controllers_1.setCategoryIdToBody, subCategory_validator_1.createSubCategoryValidator, subCategory_controllers_1.createSubCategory);
router
    .route('/:id')
    .get(subCategory_validator_1.getSubCategoryValidator, subCategory_controllers_1.getSpecificSubCategory)
    .put(subCategory_validator_1.updateSubCategoryValidator, subCategory_controllers_1.updateSubCategory)
    .delete(subCategory_validator_1.deleteSubCategoryValidator, subCategory_controllers_1.deleteSubCategory);
exports.default = router;
