"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const brand_controllers_1 = require("../Controllers/brand_controllers");
const brand_validator_1 = require("../Utils/Validators/brand_validator");
const auth_controller_1 = require("../Controllers/auth_controller");
const router = express_1.default.Router();
router.route('/')
    .get(brand_controllers_1.getBrands)
    .post(auth_controller_1.protect, (0, auth_controller_1.allowedTo)('admin', 'manager'), brand_controllers_1.uploadBrandImage, brand_controllers_1.resizeBrandImage, brand_validator_1.createBrandValidator, brand_controllers_1.createBrand);
router.route('/:id').get(brand_validator_1.getBrandValidator, brand_controllers_1.getSpecificBrand).put(brand_validator_1.updateBrandValidator, brand_controllers_1.updateBrand).delete(brand_validator_1.deleteBrandValidator, brand_controllers_1.deleteBrand);
exports.default = router;
