"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_controllers_1 = require("../Controllers/product_controllers");
const product_validator_1 = require("../Utils/Validators/product_validator");
const router = express_1.default.Router();
router.route('/').get(product_controllers_1.getProducts).post(product_validator_1.createProductValidator, product_controllers_1.createProduct);
router.route('/:id').get(product_validator_1.getProductValidator, product_controllers_1.getSpecificProduct).put(product_validator_1.updateProductValidator, product_controllers_1.updateProduct).delete(product_validator_1.deleteProductValidator, product_controllers_1.deleteProducts);
exports.default = router;
