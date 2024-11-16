"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Category_controllers_1 = require("../Controllers/Category_controllers");
const router = express_1.default.Router();
router.route('/').get(Category_controllers_1.getCategories).post(Category_controllers_1.createCategory);
router.route('/:id').get(Category_controllers_1.getSpecificCategory).put(Category_controllers_1.updateCategory).delete(Category_controllers_1.deleteCategory);
exports.default = router;
