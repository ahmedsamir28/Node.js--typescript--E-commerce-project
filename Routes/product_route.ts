import express from 'express';
import { createProduct, deleteProducts, getProducts, getSpecificProduct, updateProduct } from '../Controllers/product_controllers';
import { createProductValidator, deleteProductValidator, getProductValidator, updateProductValidator } from '../Utils/Validators/product_validator';

const router = express.Router();


router.route('/').get(getProducts).post(createProductValidator,createProduct)
router.route('/:id').get(getProductValidator,getSpecificProduct).put(updateProductValidator,updateProduct).delete(deleteProductValidator,deleteProducts)


export default router;
